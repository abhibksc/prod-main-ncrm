import React from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  BarChart2,
  Trophy,
  DollarSign,
  Users,
  CreditCard,
  ArrowUpDown,
  MessageSquare,
  ShieldAlertIcon,
  Settings,
  ReceiptPoundSterlingIcon,
} from "lucide-react";

const MenuItem = ({ icon: Icon, label, link }) => (
  <NavLink
    to={link}
    className={({ isActive }) =>
      `flex flex-col items-center justify-center p-4  rounded-lg ${
        isActive
          ? "text-secondary-500"
          : "hover:text-white/60  hover:ml-3  transition-all"
      }`
    }
  >
    <Icon size={28} />
    <span className="mt-1 font-semibold text-xs">{label}</span>
  </NavLink>
);

const UserSidebar2 = () => {
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
      label: "Rules & definitions",
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
      className={`${
        isSidebarOpen ? "block" : "hidden"
      } md:flex bg-secondary-900 text-white pl-3 h-screen w-42 px-0 pr-0 flex-col items-center py-4`}
    >
      <div className="flex-grow overflow-y-auto pb-16 pr-3 user-custom-scrollbar">
        <Link to={"/user/new-challenge"}>
          <button className=" mt-2 mb-4 rounded-full px-8 py-2 bg-secondary-700/90">
            New challenge
          </button>
        </Link>
        {menuItems.map((item) => (
          <div key={item.label} className="">
            <MenuItem icon={item.icon} label={item.label} link={item.link} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserSidebar2;
