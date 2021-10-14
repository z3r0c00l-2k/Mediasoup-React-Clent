import { useContext, useState } from "react";
import { AppContext } from "../contexts/AppContext";

const ActionsBar = () => {
  const {
    isCameraDisabled,
    isScreenDisabled,
    sendSocketMessage,
    setIsWebCam,
    device,
    onProducerTransportCreatedCallBack,
    onSubTransportCreatedCallback,
  } = useContext(AppContext);

  const [isSubscribeDisabled, setIsSubscribeDisabled] = useState(false);

  const onPublish = (isWebCam: boolean) => {
    setIsWebCam(isWebCam);

    setTimeout(() => {
      const payload = {
        type: "createProducerTransport",
        forceTcp: false,
        rtpCapabilities: device?.rtpCapabilities,
      };
      sendSocketMessage(
        "createProducerTransport",
        payload,
        onProducerTransportCreatedCallBack
      );
    }, 500);
  };

  const onSubscribe = () => {
    setIsSubscribeDisabled(true);
    sendSocketMessage(
      "createConsumerTransport",
      { forceTcp: false },
      onSubTransportCreatedCallback
    );
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
