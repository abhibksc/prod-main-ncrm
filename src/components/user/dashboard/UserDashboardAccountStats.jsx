import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const UserDashboardAccountStats = () => {
  const [openDropdowns, setOpenDropdowns] = useState({});

  const toggleDropdown = (id) => {
    setOpenDropdowns((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const stats = [
    {
      id: "dailyLoss",
      label: "Daily Loss",
      value: "1,500.00 USD",
      status: "Reached",
      description:
        "Daily loss is the maximum amount you are allowed to lose in a single trading day. Breaching this limit results in the termination of the account.",
    },
    {
      id: "maxLoss",
      label: "Max Loss",
      value: "3,000.00 USD",
      status: "Passing",
      description:
        "Daily loss is the maximum amount you are allowed to lose in a single trading day. Breaching this limit results in the termination of the account.",
    },
    {
      id: "goal",
      label: "Goal",
      value: "6,000.00 USD",
      status: "Passed",
      description:
        "Daily loss is the maximum amount you are allowed to lose in a single trading day. Breaching this limit results in the termination of the account.",
    },
    {
      id: "growth",
      label: "Growth",
      value: "14.45%",
      status: "Passed",
      description:
        "Daily loss is the maximum amount you are allowed to lose in a single trading day. Breaching this limit results in the termination of the account.",
    },
    {
      id: "pnlFloating",
      label: "PnL Floating",
      value: "0 USD",
      status: "Information",
      description:
        "Daily loss is the maximum amount you are allowed to lose in a single trading day. Breaching this limit results in the termination of the account.",
    },
    {
      id: "fundedPlan",
      label: "Funded Plan",
      value: "ONE STEP EVALUATION",
      description:
        "Daily loss is the maximum amount you are allowed to lose in a single trading day. Breaching this limit results in the termination of the account.",
    },
    {
      id: "firstTradeAt",
      label: "First Trade At",
      value: "08-07-2024",
      description:
        "Daily loss is the maximum amount you are allowed to lose in a single trading day. Breaching this limit results in the termination of the account.",
    },
    {
      id: "minimumTradingDays",
      label: "Minimum Trading Days",
      value: "28/4",
      description:
        "Daily loss is the maximum amount you are allowed to lose in a single trading day. Breaching this limit results in the termination of the account.",
    },
    {
      id: "profitTarget",
      label: "Profit Target",
      value: "$7,225.00/$6000",
      description:
        "Daily loss is the maximum amount you are allowed to lose in a single trading day. Breaching this limit results in the termination of the account.",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Reached":
        return "bg-red-500";
      case "Passing":
        return "bg-blue-400";
      case "Passed":
        return "bg-green-500";
      case "Information":
        return "bg-yellow-400";
      default:
        return "bg-gray-200";
    }
  };

  return (
    <div className="bg-secondary-800/70 shadow-md rounded-lg p-4 sm:p-6 max-w-full sm:max-w-4xl mx-auto">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">
        Account Stats - ONE STEP EVALUATION
      </h2>
      <div className="space-y-2">
        {stats.map((stat) => (
          <div key={stat.id} className="border rounded-md overflow-hidden">
            <div
              className="flex justify-between items-center p-3 cursor-pointer text-sm sm:text-base"
              onClick={() => toggleDropdown(stat.id)}
            >
              <span className="font-medium">{stat.label}</span>
              <div className="flex items-center">
                <span className="mr-2">{stat.value}</span>
                {stat.status && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs sm:text-xs text-white ${getStatusColor(
                      stat.status
                    )}`}
                  >
                    {stat.status}
                  </span>
                )}
                {openDropdowns[stat.id] ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </div>
            </div>
            <div
              className={`transition-all duration-300 ease-in-out ${
                openDropdowns[stat.id]
                  ? "max-h-40 opacity-100"
                  : "max-h-0 opacity-0"
              } overflow-hidden`}
            >
              {stat.description && (
                <div className="p-3 bg-secondary-700/50 border-t text-sm sm:text-base">
                  {stat.description}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboardAccountStats;
