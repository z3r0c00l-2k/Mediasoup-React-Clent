import React from "react";
import ReactDOM from "react-dom";
import "./assets/styles/global.scss";
import "tailwindcss/tailwind.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { MediaSoupContextProvider } from "./contexts/MediaSoupContext";
import { AppContextProvider } from "./contexts/AppContext";

ReactDOM.render(
  <React.StrictMode>
    <AppContextProvider>
      <MediaSoupContextProvider>
        <App />
      </MediaSoupContextProvider>
    </AppContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
