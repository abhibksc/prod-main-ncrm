import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Dashboard from "./pages/admin/Dashboard";
import Login from "./pages/admin/Login";
import Deposit from "./pages/admin/commision-level/Deposit";
import Withdraw from "./pages/admin/commision-level/Withdraw";
import SetupChallenges from "./pages/admin/SetupChallenges";
import WithdrawlConditions from "./pages/admin/WithdrawlConditions";
import TradeAccounts from "./pages/admin/TradeAccounts";
import ManageUsers from "./pages/admin/ManageUsers";
import UserDetailDashboard from "./pages/admin/UserDetailsDashboard";
import KYCSetting from "./pages/admin/KycSetting";
import PasswordSetting from "./pages/admin/PasswordSetting";
import ProfileSetting from "./pages/admin/ProfileSetting";
import AutomaticGetways from "./pages/admin/AutomaticGetways";
import ManualGetways from "./pages/admin/ManualGetways";
import DepositsStatus from "./pages/admin/DepositsStatus";
import WithdrawalStatus from "./pages/admin/WithdrawalStatus";
import WithdrawalMethods from "./pages/admin/WithdrawalMethods";
import SupportTicketStatus from "./pages/admin/SupportTicketStatus";
import TransactionReport from "./pages/admin/TransactionReport";
import ReportStatus from "./pages/admin/ReportStatus";
import LoginReport from "./pages/admin/LoginReport";

const Router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
    children: [
      {
        path: "/",
        element: <Dashboard></Dashboard>,
      },
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
        path: "/admin/withdraw-conditions",
        element: <WithdrawlConditions></WithdrawlConditions>,
      },
      {
        path: "/admin/trade-accounts",
        element: <TradeAccounts></TradeAccounts>,
      },
      {
        path: "/admin/manage-users/:subList",
        element: <ManageUsers></ManageUsers>,
      },
      {
        path: "/admin/user-detail/:id",
        element: <UserDetailDashboard></UserDetailDashboard>,
      },
      {
        path: "/admin/deposit/:status",
        element: <DepositsStatus></DepositsStatus>,
      },
      {
        path: "/admin/withdrawal/methods",
        element: <WithdrawalMethods></WithdrawalMethods>,
      },
      {
        path: "/admin/withdrawal/:status",
        element: <WithdrawalStatus></WithdrawalStatus>,
      },
      {
        path: "/admin/ticket/:status",
        element: <SupportTicketStatus></SupportTicketStatus>,
      },
      {
        path: "/admin/report/transaction",
        element: <TransactionReport></TransactionReport>,
      },
      {
        path: "/admin/report/:status",
        element: <ReportStatus></ReportStatus>,
      },
      {
        path: "/admin/report/login",
        element: <LoginReport></LoginReport>,
      },
      {
        path: "/admin/getway/automatic",
        element: <AutomaticGetways></AutomaticGetways>,
      },
      {
        path: "/admin/getway/manual",
        element: <ManualGetways></ManualGetways>,
      },
      {
        path: "/admin/kyc-setting",
        element: <KYCSetting></KYCSetting>,
      },
      {
        path: "/admin/password-setting",
        element: <PasswordSetting></PasswordSetting>,
      },
      {
        path: "/admin/profile-setting",
        element: <ProfileSetting></ProfileSetting>,
      },
    ],
  },
  {
    path: "/admin/login",
    element: <Login></Login>,
  },
]);

export default Router;
