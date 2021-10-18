import { useState } from "react";
import { Mic, MicOff, Monitor, Camera } from "react-feather";
import IconButton from "../IconButton.js";
import styles from "./videoCall.module.scss";

const ActionBar = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isWebCam, setIsWebCam] = useState(false);
  const [isStarted, setIsStarted] = useState(true);

  return (
    <div className={styles.actionContainer}>
      <IconButton
        icon={isMuted ? MicOff : Mic}
        onClick={() => setIsMuted(!isMuted)}
        isHighlighted={!isMuted}
      />
      <div
        className={[
          styles.meetingActionButton,
          isStarted && styles.endButton,
        ].join(" ")}
      >
        {isStarted ? "End Meeting" : "Start Meeting"}
      </div>
      <IconButton
        icon={isWebCam ? Camera : Monitor}
        onClick={() => setIsWebCam(!isWebCam)}
        isHighlighted={!isWebCam}
      />
    </div>
  );
};

export default ActionBar;
