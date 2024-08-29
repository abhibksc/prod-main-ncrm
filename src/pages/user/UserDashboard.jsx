import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import {
  Activity,
  Scale,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import UserDashboardAccount from "@/components/user/dashboard/UserDashboardAccount";
import UserDashboardAccountStats from "@/components/user/dashboard/UserDashboardAccountStats";
import UserDashboardBanner from "@/components/user/dashboard/UserDashboardBanner";
import UserDashboardCountdown from "@/components/user/dashboard/UserDashboardCountdown";
import UserLineChart from "@/components/user/UserLineChart";
import UseUserHook from "@/hooks/user/UseUserHook";

const BalanceCard = ({
  icon: Icon,
  title,
  value,
  borderColor,
  delay,
  isProfit,
}) => (
  <motion.div
    className={`flex items-center space-x-3 p-3 border-l-4 bg-secondary-800 rounded-r-lg flex-1 min-w-[200px]`}
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
    <Icon
      className={`w-6 h-6 ${
        isProfit !== undefined
          ? isProfit
            ? "text-green-500"
            : "text-red-500"
          : ""
      }`}
    />
    <div>
      <p className="text-xs">{title}</p>
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
  </motion.div>
);

export default function UserDashboard() {
  const availableBalance = useSelector((store) => store.user.availableBalance);
  const depositBalance = useSelector((store) => store.user.depositBalace);
  const profitNloss = useSelector((store) => store.user.profitNloss);
  const currentAccount = useSelector((store) => store.user.currentAccount);
  const { GetCloseTradeAPI, GetUserInfoAPI } = UseUserHook();

  useEffect(() => {
    GetCloseTradeAPI();
    GetUserInfoAPI();
  }, []);

  const isPositive = profitNloss > 0;

  return (
    <motion.div
      className="pb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        className="grid grid-cols-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex flex-wrap justify-between items-stretch bg-secondary-800 shadow-md rounded-lg p-4 gap-4">
          <BalanceCard
            icon={Scale}
            title="Deposit Balance"
            value={`${depositBalance} $USD`}
            borderColor="#f97316"
            delay={0.2}
          />
          <BalanceCard
            icon={Activity}
            title="Available Balance"
            value={`${availableBalance} $USD`}
            borderColor="#3b82f6"
            delay={0.3}
          />
          <BalanceCard
            icon={isPositive ? TrendingUp : TrendingDown}
            title="Profit/Loss"
            value={`${profitNloss} USD`}
            borderColor="#facc15"
            delay={0.4}
            isProfit={isPositive}
          />
          <BalanceCard
            icon={Target}
            title="Target"
            value="6,000.00 USD"
            borderColor="#a855f7"
            delay={0.5}
          />
        </div>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-2 grid-cols-1 justify-between my-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.0, delay: 0.0 }}
      >
        <div className="">
          <UserLineChart />
        </div>
        <div className="md:ml-20">
          <UserDashboardAccount currentAccount={currentAccount} />
        </div>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-2 grid-cols-1 justify-between my-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div>
          <UserDashboardAccountStats />
        </div>
        <div className="flex flex-col gap-10 mt-10">
          <div>
            <UserDashboardBanner />
          </div>
          <div>
            <UserDashboardCountdown />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
