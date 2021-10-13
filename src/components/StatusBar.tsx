import { useContext } from "react";
import { AppContext } from "../contexts/AppContext";

const StatusBar = () => {
  const { status } = useContext(AppContext);

  return (
    <div className="row">
      <h5 id="tvSubStatus" className="text-center">
        Status : {status}
      </h5>
    </div>
  );
};

export default StatusBar;
