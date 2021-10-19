import { useContext } from "react";
import { AppContext } from "../../contexts/AppContext";
import styles from "./header.module.scss";

const Header = () => {
  const { userData } = useContext(AppContext);

  return (
    <div className={styles.headerContainer}>
      <div className={styles.meetingName}>Meeting Op #1</div>
      <div className={styles.userContainer}>
        <div className={styles.userName}>{userData?.name}</div>
        <img src={userData?.avatar} alt="" className={styles.userAvatar} />
      </div>
    </div>
  );
};

export default Header;
