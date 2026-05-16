import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import JudhoorApp from "./JudhoorApp";
import "./judhoor.css";
import "./polish.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter>
      <JudhoorApp />
    </HashRouter>
  </React.StrictMode>,
);
