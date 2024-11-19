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
  isMax,
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
                ? getPhaseColor(value, isMax)
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

  const isPositive = parseFloat(profitNloss) >= 0;
  const isMax = phaseMaxLength === loggedUser.phase;

  return (
    <div className="flex flex-wrap justify-between items-stretch bg-secondary-800/40 shadow-md rounded-lg p-4 gap-4">
      <BalanceCard
        icon={Scale}
        title="Account Size"
        value={`${loggedUser.accountSize} $USD`}
        borderColor="#52b788"
        delay={0.2}
      />
      <BalanceCard
        icon={Activity}
        title="Available Balance"
        value={`${loggedUser.phase === 0 ? "000" : availableBalance} $USD`}
        borderColor="#52b788"
        delay={0.3}
      />
      <BalanceCard
        icon={isPositive ? TrendingUp : TrendingDown}
        title="Profit/Loss"
        value={`${loggedUser.phase === 0 ? 0 : profitNloss.toFixed(2)} USD`}
        borderColor="#52b788"
        delay={0.4}
        isProfit={isPositive}
      />
      <BalanceCard
        icon={CircleDot}
        title="Phase"
        value={
          loggedUser.accountSize > 0 && isMax
            ? `Live Account`
            : loggedUser.phase
        }
        // value={isMax ? `Live Account` : loggedUser.phase}
        borderColor="#52b788"
        delay={0.5}
        isMax={isMax}
        isPhase={true}
      />
    </div>
  );
};

export default UserDashboardBalanceCards;
