import { createContext, FC, useEffect, useRef, useState } from "react";
import { Device, types as mediasoupTypes } from "mediasoup-client";
import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";

const SOCKET_IO = "https://4721-103-151-188-165.ngrok.io/";

type ProviderProps = {
  sendSocketMessage: (
    event: string,
    payload: any,
    callback?: (response: any) => void
  ) => void;
  isScreenDisabled: boolean;
  isCameraDisabled: boolean;
  setIsWebCam: (bool: boolean) => void;
  device: mediasoupTypes.Device | null;
  showLocalStream: boolean;
  showRemoteStream: boolean;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  status: string;
  onProducerTransportCreatedCallBack: (response: any) => void;
  onSubTransportCreatedCallback: (response: any) => void;
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

  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap> | null>(
    null
  );
  const deviceRef = useRef<mediasoupTypes.Device | null>(null);
  const producerRef = useRef<mediasoupTypes.Producer | null>(null);
  const consumeTransportRef = useRef<mediasoupTypes.Transport | null>(null);
  const isWebCamRef = useRef(true);

  useEffect(() => {
    socketRef.current = io(SOCKET_IO);

    socketRef.current.on("connect", () => {
      console.log("Connected", socketRef.current?.id);
      onSocketOpen();
    });

    return () => {
      socketRef.current?.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSocketOpen = () => {
    console.log({ socket: "Opened" });
    sendSocketMessage("getRouterRtpCapabilities", null, (response: any) => {
      setStatus("Ready!!!");
      loadDevices(response);
      setIsScreenDisabled(false);
      setIsCameraDisabled(false);
    });
  };

  const onSubTransportCreatedCallback = (resp: any) => {
    if (resp.error) {
      setStatus(resp.error);
      return console.error("Error on server", resp.error);
    }

    const transport = deviceRef.current?.createRecvTransport(resp);

    consumeTransportRef.current = transport || null;

    transport?.on("connect", ({ dtlsParameters }, callback, errback) => {
      const payload = {
        transportId: transport.id,
        dtlsParameters: dtlsParameters,
      };
      sendSocketMessage("connectConsumerTransport", payload, (resp: any) => {
        callback();
        setStatus(resp.error || resp.message);
      });
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
            sendSocketMessage("resume", null, (response) => {
              console.log({ response });
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

    sendSocketMessage(
      "consume",
      {
        rtpCapabilities: deviceRef.current?.rtpCapabilities,
      },
      async (response) => {
        const { producerId, id, kind, rtpParameters } = response;
        const consumer = await consumeTransportRef.current?.consume({
          id,
          producerId,
          kind,
          rtpParameters,
        });

        const stream = new MediaStream();
        stream.addTrack(consumer!.track);
        setRemoteStream(stream);
      }
    );
  };

  const onProducerTransportCreatedCallBack = async (response: any) => {
    if (response.error) {
      setStatus(response.error);
      return console.error("Error on server", response.error);
    }

    const transport = deviceRef.current?.createSendTransport(response);

    // transport?.on("connect", ({ dtlsParameters }, callback, errback) => {
    //   callbackRef.current = callback;
    //   const payload = {
    //     transportId: transport.id,
    //     dtlsParameter: dtlsParameters,
    //   };
    //   sendSocketMessage("connectConsumerTransport", payload);
    // });

    transport?.on("connect", async ({ dtlsParameters }, callback, errback) => {
      sendSocketMessage(
        "connectProducerTransport",
        { dtlsParameters },
        (resp: any) => {
          setStatus(resp.message);
          callback(response.id);
        }
      );
    });

    transport?.on(
      "produce",
      async ({ kind, rtpParameters }, callback, errback) => {
        sendSocketMessage(
          "produce",
          {
            transportId: transport.id,
            kind,
            rtpParameters,
          },
          (resp: any) => {
            console.log("Producer ID", resp.id);
            // check here
            callback(response.id);
          }
        );
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

  const sendSocketMessage = (
    event: string,
    payload: any,
    callback?: (response: any) => void
  ) => {
    if (!socketRef.current) {
      return console.error("Socket Not Initialized");
    }
    socketRef.current.emit(event, payload, callback);
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
        onProducerTransportCreatedCallBack,
        onSubTransportCreatedCallback,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContext, AppContextProvider };
