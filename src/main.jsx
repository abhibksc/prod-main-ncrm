import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import Router from "./Router.jsx";
import UserRouter from "./UserRouter.jsx";
import UserOutlet from "./UserOutlet.jsx";
const path = window.location.pathname;
const isAdmin = path.startsWith("/admin") ? true : false;
const isUser = path.startsWith("/user") ? true : false;
console.log("isAdmin", isAdmin);
console.log("isUser", isUser);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={Router}>
    <App />
  </RouterProvider>
);
