import { createContext, FC, useEffect, useRef, useState } from "react";
import { Device, types as mediasoupTypes } from "mediasoup-client";
import { parseJson } from "../utils";
import stream from "stream";

const SOCKET_URL = "ws://192.168.1.12:8000/ws";

type ProviderProps = {
  webSocket: WebSocket | null;
  sendSocketMessage: (message: any) => void;
  isScreenDisabled: boolean;
  isCameraDisabled: boolean;
  setIsWebCam: (bool: boolean) => void;
  device: mediasoupTypes.Device | null;
  showLocalStream: boolean;
  showRemoteStream: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  status: string;
};

const AppContext = createContext({} as ProviderProps);

const AppContextProvider: FC = ({ children }) => {
  const [isScreenDisabled, setIsScreenDisabled] = useState(true);
  const [isCameraDisabled, setIsCameraDisabled] = useState(true);
  const [status, setStatus] = useState("");
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [showLocalStream, setShowLocalStream] = useState(false);
  const [showRemoteStream, setShowRemoteStream] = useState(false);

  const webSocketRef = useRef<WebSocket | null>(null);
  const deviceRef = useRef<mediasoupTypes.Device | null>(null);
  const callbackRef = useRef<any>(null);
  const producerRef = useRef<mediasoupTypes.Producer | null>(null);
  const consumeTransportRef = useRef<mediasoupTypes.Transport | null>(null);
  const isWebCamRef = useRef(true);

  useEffect(() => {
    webSocketRef.current = new WebSocket(SOCKET_URL);
    webSocketRef.current.onopen = onSocketOpen;
    webSocketRef.current.onclose = onSocketClose;
    webSocketRef.current.onmessage = onMessage;

    return () => {
      webSocketRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSocketOpen = () => {
    console.log({ socket: "Opened" });
    sendSocketMessage({ type: "getRouterRtpCapabilities" });
  };

  const onSocketClose = () => {
    console.log({ socket: "Closed" });
  };

  const onMessage = (event: MessageEvent<any>) => {
    const resp = parseJson(event.data);

    if (!resp) {
      console.error("Invalid Response Received", event);
      return;
    }

    switch (resp.type) {
      case "routerCapability":
        onRouterRtpCapabilities(resp);
        break;
      case "producerTransportCreated":
        onProducerTransportCreated(resp);
        break;
      case "producerConnected":
        if (callbackRef.current) {
          console.log("Peer Connected");
          callbackRef.current();
        }
        break;
      case "published":
        if (callbackRef.current) {
          console.log("Published");
          callbackRef.current(resp.data.id);
        }
        break;
      case "subTransportCreated":
        onSubTransportCreated(resp);
        break;
      case "subConnected":
        if (callbackRef.current) {
          console.log("Subscribed");
          callbackRef.current();
        }
        break;
      case "resumed":
        console.log("Resumed");
        break;
      case "subscribed":
        onSubscribed(resp);
        break;
      default:
        break;
    }
  };

  const onSubTransportCreated = (resp: any) => {
    if (resp.error) {
      return console.error("Error on server", resp.error);
    }

    const transport = deviceRef.current?.createRecvTransport(resp.data);

    consumeTransportRef.current = transport || null;

    transport?.on("connect", ({ dtlsParameters }, callback, errback) => {
      callbackRef.current = callback;
      const message = {
        type: "connectConsumerTransport",
        transportId: transport.id,
        dtlsParameter: dtlsParameters,
      };
      sendSocketMessage(message);
    });

    transport?.on(
      "connectionstatechange",
      async (state: mediasoupTypes.ConnectionState) => {
        switch (state) {
          case "connecting":
            setStatus("Subscribing...");
            break;

          case "connected":
            setShowRemoteStream(true);
            sendSocketMessage({
              type: "resume",
            });
            setStatus("Subscribed.");
            break;

          case "failed":
            transport.close();
            setStatus("Failed");
            break;
          default:
            break;
        }
      }
    );

    const message = {
      type: "consume",
      rtpCapabilities: deviceRef.current?.rtpCapabilities,
    };
    sendSocketMessage(message);
  };

  const onSubscribed = async (resp: any) => {
    const { producerId, id, kind, rtpParameters } = resp.data;
    const codecOptions = {};
    const consumer = await consumeTransportRef.current?.consume({
      id,
      producerId,
      kind,
      rtpParameters,
    });

    const stream = new MediaStream();
    stream.addTrack(consumer!.track);
    setRemoteStream(stream);
  };

  const onProducerTransportCreated = async (resp: any) => {
    if (resp.error) {
      return console.error("Error on server", resp.error);
    }

    const transport = deviceRef.current?.createSendTransport(resp.data);

    transport?.on("connect", ({ dtlsParameters }, callback, errback) => {
      callbackRef.current = callback;
      const message = {
        type: "connectConsumerTransport",
        transportId: transport.id,
        dtlsParameter: dtlsParameters,
      };
      sendSocketMessage(message);
    });

    transport?.on("connect", async ({ dtlsParameters }, callback, errback) => {
      callbackRef.current = callback;
      sendSocketMessage({ type: "connectProducerTransport", dtlsParameters });
    });

    transport?.on(
      "produce",
      async ({ kind, rtpParameters }, callback, errback) => {
        callbackRef.current = callback;
        sendSocketMessage({
          type: "produce",
          transportId: transport.id,
          kind,
          rtpParameters,
        });
      }
    );

    transport?.on(
      "connectionstatechange",
      (state: mediasoupTypes.ConnectionState) => {
        switch (state) {
          case "connecting":
            setStatus("Publishing...");
            break;
          case "connected":
            setShowLocalStream(true);
            setStatus("Published.");
            setIsCameraDisabled(true);
            setIsScreenDisabled(true);
            break;
          case "failed":
            transport.close();
            setStatus("Failed");
            break;
          default:
            break;
        }
      }
    );

    try {
      const stream = await getUserMedia(isWebCamRef.current);
      setLocalStream(stream || null);
      const track = stream?.getVideoTracks()[0];
      producerRef.current = (await transport?.produce({ track })) || null;
    } catch (error) {
      console.error(error);
      setStatus("Failed");
    }
  };

  const onRouterRtpCapabilities = async (resp: any) => {
    loadDevices(resp.data);
    setIsScreenDisabled(false);
    setIsCameraDisabled(false);
  };

  const sendSocketMessage = (message: any) => {
    if (!webSocketRef.current) {
      return console.error("Socket Not Initialized");
    }
    webSocketRef.current.send(JSON.stringify(message));
  };

  const loadDevices = async (
    routerRtpCapabilities: mediasoupTypes.RtpCapabilities
  ) => {
    try {
      deviceRef.current = new Device();
      await deviceRef.current.load({ routerRtpCapabilities });
    } catch (error) {
      if ((error as Error).name === "UnsupportedError") {
        console.log("Not Supported Error", error);
      }
    }
  };

  const getUserMedia = async (isWebCam: boolean) => {
    if (!deviceRef.current?.canProduce("video")) {
      console.error("Cannot Produce Video");
      return;
    }
    let stream: MediaStream;
    try {
      stream = isWebCam
        ? await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          })
        : await navigator.mediaDevices.getDisplayMedia({ video: true });
    } catch (error) {
      console.error("Error on creating local stream", error);
      throw error;
    }

    return stream;
  };

  const setIsWebCam = (isWebCam: boolean) => (isWebCamRef.current = isWebCam);

  return (
    <AppContext.Provider
      value={{
        webSocket: webSocketRef.current,
        sendSocketMessage,
        isScreenDisabled,
        isCameraDisabled,
        setIsWebCam,
        device: deviceRef.current,
        showLocalStream,
        showRemoteStream,
        localStream,
        remoteStream,
        status,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
