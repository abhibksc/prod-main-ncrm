import { useEffect, useState } from "react";
import {
  DollarSign,
  BarChart2,
  Users,
  CreditCard,
  MessageSquare,
  Settings,
  Trophy,
  ArrowUpDown,
  ShieldAlertIcon,
  ReceiptPoundSterlingIcon,
} from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";

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
  const isSidebarOpen = useSelector((store) => store.user.isSidebarOpen);
  const userInfo = useSelector((store) => store.user.userInfo);

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
    {
      icon: ReceiptPoundSterlingIcon,
      label: "Economic Calendar",
      link: "/user/economic-calendar",
    },
  ];

  return (
    <div
      className={` ${
        isSidebarOpen ? "block" : "hidden"
      } w-64  md:flex bg-secondary-900 text-white h-screen p-4 flex-col relative`}
    >
      <div className="mb-8">
        <div className="w-full flex flex-col items-center">
          <p className="text-xs">WALLET BALANCE</p>
          <p className="text-2xl font-bold mb-4">
            {userInfo.Balance ? userInfo.Balance : "00000"} USD
          </p>
        </div>
        <Link to={"/user/new-challenge"}>
          <button className="bg-secondary-600/80 text-white px-4 py-2 rounded-full w-full hover:bg-secondary-500 transition-colors duration-300">
            Start New Challenge
          </button>
        </Link>
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
