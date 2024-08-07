import { useState } from "react";
import {
  DollarSign,
  BarChart2,
  Users,
  Award,
  FileText,
  CreditCard,
  MessageSquare,
  Settings,
  Trophy,
  ArrowUpDown,
  ShieldAlertIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const MenuItem = ({ icon: Icon, label, link }) => (
  <NavLink
    to={link}
    className={({ isActive }) =>
      `flex items-center space-x-3 px-4 py-2 rounded-lg cursor-pointer ${
        isActive ? "bg-secondary-700" : "hover:bg-secondary-800"
      }`
    }
  >
    <Icon className="w-5 h-5" />
    <span>{label}</span>
  </NavLink>
);

const UserSidebar = () => {
  const [walletBalance, setWalletBalance] = useState(0);

  const menuItems = [
    { icon: BarChart2, label: "Dashboard", link: "/user/dashboard" },
    { icon: Trophy, label: "Challenges", link: "/user/challenges" },
    { icon: DollarSign, label: "Trade Accounts", link: "/user/trade-account" },
    { icon: Users, label: "Referrals", link: "/user/referrals" },
    { icon: CreditCard, label: "Withdraw", link: "/user/withdraw" },
    {
      icon: ArrowUpDown,
      label: "Transaction History",
      link: "/user/transaction",
    },
    {
      icon: MessageSquare,
      label: "Support Ticket",
      link: "/user/support-ticket",
    },
    {
      icon: ShieldAlertIcon,
      label: "Rules & dafinations",
      link: "/user/rules",
    },
    { icon: Settings, label: "Platform", link: "/user/platform" },
  ];

  return (
    <div className="w-64 bg-secondary-900 text-white h-screen p-4 flex flex-col relative">
      <div className="mb-8">
        <div className="w-full flex flex-col items-center">
          <p className="text-xs">WALLET BALANCE</p>
          <p className="text-2xl font-bold mb-4">
            {walletBalance.toFixed(2)} USD
          </p>
        </div>
        <button className="bg-secondary-500/80 text-white px-4 py-2 rounded-full w-full hover:bg-secondary-500 transition-colors duration-300">
          Start New Challenge
        </button>
      </div>
      <div className="flex-grow overflow-y-auto user-custom-scrollbar">
        {menuItems.map((item) => (
          <MenuItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            link={item.link}
          />
        ))}
      </div>
    </div>
  );
};

export default UserSidebar;
