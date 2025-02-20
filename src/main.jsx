import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import Router from "./Router.jsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "./redux/ReduxStore.js";
import UserPanelConfig from "./utils/UserPanelConfig.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <UserPanelConfig />
    <RouterProvider router={Router}>
      <PersistGate loading={null} persistor={persistor}>
        <App />
      </PersistGate>
    </RouterProvider>
  </Provider>
);
