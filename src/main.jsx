import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import Router from "./Router.jsx";

const path = window.location.pathname;
const isAdmin = path.startsWith("/admin") ? true : false;
const isUser = path.startsWith("/user") ? true : false;
console.log("isAdmin", isAdmin);
console.log("isUser", isUser);
import { Provider } from "react-redux";
import ReduxStore, { persistor } from "./redux/ReduxStore.js";
import { Toaster } from "react-hot-toast";
import { PersistGate } from "redux-persist/integration/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={ReduxStore}>
    <RouterProvider router={Router}>
      <PersistGate persistor={persistor}>
        <Toaster></Toaster>
        <App />
      </PersistGate>
    </RouterProvider>
  </Provider>
);
