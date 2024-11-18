import React, { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useSelector } from "react-redux";

const UserDashboardAccountStats = () => {
  const [openDropdowns, setOpenDropdowns] = useState({});
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const phaseStats = useSelector((store) => store.user.phaseStats);
  // console.log("phase stats account stats dashboard--", phaseStats);
  const phaseMinValueInNumber =
    (phaseStats?.min / 100) * loggedUser.accountSize;

  const phaseMaxValueInNumber =
    (phaseStats?.max / 100) * loggedUser.accountSize;

  // console.log("phase max value##--", phaseMaxValueInNumber);
  // console.log("phase max value##--", phaseMinValueInNumber);

  const toggleDropdown = (id) => {
    setOpenDropdowns((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const stats = [
    {
      id: "Max Profit",
      label: "Max Profit",
      value: `${
        phaseMaxValueInNumber === Infinity
          ? "No Limit" || null
          : phaseMaxValueInNumber || null
      }`,
      status: "Reached",
      description:
        "Maximize your trading potential with our advanced CRM. Track your trades, manage accounts, and secure Max Profit on every move!",
    },
    {
      id: "Max Loss",
      label: "Max Loss",
      value: `${
        phaseMinValueInNumber === Infinity
          ? "No Limit" || null
          : phaseMinValueInNumber || null
      }`,
      status: "Passing",
      description:
        "Keep your losses in check! Our CRM gives you the power to monitor positions and avoid reaching your Max Loss limit.",
    },
    {
      id: "Growth",
      label: "Growth",
      value: `${
        phaseStats?.max === Infinity || null
          ? "No Limit"
          : phaseStats?.max || null
      } ${phaseStats?.max === Infinity ? "" : "%"}`,
      status: "Passed",
      description:
        "Achieve sustainable Growth in your Forex trading with our CRM’s powerful analytics and account management tools at your fingertips.",
    },
    {
      id: "Decline",
      label: "Decline",
      value: `${
        phaseStats?.min === Infinity ? "No Limit" || null : phaseStats?.min
      } ${phaseStats?.min === Infinity ? "" : "%"}`,
      description:
        "Stay ahead of the curve and avoid Decline in your trades with real-time insights and risk management tools from our Forex CRM.",
    },
  ];

  return (
    <div className="bg-secondary-800/70 shadow-md rounded-lg p-4 sm:p-6 max-w-full sm:max-w-4xl mx-auto">
      <h2 className="text-lg sm:text-xl text-center font-semibold mb-4">
        Account Stats - {loggedUser.accountType}
      </h2>
      <div className="space-y-2">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className=" border border-secondary-600/30 rounded-md overflow-hidden"
          >
            <div
              className="flex justify-between items-center p-3 cursor-pointer text-sm sm:text-base"
              onClick={() => toggleDropdown(stat.id)}
            >
              <span className="font-medium">{stat.label}</span>
              <div className="flex items-center">
                <span className="mr-2">
                  {" "}
                  {loggedUser.phase > 0 && stat.value}
                </span>
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
