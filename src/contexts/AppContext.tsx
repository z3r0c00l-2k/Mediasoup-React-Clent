import { createContext, FC, useEffect, useState } from "react";
import Faker from "faker";

type UserDetails = {
  name: string;
  avatar: string;
  userName: string;
};

type ProviderProps = {
  userData: UserDetails | null;
  meetingName: string;
  setMeetingName: React.Dispatch<React.SetStateAction<string>>;
  isWebCam: boolean;
  setIsWebCam: React.Dispatch<React.SetStateAction<boolean>>;
  isMuted: boolean;
  setIsMuted: React.Dispatch<React.SetStateAction<boolean>>;
  isStarted: boolean;
  setIsStarted: React.Dispatch<React.SetStateAction<boolean>>;
};

const AppContext = createContext({} as ProviderProps);

const AppContextProvider: FC = ({ children }) => {
  const [userData, setUserData] = useState<UserDetails | null>(null);
  const [meetingName, setMeetingName] = useState("");
  const [isWebCam, setIsWebCam] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isStarted, setIsStarted] = useState(false);

  useEffect(() => {
    const localStorageUserData = localStorage.getItem("userData");

    if (localStorageUserData) {
      setUserData(JSON.parse(localStorageUserData));
    } else {
      const newData: UserDetails = {
        name: Faker.name.findName(),
        avatar: Faker.image.avatar(),
        userName: Faker.internet.userName(),
      };
      localStorage.setItem("userData", JSON.stringify(newData));
      setUserData(newData);
    }
  }, []);

  return (
    <AppContext.Provider
      value={{
        userData,
        meetingName,
        setMeetingName,
        isWebCam,
        setIsWebCam,
        isMuted,
        setIsMuted,
        isStarted,
        setIsStarted,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppContextProvider, AppContext };
