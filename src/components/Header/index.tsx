import styles from "./header.module.scss";

const Header = () => {
  return (
    <div className={styles.headerContainer}>
      <div className={styles.meetingName}>Meeting Op #1</div>
      <div className={styles.userContainer}>
        <div className={styles.userName}>Jack Cooper</div>
        <img
          src="https://i.pravatar.cc/300"
          alt=""
          className={styles.userAvatar}
        />
      </div>
    </div>
  );
};

export default Header;
