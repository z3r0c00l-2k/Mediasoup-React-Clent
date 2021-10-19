import { FC } from "react";
import styles from "./list.module.scss";
import { Mic, MicOff, Video, VideoOff } from "react-feather";

type Props = {
  avatar: string;
  name: string;
  isMuted?: boolean;
  isVideoDisabled?: boolean;
};

const UserItem: FC<Props> = ({ avatar, name, isMuted, isVideoDisabled }) => {
  return (
    <div className={styles.userItemContainer}>
      <img src={avatar} alt="" className={styles.userAvatar} />
      <div className={styles.userName}>{name}</div>
      <div className={isMuted ? styles.statusDisabled : ""}>
        {isMuted ? <MicOff /> : <Mic />}
      </div>
      <div className={isVideoDisabled ? styles.statusDisabled : ""}>
        {isVideoDisabled ? <VideoOff /> : <Video />}
      </div>
    </div>
  );
};

export default UserItem;
