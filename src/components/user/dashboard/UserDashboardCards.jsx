import React from "react";
import { motion } from "framer-motion";
import {
  Scale,
  Activity,
  TrendingUp,
  TrendingDown,
  CircleDot,
} from "lucide-react";
import { useSelector } from "react-redux";

const BalanceCard = ({
  icon: Icon,
  title,
  value,
  borderColor,
  delay,
  isProfit,
  isPhase,
}) => {
  const getPhaseColor = (phase) => {
    switch (phase) {
      case 1:
        return "text-green-500";
      case 2:
        return "text-yellow-500";
      case "3 & Final":
        return "text-red-500";
      default:
        return "";
    }
  };

  return (
    <motion.div
      className={`flex ${
        isPhase ? "flex-col items-start" : "items-center"
      } space-y-2 p-3 border-l-4 bg-secondary-800 rounded-r-lg flex-1 min-w-[200px]`}
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
      <div
        className={`flex ${
          isPhase ? "flex items-center space-x-2" : "items-center space-x-3"
        }`}
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
        <div
          className={` ${isPhase ? "flex gap-3 items-center text-3xl " : ""} `}
        >
          <p className="text-xs">{title}</p>
          <p
            className={`font-bold ${
              isProfit !== undefined
                ? isProfit
                  ? "text-green-500"
                  : "text-red-500"
                : isPhase
                ? getPhaseColor(value)
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
  const depositBalance = useSelector((store) => store.user.depositBalance);
  const profitNloss = useSelector((store) => store.user.profitNloss);
  const userInfo = useSelector((store) => store.user.userInfo);
  const phase = useSelector((store) => store.user.phase);

  const isPositive = parseFloat(profitNloss) >= 0;

  return (
    <div className="flex flex-wrap justify-between items-stretch bg-secondary-800/60 shadow-md rounded-lg p-4 gap-4">
      <BalanceCard
        icon={Scale}
        title="Account Size"
        value={`${userInfo?.Balance > 0 ? depositBalance : "000"} $USD`}
        // value={`${depositBalance} $USD`}
        borderColor="#f97316"
        delay={0.2}
      />
      <BalanceCard
        icon={Activity}
        title="Available Balance"
        value={`${userInfo.Balance} $USD`}
        borderColor="#3b82f6"
        delay={0.3}
      />
      <BalanceCard
        icon={isPositive ? TrendingUp : TrendingDown}
        title="Profit/Loss"
        value={`${profitNloss.toFixed(2)} USD`}
        borderColor="#facc15"
        delay={0.4}
        isProfit={isPositive}
      />
      <BalanceCard
        icon={CircleDot}
        title="Phase"
        value={phase === 3 ? "3 & Final" : phase}
        borderColor="#a855f7"
        delay={0.5}
        isPhase={true}
      />
    </div>
  );
};

export default UserDashboardBalanceCards;
