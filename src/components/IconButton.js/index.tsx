import { FC } from "react";
import { Icon } from "react-feather";
import styles from "./iconButton.module.scss";

type Props = {
  icon: Icon;
  className?: string;
  onClick?: () => void;
  isHighlighted?: boolean;
};

const IconButton: FC<Props> = ({
  icon: Icon,
  className = "",
  onClick,
  isHighlighted,
}) => {
  return (
    <div
      className={[
        styles.iconBtnContainer,
        className,
        isHighlighted && styles.iconHighlighted,
      ].join(" ")}
      onClick={onClick}
    >
      {<Icon />}
    </div>
  );
};

export default IconButton;
