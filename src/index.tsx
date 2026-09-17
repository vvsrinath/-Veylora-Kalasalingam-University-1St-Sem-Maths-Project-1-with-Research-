import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { registerServiceWorker, requestPersistentStorageOnUse } from "./utils/pwa";

const rootEl = document.getElementById("root");
if (rootEl) {
  registerServiceWorker();
  requestPersistentStorageOnUse();
  ReactDOM.createRoot(rootEl).render(<App />);
}