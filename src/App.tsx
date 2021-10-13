import "./App.css";
import ActionsBar from "./components/ActionsBar";
import StatusBar from "./components/StatusBar";
import VideoView from "./components/VideoView";

const App = () => {
  return (
    <div className="container">
      <VideoView />
      <ActionsBar />
      <StatusBar />
    </div>
  );
};

export default App;
