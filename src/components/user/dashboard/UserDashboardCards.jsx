import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Coins,
  TrendingUp,
  TrendingDown,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { backendApi, metaApi } from "@/utils/apiClients";
import { setTotalFinalPnL } from "@/redux/user/userSlice";
import useUserCopyRequest from "@/hooks/user/UseUserCopyRequest";
import UseUserHook from "@/hooks/user/UseUserHook";
import { useGetInfoByAccounts } from "@/hooks/user/UseGetInfoByAccounts";

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay },
  }),
};

const BalanceCard = ({
  icon: Icon,
  title,
  value,
  borderColor,
  delay,
  isProfit,
}) => {
  return (
    <motion.div
      className="flex items-center space-y-2 p-3 border-l-4 bg-secondary-800 rounded-r-lg flex-1 min-w-[200px]"
      style={{
        borderColor,
        backgroundImage:
          'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)),url("https://img.freepik.com/premium-vector/triangle-future-abstract-white-texture-background_34679-80.jpg")',
        backgroundBlendMode: "overlay",
        backgroundSize: "cover",
      }}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={delay}
    >
      <div className="flex items-center space-x-3">
        <Icon
          className={`w-6 h-6  ${
            isProfit !== undefined
              ? isProfit
                ? "text-green-500"
                : "text-red-500"
              : ""
          }`}
        />
        <div>
          <p className="text-xs text-gray-100 font-semibold">{title}</p>
          <p
            className={`font-bold ${
              isProfit !== undefined
                ? isProfit
                  ? "text-green-500"
                  : "text-red-500"
                : ""
            }`}
          >
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const UserDashboardBalanceCards = () => {
  const totalFinalPnL = useSelector((store) => store.user.totalFinalPnL);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const accountIds =
    loggedUser?.accounts?.map((acc) => +acc.accountNumber) || [];
  useGetInfoByAccounts(accountIds, "accounts");
  const { accountsStats } = useSelector((store) => store.user);
  // console.log("accountStats", accountsStats);

  const dispatch = useDispatch();
  // const { connectWebSocket } = UseUserHook();
  // connectWebSocket();
  const isPositive = parseFloat(totalFinalPnL) >= 0;

  const fetchAccountsInfo = async () => {
    // console.log("calling info api..");
    try {
      let Balance = 0;
      for (const account of loggedUser?.accounts) {
        const res = await metaApi.get(
          `/GetUserInfo?Manager_Index=${
            import.meta.env.VITE_MANAGER_INDEX
          }&MT5Account=${account.accountNumber}`
        );
        Balance += Number(res.data.Equity);
      }
      dispatch(setTotalFinalPnL(Balance.toFixed(2)));
    } catch (error) {
      console.error("Error fetching accounts info:", error);
    }
  };

  const fetchTotalDeposits = async () => {
    try {
      const res = await backendApi.get(`/deposit/${loggedUser._id}`);
      const balance = res.data.data.reduce(
        (total, current) => total + Number(current.deposit),
        0
      );
      const notPendindg = balance.filter((ele)=>ele.status !== "pending");
      
      setTotalDeposits(notPendindg);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTotalWithdrawals = async () => {
    try {
      const res = await backendApi.get(`/withdrawals/${loggedUser._id}`);
      const balance = res.data.data.reduce(
        (total, current) => total + current.amount,
        0
      );
      setTotalWithdrawals(balance);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchTotalDeposits();
    fetchTotalWithdrawals();
    const fetchBalance = setInterval(() => {
      fetchAccountsInfo();
    }, 4000);
    return () => clearInterval(fetchBalance);
  }, []);

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4  justify-between items-stretch bg-secondary-800/40 shadow-md rounded-lg p-4 gap-4"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
    >
      <BalanceCard
        icon={Coins}
        title="Total MT5 Account"
        value={`${loggedUser?.accounts?.length}`}
        borderColor="var(--theme-color)"
        delay={0.2}
      />
      <BalanceCard
        icon={isPositive ? TrendingUp : TrendingDown}
        title="Available Balance"
        value={`${accountsStats?.totalEquity} USD`}
        borderColor="var(--theme-color)"
        delay={0.4}
        isProfit={isPositive}
      />
      <BalanceCard
        icon={ArrowUpCircle}
        title="Total Deposits"
        value={`${totalDeposits} USD`}
        borderColor="var(--theme-color)"
        delay={0.6}
      />
      <BalanceCard
        icon={ArrowDownCircle}
        title="Total Withdrawals"
        value={`${totalWithdrawals} USD`}
        borderColor="var(--theme-color)"
        delay={0.8}
      />
    </motion.div>
  );
};

export default UserDashboardBalanceCards;
