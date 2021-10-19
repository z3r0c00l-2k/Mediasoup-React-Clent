import { FormEvent, useState } from "react";
import styles from "./chatView.module.scss";

const ChatActionBar = () => {
  const [chatInput, setChatInput] = useState("");

  const onChatInputSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <form className={styles.chatActionBar} onSubmit={onChatInputSubmit}>
      <input
        type="text"
        className={styles.chatInput}
        placeholder="Type to write a message"
        value={chatInput}
        onChange={(e) => setChatInput(e.target.value)}
      />
      <button className={styles.sendBtn} disabled={!chatInput} type="submit">
        Send
      </button>
    </form>
  );
};

export default ChatActionBar;
