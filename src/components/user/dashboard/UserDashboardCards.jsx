import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Scale,
  Activity,
  TrendingUp,
  TrendingDown,
  CircleDot,
  ArrowUpCircle,
  ArrowDownCircle,
  Coins,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { backendApi, metaApi } from "@/utils/apiClients";
import { setTotalFinalPnL } from "@/redux/user/userSlice";

const BalanceCard = ({
  icon: Icon,
  title,
  value,
  borderColor,
  delay,
  isProfit,
}) => {
  const getPhaseColor = (phase, isMax) => {
    if (isMax) return "text-red-500";
    switch (phase) {
      case 1:
        return "text-green-500";
      case 2:
        return "text-yellow-500";
      default:
        return "";
    }
  };

  return (
    <motion.div
      className={`flex items-center space-y-2 p-3 border-l-4 bg-secondary-800 rounded-r-lg flex-1 min-w-[200px]`}
      style={{
        borderColor,
        backgroundImage:
          'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)),url("https://static.vecteezy.com/system/resources/thumbnails/021/915/647/small/gray-color-luxury-square-seamless-pattern-vector.jpg")',
        backgroundBlendMode: "overlay",
        backgroundSize: "cover",
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
    >
      <div className={`flex items-center space-x-3`}>
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
  const availableBalance = useSelector((store) => store.user.availableBalance);
  const profitNloss = useSelector((store) => store.user.profitNloss);
  const phaseMaxLength = useSelector((store) => store.user.phaseMaxLength);
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const totalFinalPnL = useSelector((store) => store.user.totalFinalPnL);
  const [totalBalance, setTotalBalance] = useState(0);
  const [totalDeposits, setTotalDeposits] = useState(0);
  const [totalWithdrawals, setTotalWithdrawals] = useState(0);
  const dispatch = useDispatch();

  const isPositive = parseFloat(totalFinalPnL) >= 0;

  const fetchAccountsInfo = async () => {
    try {
      let Balance = 0;
      for (const account of loggedUser.accounts) {
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
  // deposit data--

  const fetchTotalDeposits = async () => {
    try {
      const res = await backendApi.get(`/deposit/${loggedUser._id}`);
      // console.log("totalWithdrawals", res.data.data);
      const balance = res.data.data.reduce(
        (total, current) => total + Number(current.deposit),
        0
      );
      setTotalDeposits(balance);
    } catch (error) {
      console.log(error);
    }
  };
  // withdrawals data--

  const fetchTotalWithdrawals = async () => {
    try {
      const res = await backendApi.get(`/withdrawals/${loggedUser._id}`);
      const balance = res.data.data.reduce(
        (total, current) => total + current.amount,
        0
      );
      setTotalWithdrawals(balance);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAccountsInfo();
    fetchTotalDeposits();
    fetchTotalWithdrawals();
  }, []);

  return (
    <div className="flex flex-wrap justify-between items-stretch bg-secondary-800/40 shadow-md rounded-lg p-4 gap-4">
      <BalanceCard
        icon={Coins}
        title="Total MT5 Account"
        value={`${loggedUser.accounts.length}`}
        borderColor={import.meta.env.VITE_THEME_COLOR}
        delay={0.2}
      />
      <BalanceCard
        icon={isPositive ? TrendingUp : TrendingDown}
        title="Available Balance"
        value={`${totalFinalPnL} USD`}
        borderColor={import.meta.env.VITE_THEME_COLOR}
        delay={0.4}
        isProfit={isPositive}
      />
      <BalanceCard
        icon={ArrowUpCircle}
        title="Total Deposits"
        value={`${totalDeposits} USD`}
        borderColor={import.meta.env.VITE_THEME_COLOR}
        delay={0.3}
      />
      <BalanceCard
        icon={ArrowDownCircle}
        title="Total Withdrawals"
        value={`${totalWithdrawals} USD`}
        borderColor={import.meta.env.VITE_THEME_COLOR}
        delay={0.3}
      />
    </div>
  );
};

export default UserDashboardBalanceCards;
