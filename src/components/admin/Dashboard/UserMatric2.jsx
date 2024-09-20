import React from "react";
import { Users, UserCheck, Mail, Smartphone } from "lucide-react";
import { motion } from "framer-motion";

const MetricHexagon = ({ icon: Icon, label, value, color }) => (
  <motion.div
    className="relative"
    whileHover={{ scale: 1.05 }}
    transition={{ type: "spring", stiffness: 300, damping: 10 }}
  >
    <svg width="120" height="140" viewBox="0 0 120 140">
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
      <Icon className="w-6 h-6 mb-1" color={color} />
      <span className="text-xl font-bold" style={{ color }}>
        {value}
      </span>
      <span className="text-xs font-medium mt-1">{label}</span>
    </div>
  </motion.div>
);

const CompactHexagonalMetricRow = () => {
  const metrics = [
    { icon: Users, label: "Total Users", value: 5, color: "#3B82F6" },
    { icon: UserCheck, label: "Active Users", value: 5, color: "#10B981" },
    { icon: Mail, label: "Email Unverified", value: 0, color: "#F59E0B" },
    {
      icon: Smartphone,
      label: "Mobile Unverified",
      value: 0,
      color: "#EF4444",
    },
  ];

  return (
    <div className=" bg-transparent text-white  rounded-2xl shadow-md max-w-3xl mx-auto">
      <div className="flex justify-between flex-col items-center mb-4">
        <h2 className="text-lg text-center font-bold ">User Metrics</h2>
      </div>
      <div className="flex justify-between space-x-2">
        {metrics.map((metric, index) => (
          <MetricHexagon key={index} {...metric} />
        ))}
      </div>
    </div>
  );
};

export default CompactHexagonalMetricRow;
