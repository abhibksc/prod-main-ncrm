import { useEffect, useState } from "react";
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
import { useGetInfoByAccounts } from "@/hooks/user/UseGetInfoByAccounts";

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (delay) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut", delay },
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
      className="flex flex-col items-center justify-center w-32 h-32 bg-secondary-800/20 rounded-full shadow-sm hover:bg-secondary-800/20 transition-all duration-300 border border-secondary-700/30"
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={delay}
    >
      <div className="p-2 bg-secondary-900/20 rounded-full mb-2">
        <Icon
          className={`w-6 h-6 ${
            isProfit !== undefined
              ? isProfit
                ? "text-green-500"
                : "text-red-500"
              : "text-gray-100"
          }`}
        />
      </div>
      <p className="text-xs text-gray-200 font-medium text-center">{title}</p>
      <p
        className={`text-sm font-semibold ${
          isProfit !== undefined
            ? isProfit
              ? "text-green-500"
              : "text-red-500"
            : "text-gray-100"
        }`}
      >
        {value}
      </p>
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
  const dispatch = useDispatch();
  const isPositive = parseFloat(totalFinalPnL) >= 0;

  const fetchAccountsInfo = async () => {
    try {
      let Balance = 0;
      for (const account of loggedUser?.accounts) {
        const res = await backendApi.get(
          `id-info?accountNumber=${account.accountNumber}`
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
      setTotalDeposits(balance);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTotalWithdrawals = async () => {
    try {
      const res = await backendApi.get(`/withdrawals/${loggedUser._id}`);
      const balance = res.data.data.reduce(
        (total, current) => total + Number(current.amount),
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
      className="bg-secondary-800/20 p-2 rounded-3xl shadow-lg w-full flex flex-col items-center gap-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className=" grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4   w-full px-4 md:px-36 items-center justify-between gap-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        <BalanceCard
          icon={Coins}
          title="Total MT5 Accounts"
          value={`${loggedUser?.accounts?.length || 0}`}
          borderColor="var(--theme-color)"
          delay={0.2}
        />
        <BalanceCard
          icon={isPositive ? TrendingUp : TrendingDown}
          title="Available Balance"
          value={`${accountsStats?.totalEquity || 0} USD`}
          borderColor="var(--theme-color)"
          delay={0.35}
          isProfit={isPositive}
        />
        <BalanceCard
          icon={ArrowUpCircle}
          title="Total Deposits"
          value={`${totalDeposits} USD`}
          borderColor="var(--theme-color)"
          delay={0.5}
        />
        <BalanceCard
          icon={ArrowDownCircle}
          title="Total Withdrawals"
          value={`${totalWithdrawals} USD`}
          borderColor="var(--theme-color)"
          delay={0.65}
        />
      </motion.div>
    </motion.div>
  );
};

export default UserDashboardBalanceCards;
