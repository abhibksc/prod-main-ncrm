import React from "react";
import { Wallet, WalletCards, HandCoins, TreePine } from "lucide-react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";

const MetricHexagon = ({ icon: Icon, label, value, color }) => (
  <motion.div
    className="relative w-full max-w-[120px]"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300, damping: 10 }}
  >
    <svg className="w-full h-auto" viewBox="0 0 120 140">
      <polygon
        points="60,0 120,35 120,105 60,140 0,105 0,35"
        fill={color}
        opacity="0.1"
      />
      <polygon
        points="60,0 120,35 120,105 60,140 0,105 0,35"
        fill="none"
        stroke={color}
        strokeWidth="2"
      />
    </svg>
    <div className="absolute inset-0 flex flex-col text-gray-200 items-center justify-center text-center p-2">
      <Icon className="w-4 h-4 sm:w-6 sm:h-6 mb-1" color={color} />
      <span className="text-sm sm:text-xl font-bold" style={{ color }}>
        {value}
      </span>
      <span className="text-[8px] sm:text-xs font-medium mt-1">{label}</span>
    </div>
  </motion.div>
);

const InvestmentReport = () => {
  const deposits = useSelector((store) => store.admin.deposits);

  const totalInvest = deposits
    ?.filter((value) => value.deposit)
    .reduce((total, value) => total + Number(value.deposit), 0);

  const metrics = [
    {
      icon: Wallet,
      label: "Total Invest",
      value: totalInvest,
      color: "#22C55E",
    },
    {
      icon: WalletCards,
      label: "Last 7 days Invest",
      value: 0,
      color: "#3B82F6",
    },
    {
      icon: HandCoins,
      label: "Total Referal Commission",
      value: 0,
      color: "#F59E0B",
    },
    {
      icon: TreePine,
      label: "Total Binary Commission",
      value: 0,
      color: "#EF4444",
    },
  ];

  return (
    <div className="bg-transparent text-white rounded-2xl shadow-md max-w-3xl mx-auto p-4">
      <div className="flex justify-between flex-col items-center mb-4">
        <h2 className="text-lg text-center font-bold">Investment Report</h2>
      </div>
      <div className="flex flex-wrap justify-between gap-4">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="w-[calc(50%-0.5rem)] sm:w-[calc(25%-0.75rem)]"
          >
            <MetricHexagon {...metric} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default InvestmentReport;
