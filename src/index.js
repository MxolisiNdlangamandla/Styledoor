import React from "react";
import ReactDOM from "react-dom/client";
import "./App.css"; // global styles (we keep everything in a single stylesheet for now)
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
