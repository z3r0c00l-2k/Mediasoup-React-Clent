import { useContext } from "react";
import { Mic, MicOff, Monitor, Camera } from "react-feather";
import { AppContext } from "../../contexts/AppContext";
import { MediaSoupContext } from "../../contexts/MediaSoupContext";
import IconButton from "../IconButton.js";
import styles from "./videoCall.module.scss";

const ActionBar = () => {
  const { isWebCam, setIsWebCam, isMuted, setIsMuted, isStarted } =
    useContext(AppContext);

  const { onStartCall, isReady } = useContext(MediaSoupContext);

  return (
    <div className={styles.actionContainer}>
      <IconButton
        icon={isMuted ? MicOff : Mic}
        onClick={() => setIsMuted(!isMuted)}
        isHighlighted={!isMuted}
      />
      <button
        className={[
          styles.meetingActionButton,
          isStarted && styles.endButton,
        ].join(" ")}
        onClick={onStartCall}
        disabled={!isReady}
      >
        {isStarted ? "End Meeting" : "Start Meeting"}
      </button>
      <IconButton
        icon={isWebCam ? Camera : Monitor}
        onClick={() => setIsWebCam(!isWebCam)}
        isHighlighted={!isWebCam}
      />
    </div>
  );
};

export default ActionBar;
