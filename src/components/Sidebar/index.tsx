import styles from "./sidebar.module.scss";
import { Home, MessageSquare, Clock, Calendar, Settings } from "react-feather";
import IconButton from "../IconButton.js";

const Sidebar = () => {
  return (
    <div className={styles.sidebarContainer}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.appLogo}
      >
        <rect width="40" height="40" rx="10" fill="#0E78F8" />
        <path
          d="M31 15L24 20L31 25V15Z"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M22 13H11C9.89543 13 9 13.8954 9 15V25C9 26.1046 9.89543 27 11 27H22C23.1046 27 24 26.1046 24 25V15C24 13.8954 23.1046 13 22 13Z"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <div className={styles.navMenu}>
        {MENU.map((item) => (
          <div key={item.title} className={styles.navItem}>
            {<item.icon />}
          </div>
        ))}
      </div>
      <IconButton icon={Settings} className="mx-auto" />
    </div>
  );
};

export default Sidebar;

const MENU = [
  { title: "Home", icon: Home },
  { title: "Messages", icon: MessageSquare },
  { title: "Recent", icon: Clock },
  { title: "Calender", icon: Calendar },
];
