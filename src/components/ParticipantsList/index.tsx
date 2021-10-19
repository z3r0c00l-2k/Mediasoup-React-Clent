import { Users } from "react-feather";
import ListHeader from "../ListHeader";
import styles from "./list.module.scss";
import UserItem from "./UserItem";
import Faker from "faker";

const ParticipantsList = () => {
  return (
    <div className={styles.userListContainer}>
      <ListHeader listName="Participants" icon={Users} listCount={10} />
      <div className={styles.listContainer}>
        {[...Array(10)].map((_, index) => (
          <UserItem
            key={index}
            name={Faker.name.firstName()}
            avatar={Faker.image.avatar()}
            isMuted
          />
        ))}
      </div>
    </div>
  );
};

export default ParticipantsList;
