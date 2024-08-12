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
import UserOutlet from "./UserOutlet";
import UserDashboard from "./pages/user/UserDashboard";
import Header from "./components/user/UserHeader";
import UserLogin from "./pages/user/UserLogin";
import UserSignUp from "./pages/user/UserSignUp";
import UserTradeAccount from "./pages/user/UserTradeAcccount";
import UserReferal from "./pages/user/UserReferals";
import UserWithdraw from "./pages/user/UserWithdraw";
import UserPlatform from "./pages/user/UserPlatform";
import UserSupportTicket from "./pages/user/UserSupportTicket";
import UserRules from "./pages/user/UserRules";
import UserEconomicCalendar from "./pages/user/UserEconomicCalendar";
import Userchallenges from "./pages/admin/Userchallenges";
import UserProfile from "./pages/user/UserProfile";
import UserNewChallenge from "./pages/user/UserNewChallenge";
import UserNewChallenge2 from "./pages/user/UserNewChallenge2";
import NewUserReplicate from "./components/user/NewUserReplicate";

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
  {
    path: "/user",
    element: <UserOutlet></UserOutlet>,
    children: [
      {
        path: "/user/",
        element: <h1>User Home Page</h1>,
      },
      {
        path: "/user/dashboard",
        element: <UserDashboard></UserDashboard>,
      },
      {
        path: "/user/trade-account",
        element: <UserTradeAccount></UserTradeAccount>,
      },
      {
        path: "/user/referrals",
        element: <UserReferal></UserReferal>,
      },
      {
        path: "/user/withdraw",
        element: <UserWithdraw></UserWithdraw>,
      },
      {
        path: "/user/platform",
        element: <UserPlatform></UserPlatform>,
      },
      {
        path: "/user/support-ticket",
        element: <UserSupportTicket></UserSupportTicket>,
      },
      {
        path: "/user/rules",
        element: <UserRules></UserRules>,
      },
      {
        path: "/user/economic-calendar",
        element: <UserEconomicCalendar></UserEconomicCalendar>,
      },
      {
        path: "/user/new-challenge",
        element: <NewUserReplicate></NewUserReplicate>,
      },
      {
        path: "/user/new-challenge2",
        element: <UserNewChallenge2></UserNewChallenge2>,
      },
      {
        path: "/user/challenges",
        element: <UserNewChallenge2></UserNewChallenge2>,
      },
      {
        path: "/user/profile",
        element: <UserProfile></UserProfile>,
      },
    ],
  },
  {
    path: "/user/signup",
    element: <UserSignUp></UserSignUp>,
  },
  {
    path: "/user/login",
    element: <UserLogin></UserLogin>,
  },
]);

export default Router;
