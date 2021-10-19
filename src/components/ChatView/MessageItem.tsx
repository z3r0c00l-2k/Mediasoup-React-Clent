import { FC } from "react";
import styles from "./chatView.module.scss";
import moment from "moment";

type Props = {
  name: string;
  avatar: string;
  message: string;
  timestamp: number;
  isSent?: boolean;
};

const MessageItem: FC<Props> = ({
  name,
  avatar,
  message,
  timestamp,
  isSent,
}) => {
  return (
    <div className={styles.messageItem}>
      <img src={avatar} alt="" className={styles.userAvatar} />
      <div className={styles.messageContainer}>
        <div className={styles.userName}>{name}</div>
        <div className={styles.messageContent}>{message}</div>
      </div>
      <div className={styles.messageTime}>
        {moment(timestamp).format("hh:mm a")}
      </div>
    </div>
  );
};

export default MessageItem;
