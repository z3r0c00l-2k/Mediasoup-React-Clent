import { FC, useState } from "react";
import styles from "./videoCall.module.scss";
import { Mic, MicOff } from "react-feather";

type Props = {
  isMain?: boolean;
};

const VideoPlayer: FC<Props> = ({ isMain = false }) => {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <div className={styles.videoPlayerContainer}>
      <video
        muted={isMuted}
        autoPlay
        src="https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_30MB.mp4"
        className={styles.videoPlayer}
        loop
      />
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
            src="https://test-videos.co.uk/vids/jellyfish/mp4/h264/360/Jellyfish_360_10s_30MB.mp4"
            className={styles.userVideo}
            autoPlay
            muted
            loop
          />
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
