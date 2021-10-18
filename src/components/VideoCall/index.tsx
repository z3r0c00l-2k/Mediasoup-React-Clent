import ActionBar from "./ActionBar";
import styles from "./videoCall.module.scss";
import VideoPlayer from "./VideoPlayer";

const VideoCall = () => {
  return (
    <div className="w-4/6 flex flex-col h-full">
      <div className={styles.videoContainer}>
        <div className={styles.mainVideo}>
          <VideoPlayer isMain />
        </div>
        <div className={styles.extraVideoContainer}>
          {[...Array(5)].map((_, index) => (
            <div key={index} className={styles.extraVideo}>
              <VideoPlayer />
            </div>
          ))}
        </div>
      </div>
      <ActionBar />
    </div>
  );
};

export default VideoCall;
