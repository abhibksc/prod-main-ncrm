import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import Router from "./Router.jsx";
import { Provider } from "react-redux";
import ReduxStore, { persistor } from "./redux/ReduxStore.js";
import { Toaster } from "react-hot-toast";

// Conditional Logic for Admin/User (place this at the top or inside App if needed)
const path = window.location.pathname;
const isAdmin = path.startsWith("/admin");
const isUser = path.startsWith("/user");

console.log("isAdmin", isAdmin);
console.log("isUser", isUser);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={ReduxStore}>
    <RouterProvider router={Router}>
      <App />
    </RouterProvider>
  </Provider>
);
