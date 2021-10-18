import { Users } from "react-feather";
import ListHeader from "../ListHeader";
import styles from "./list.module.scss";

const ParticipantsList = () => {
  return (
    <div>
      <ListHeader listName="Participants" icon={Users} />
    </div>
  );
};

export default ParticipantsList;
