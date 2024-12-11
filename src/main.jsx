import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import Router from "./Router.jsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./redux/ReduxStore.js";

document.title = import.meta.env.VITE_WEBSITE_NAME || "Forex Funding";

// main.js or main.ts
const themeColor = import.meta.env.VITE_THEME_COLOR;
document.documentElement.style.setProperty("--theme-color", themeColor);

// Function to dynamically set the favicon

const setFavicon = (url) => {
  const link =
    document.querySelector("link[rel*='icon']") ||
    document.createElement("link");
  link.type = "image/x-icon";
  link.rel = "shortcut icon";
  link.href = url;
  document.getElementsByTagName("head")[0].appendChild(link);
};
// Set the favicon when the app starts
setFavicon(import.meta.env.VITE_FAVICON_LINK || "/login-illu.jpg");

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={Router}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </RouterProvider>
  </Provider>
);
