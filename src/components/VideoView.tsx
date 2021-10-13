import { useContext, useEffect, useRef } from "react";
import { AppContext } from "../contexts/AppContext";

const VideoView = () => {
  const { localStream, showLocalStream, remoteStream, showRemoteStream } =
    useContext(AppContext);

  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const localVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (showLocalStream) {
      localVideoRef.current!.srcObject = localStream;
    }
  }, [showLocalStream, localStream]);

  useEffect(() => {
    if (showRemoteStream) {
      remoteVideoRef.current!.srcObject = remoteStream;
    }
  }, [showRemoteStream, remoteStream]);

  return (
    <div className="row">
      <div className="video-container">
        <video autoPlay id="remoteVideo" ref={remoteVideoRef} />
        <video autoPlay id="localVideo" ref={localVideoRef} />
      </div>
    </div>
  );
};

export default VideoView;
