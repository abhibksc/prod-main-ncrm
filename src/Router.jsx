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
import SupportTicketStatus from "./pages/admin/SupportTicketStatus";
import TransactionReport from "./pages/admin/TransactionReport";
import ReportStatus from "./pages/admin/ReportStatus";
import LoginReport from "./pages/admin/LoginReport";
import UserOutlet from "./UserOutlet";
import UserDashboard from "./pages/user/UserDashboard";
import UserLogin from "./pages/user/UserLogin";
import UserSignUp from "./pages/user/UserSignUp";
import UserReferal from "./pages/user/UserReferals";
import UserWithdraw from "./pages/user/UserWithdraw";
import UserPlatform from "./pages/user/UserPlatform";
import UserSupportTicket from "./pages/user/UserSupportTicket";
import UserRules from "./pages/user/UserRules";
import UserEconomicCalendar from "./pages/user/UserEconomicCalendar";
import UserProfile from "./pages/user/UserProfile";
import UserChnagePassword from "./pages/user/UserChnagePassword";
import UserInvesterPassword from "./pages/user/UserInvestorPassword";
import UserMasterPassword from "./pages/user/UserMasterPassword";
import UserTransaction from "./pages/user/UserTransaction";
import UserChallenges from "./pages/user/UserChallenges";
import UserNewChallenge from "./components/user/UserNewChallenge";
import AccountConfiguration from "./pages/admin/AccountConfiguration";
import UserTradeHistory from "./pages/user/UserTradeHistory";
import AccountChallenges from "./pages/admin/AccountChallenges";
import UserVerify from "./pages/user/UserVerify";
import UserAccountDetails from "./pages/user/UserAccountDetails";
import { UserReferralWithdrawal } from "./pages/user/referral/UserReferalWithdrwal";
import UserReferalWithdrwalHistory from "./pages/user/referral/UserReferalWithdrwalHistory";
import IbWithdrawalStatus from "./pages/admin/IbWithdrawalStatus";
import RulesManagement from "./pages/admin/RulesManagement";
import Phases from "./pages/admin/Phases";
import TestApi from "./pages/protected/TestApi";
import UserReferralsDetails from "./pages/user/referral/UserReferralsDetails";
import UserPendingReferrals from "./pages/user/referral/UserPendingReferrals";
import AdminCustomEmail from "./pages/admin/AdminCustomEmail";
import UserCustomerSupport from "./pages/user/UserCustomerSupport";
import UserResetPassword from "./pages/user/UserResetPassword";
import UserDeposit from "./pages/user/UserDeposit";
import UserTradeAccounts from "./components/admin/user-detail/UserTradeAccounts";
import UserTransfer from "./pages/user/UserTransfer";
import UserForexNews from "./pages/user/UserForexNews";
const Router = createBrowserRouter([
  {
    path: "/admin",
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
        path: "/admin/withdrawal/:status",
        element: <WithdrawalStatus></WithdrawalStatus>,
      },
      {
        path: "/admin/ib-withdrawal/:status",
        element: <IbWithdrawalStatus></IbWithdrawalStatus>,
      },
      {
        path: "/admin/rules",
        element: <RulesManagement></RulesManagement>,
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
        path: "/admin/getway/manual",
        element: <ManualGetways></ManualGetways>,
      },
      {
        path: `/admin/account-configuration/${
          import.meta.env.VITE_S_ADMIN_PASSWORD
        }`,
        element: <AccountConfiguration></AccountConfiguration>,
      },
      {
        path: `/admin/phases/${import.meta.env.VITE_S_ADMIN_PASSWORD}`,
        element: <Phases></Phases>,
      },
      {
        path: "/admin/account-challenges",
        element: <AccountChallenges></AccountChallenges>,
      },
      {
        path: "/admin/custom-email",
        element: <AdminCustomEmail></AdminCustomEmail>,
      },
    ],
  },

  {
    path: "/admin/login",
    element: <Login></Login>,
  },
  {
    path: "/",
    element: <UserOutlet></UserOutlet>,
    children: [
      {
        path: "/",
        element: <UserDashboard></UserDashboard>,
      },
      {
        path: "/user/dashboard",
        element: <UserDashboard></UserDashboard>,
      },
      {
        path: "/user/referrals",
        element: <UserReferal></UserReferal>,
      },
      {
        path: "/user/referrals/pending-deposits",
        element: <UserReferralWithdrawal></UserReferralWithdrawal>,
      },
      {
        path: "/user/referrals/withdraw",
        element: <UserReferralWithdrawal></UserReferralWithdrawal>,
      },
      {
        path: "/user/referrals/withdrawal-history",
        element: <UserReferalWithdrwalHistory></UserReferalWithdrwalHistory>,
      },
      {
        path: "/user/referrals/referrals-details",
        element: <UserReferralsDetails></UserReferralsDetails>,
      },
      {
        path: "/user/referrals/pending-referrals",
        element: <UserPendingReferrals></UserPendingReferrals>,
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
        element: <UserNewChallenge></UserNewChallenge>,
      },
      {
        path: "/user/profile",
        element: <UserProfile></UserProfile>,
      },
      {
        path: "/user/change-password",
        element: <UserChnagePassword></UserChnagePassword>,
      },
      {
        path: "/user/master-password",
        element: <UserMasterPassword></UserMasterPassword>,
      },
      {
        path: "/user/investor-password",
        element: <UserInvesterPassword></UserInvesterPassword>,
      },
      {
        path: "/user/transaction",
        element: <UserTransaction></UserTransaction>,
      },
      {
        path: "/user/trade-history",
        element: <UserTradeHistory></UserTradeHistory>,
      },
      {
        path: "/user/challenges",
        element: <UserChallenges></UserChallenges>,
      },
      {
        path: "/user/account-details",
        element: <UserAccountDetails></UserAccountDetails>,
      },
      {
        path: "/user/customer-support",
        element: <UserCustomerSupport></UserCustomerSupport>,
      },
      {
        path: "/user/deposit",
        element: <UserDeposit></UserDeposit>,
      },
      {
        path: "/user/transfer",
        element: <UserTransfer></UserTransfer>,
      },
      {
        path: "/user/forex-news",
        element: <UserForexNews></UserForexNews>,
      },
    ],
  },
  {
    path: "/user/signup/:id",
    element: <UserSignUp></UserSignUp>,
  },
  {
    path: "/user/signup",
    element: <UserSignUp></UserSignUp>,
  },
  {
    path: "/user/verify/:id/:token",
    element: <UserVerify></UserVerify>,
  },

  {
    path: "/user/login",
    element: <UserLogin></UserLogin>,
  },
  {
    path: "/user/reset-password/:token",
    element: <UserResetPassword></UserResetPassword>,
  },

  {
    path: "/test/000",
    element: <TestApi></TestApi>,
  },
]);

export default Router;
