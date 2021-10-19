import { MessageCircle } from "react-feather";
import ListHeader from "../ListHeader";
import styles from "./chatView.module.scss";
import MessageItem from "./MessageItem";
import Faker from "faker";
import ChatActionBar from "./ChatActionBar";

const ChatView = () => {
  return (
    <div className={styles.chatViewContainer}>
      <ListHeader
        listName="Chat"
        icon={MessageCircle}
        listCount={10}
        isExpandEnabled
      />
      <div className={styles.messageList}>
        {[...Array(10)].map((_, index) => (
          <MessageItem
            key={index}
            avatar={Faker.image.avatar()}
            name={Faker.name.firstName()}
            timestamp={Date.now()}
            message={Faker.git.commitMessage()}
          />
        ))}
      </div>
      <ChatActionBar />
    </div>
  );
};

export default ChatView;
