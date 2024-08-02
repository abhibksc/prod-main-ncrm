import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Contact from "./pages/Contact";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Deposit from "./pages/commision-level/Deposit";
import Withdraw from "./pages/commision-level/Withdraw";
import SetupChallenges from "./pages/admin/SetupChallenges";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        path: "/admin/dashboard",
        element: <Dashboard></Dashboard>,
      },
      {
        path: "/admin/deposit",
        element: <Deposit></Deposit>,
      },
      {
        path: "/admin/withdraw",
        element: <Withdraw></Withdraw>,
      },
      {
        path: "/admin/setup-challenges",
        element: <SetupChallenges></SetupChallenges>,
      },
      {
        path: "/contact",
        element: <About></About>,
      },
    ],
  },
  {
    path: "/login",
    element: <Login></Login>,
  },
  {
    path: "/signup",
    element: <SignUp></SignUp>,
  },
]);

export default Router;
