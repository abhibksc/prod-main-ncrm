import React from "react";
import { BadgeDollarSign, Loader, ShieldX, Percent } from "lucide-react";
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

const DepositWithdrawReport = () => {
  const deposits = useSelector((store) => store.admin.deposits);
  const withdrawals = useSelector((store) => store.admin.withdrawals);

  const totalDeposits = deposits?.length;
  const pendingDeposits = deposits?.filter(
    (value) => value.status === "pending"
  )?.length;
  const rejectedDeposits = deposits?.filter(
    (value) => value.status === "rejected"
  )?.length;
  console.log("dashboard deposits", deposits);
  console.log("dashboard total deposits", totalDeposits);
  console.log("dashboard pending deposits", pendingDeposits);
  console.log("dashboard rejected deposits", rejectedDeposits);
  // console.log("dashboard withdrawals", withdrawals);

  const metrics = [
    {
      icon: BadgeDollarSign,
      label: "Total Deposited",
      value: totalDeposits,
      color: "#8B5CF6", // Purple
    },
    {
      icon: Loader,
      label: "Pending Deposits",
      value: pendingDeposits,
      color: "#06B6D4",
    }, // Cyan
    {
      icon: ShieldX,
      label: "Rejected Deposits",
      value: rejectedDeposits,
      color: "#F97316",
    }, // Orange
    { icon: Percent, label: "Withdrawal charge", value: 0, color: "#EC4899" }, // Pink
  ];

  return (
    <div className="bg-transparent text-white rounded-2xl shadow-md max-w-3xl mx-auto p-4">
      <div className="flex justify-between flex-col items-center mb-4">
        <h2 className="text-lg text-center font-bold">Deposit & Withdrawal</h2>
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

export default DepositWithdrawReport;
