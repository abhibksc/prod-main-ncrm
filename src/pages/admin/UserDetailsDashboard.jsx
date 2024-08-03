import React from "react";
import {
  Wallet,
  CreditCard,
  ArrowLeftRight,
  Users,
  Ban,
  Key,
  LogIn,
  Bell,
  TreePine,
} from "lucide-react";
import UserInfoForm from "@/components/admin/user-detail/UserForm";
import { useParams } from "react-router-dom";
import TradeAccounts from "./TradeAccounts";
import UserTradeAccounts from "@/components/admin/user-detail/UserTradeAccounts";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const StatCard = ({ icon, amount, label, bgColor }) => (
  <motion.div
    variants={cardVariants}
    className={`p-4 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl ${bgColor} text-white`}
    style={{
      backgroundImage:
        "url('https://png.pngtree.com/background/20230109/original/pngtree-white-abstract-carbon-fiber-texture-background-picture-image_1996167.jpg')", // More visible pattern
      overlay: "auto",
      backgroundBlendMode: "overlay",
      backgroundSize: "cover",
    }}
  >
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        {icon}
        <div className="ml-3">
          <p className="text-2xl font-bold">{amount}</p>
          <p className="text-sm opacity-80">{label}</p>
        </div>
      </div>
      <button className="text-xs underline opacity-80 hover:opacity-100 transition-opacity duration-200">
        View All
      </button>
    </div>
  </motion.div>
);

const ActionButton = ({ icon, label, bgColor }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className={`flex items-center justify-center py-2 px-4 rounded-lg text-white ${bgColor} transition-all duration-300 hover:shadow-md hover:bg-opacity-75`}
  >
    {icon}
    <span className="ml-2">{label}</span>
  </motion.button>
);

const UserDetailDashboard = ({ username }) => {
  const { id } = useParams();
  const stats = [
    {
      icon: <Wallet size={24} />,
      amount: "$100.00",
      label: "Balance",
      bgColor: "bg-green-800",
    },
    {
      icon: <CreditCard size={24} />,
      amount: "$1,000.00",
      label: "Deposits",
      bgColor: "bg-indigo-800",
    },
    {
      icon: <ArrowLeftRight size={24} />,
      amount: "$0.00",
      label: "Withdrawals",
      bgColor: "bg-teal-800",
    },
    {
      icon: <ArrowLeftRight size={24} />,
      amount: "4",
      label: "Transactions",
      bgColor: "bg-blue-800",
    },
    {
      icon: <Wallet size={24} />,
      amount: "$0.00",
      label: "Total Invest",
      bgColor: "bg-sky-900",
    },
    {
      icon: <Users size={24} />,
      amount: "$0.00",
      label: "Total Referral Commission",
      bgColor: "bg-pink-600/80",
    },
    {
      icon: <CreditCard size={24} />,
      amount: "$0.00",
      label: "Total Binary Commission",
      bgColor: "bg-yellow-900/80",
    },
    {
      icon: <ArrowLeftRight size={24} />,
      amount: "0",
      label: "Total BV",
      bgColor: "bg-indigo-600",
    },
  ];

  const actions = [
    { icon: <Wallet size={18} />, label: "Balance +", bgColor: "bg-green-500" },
    { icon: <Wallet size={18} />, label: "Balance -", bgColor: "bg-red-500" },
    { icon: <LogIn size={18} />, label: "Logins", bgColor: "bg-blue-600" },

    {
      icon: <LogIn size={18} />,
      label: "Login as User",
      bgColor: "bg-green-600",
    },
    {
      icon: <TreePine size={18} />,
      label: "User Tree",
      bgColor: "bg-green-600",
    },
    {
      label: "Notifications",
      bgColor: "bg-gray-500",
    },

    { icon: <Ban size={18} />, label: "Ban User", bgColor: "bg-red-500" },
    {
      icon: <Key size={18} />,
      label: "Change Password",
      bgColor: "bg-teal-700",
    },
  ];

  return (
    <div className="container mx-auto px-10 py-5 rounded-lg bg-primary-700 shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-white">User Detail - {id}</h1>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </motion.div>
      <div className="grid mx-auto whitespace-nowrap grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
        {actions.map((action, index) => (
          <ActionButton className="px-3" key={index} {...action} />
        ))}
      </div>
      <UserInfoForm></UserInfoForm>
      <UserTradeAccounts></UserTradeAccounts>
    </div>
  );
};

export default UserDetailDashboard;
