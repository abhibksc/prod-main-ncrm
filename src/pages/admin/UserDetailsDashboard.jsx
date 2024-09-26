import { Wallet, CreditCard, ArrowLeftRight, Users } from "lucide-react";
import UserInfoForm from "@/components/admin/user-detail/UserForm";
import { useParams } from "react-router-dom";
import UserTradeAccounts from "@/components/admin/user-detail/UserTradeAccounts";
import { motion } from "framer-motion";
import axios from "axios";
import { useEffect, useState } from "react";

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
    className={`p-4 px-10 hover:px-5 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl ${bgColor} text-white`}
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

const UserDetailDashboard = ({ username }) => {
  const { id } = useParams();
  console.log("id---", id);
  const [userData, setUserData] = useState();

  const fetchUserData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/get-user?id=${id}`
      );
      setUserData(res.data.data);
      console.log("user res--", res.data);
    } catch (error) {
      console.log("error in fetch user data", error);
    }
  };

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
      bgColor: "bg-purple-900",
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
      bgColor: "bg-yellow-900/80",
    },
  ];

  // useEffect ----------------------

  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="container mx-auto px-10 py-5 rounded-lg bg-primary-700 shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-white">User Detail - {id}</h1>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
      >
        {stats.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </motion.div>
      <UserInfoForm userData={userData}></UserInfoForm>
      <UserTradeAccounts></UserTradeAccounts>
    </div>
  );
};

export default UserDetailDashboard;
