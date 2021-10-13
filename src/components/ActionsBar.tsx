import { useContext, useState } from "react";
import { AppContext } from "../contexts/AppContext";

const ActionsBar = () => {
  const {
    isCameraDisabled,
    isScreenDisabled,
    sendSocketMessage,
    setIsWebCam,
    device,
  } = useContext(AppContext);

  const [isSubscribeDisabled, setIsSubscribeDisabled] = useState(false);

  const onPublish = (isWebCam: boolean) => {
    setIsWebCam(isWebCam);

    setTimeout(() => {
      const message = {
        type: "createProducerTransport",
        forceTcp: false,
        rtpCapabilities: device?.rtpCapabilities,
      };
      sendSocketMessage(message);
    }, 500);
  };

  const onSubscribe = () => {
    setIsSubscribeDisabled(true);
    const message = { type: "createConsumerTransport", forceTcp: false };
    sendSocketMessage(message);
  };

  return (
    <div className="d-flex flex-row justify-content-center">
      <button
        className="btn btn-primary m-4"
        id="btnSub"
        onClick={onSubscribe}
        disabled={isSubscribeDisabled}
      >
        Subscribe
      </button>
      <button
        className="btn btn-primary m-4"
        id="btnScreen"
        disabled={isScreenDisabled}
        onClick={() => onPublish(false)}
      >
        Screen
      </button>
      <button
        className="btn btn-primary m-4"
        id="btnCam"
        disabled={isCameraDisabled}
        onClick={() => onPublish(true)}
      >
        Camera
      </button>
    </div>
  );
};

export default ActionsBar;
