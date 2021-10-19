import { FC } from "react";
import { Icon, ChevronUp } from "react-feather";
import styles from "./listHeader.module.scss";

type Props = {
  icon: Icon;
  listName: string;
  listCount?: number;
  isExpandEnabled?: boolean;
};

const ListHeader: FC<Props> = ({
  icon: Icon,
  listName,
  isExpandEnabled,
  listCount,
}) => {
  return (
    <div className={styles.listHeader}>
      <div className={styles.listIcon}>
        <Icon />
      </div>
      <div className={styles.listName}>
        {`${listName} ${listCount ? `(${listCount})` : ""}`.trim()}
      </div>
      {isExpandEnabled && (
        <div className={styles.expandBtn}>
          <ChevronUp />
        </div>
      )}
    </div>
  );
};

export default ListHeader;
