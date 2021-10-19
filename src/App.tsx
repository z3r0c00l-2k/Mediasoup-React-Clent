import ChatView from "./components/ChatView";
import Header from "./components/Header";
import ParticipantsList from "./components/ParticipantsList";
import Sidebar from "./components/Sidebar";
import VideoCall from "./components/VideoCall";

const App = () => {
  return (
    <div className="main-app-wrapper">
      <Sidebar />
      <div className="flex flex-col flex-grow">
        <Header />
        <div className="flex flex-grow">
          <VideoCall />
          <div className="flex-grow	flex flex-col">
            <ParticipantsList />
            <ChatView />
          </div>
        </div>
      </div>

      {/* <VideoView />
      <ActionsBar />
      <StatusBar /> */}
    </div>
  );
};

export default App;
