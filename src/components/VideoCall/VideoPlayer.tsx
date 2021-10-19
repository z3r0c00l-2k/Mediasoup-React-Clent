import { FC, useContext, useEffect, useRef, useState } from "react";
import styles from "./videoCall.module.scss";
import { Mic, MicOff } from "react-feather";
import { MediaSoupContext } from "../../contexts/MediaSoupContext";

type Props = {
  isMain?: boolean;
};

const VideoPlayer: FC<Props> = ({ isMain = false }) => {
  const { localStream, showLocalStream, remoteStream, showRemoteStream } =
    useContext(MediaSoupContext);

  const [isMuted, setIsMuted] = useState(true);

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
    <div className={styles.videoPlayerContainer}>
      <video autoPlay className={styles.videoPlayer} ref={remoteVideoRef} />
      <div className={styles.userDetails}>
        <div className={styles.userName}>Jane Doe</div>
        <div className={styles.userStatus} />
      </div>
      <div
        className={[styles.micButton, isMuted && styles.muted].join(" ")}
        onClick={() => setIsMuted(!isMuted)}
      >
        {isMuted ? <MicOff /> : <Mic />}
      </div>
      {isMain && (
        <div className={styles.userVideoContainer}>
          <video
            className={styles.userVideo}
            autoPlay
            muted
            ref={localVideoRef}
          />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
