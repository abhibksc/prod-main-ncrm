import useMT5Stats from "@/hooks/admin/UseMT5AccountStats";
import {
  Users,
  Power,
  PowerOff,
  TrendingUp,
  TrendingDown,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MetricRow = ({ icon: Icon, label, value, color, description, link }) => {
  const navigate = useNavigate();

  return (
    <div
      className="flex bg-primary-700/40 items-center gap-3 sm:gap-10 p-2 sm:px-8 px-4 hover:bg-primary-700 rounded-xl transition-colors border-b border-primary-400 cursor-pointer"
      onClick={() => link && navigate(link)}
    >
      <div
        className="p-2 sm:p-3 rounded-full shrink-0"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-4 h-4 sm:w-6 sm:h-6" style={{ color }} />
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm sm:text-base text-gray-200 mb-0 sm:mb-1">
          {label}
        </h3>
        {description && (
          <p className="text-xs sm:text-sm text-gray-300/80 truncate hidden sm:block">
            {description}
          </p>
        )}
      </div>

      <div className="flex flex-col items-end shrink-0">
        <span className="text-base sm:text-2xl font-bold" style={{ color }}>
          {value}
        </span>
      </div>
    </div>
  );
};

const Mt5AccountsReport = () => {
  const { isLoading, mt5Stats } = useMT5Stats();

  const metrics = [
    {
      icon: Users,
      label: "Total MT5 Accounts",
      value: isLoading ? <Loader2 className="animate-spin" /> : mt5Stats?.total,
      color: "#8B5CF6",
      description: "Total number of MT5 trading accounts",
    },
    {
      icon: Power,
      label: "Active Accounts",
      value: isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        mt5Stats?.active
      ),
      color: "#10B981",
      description: "Currently active trading accounts",
    },
    {
      icon: PowerOff,
      label: "Disabled Accounts",
      value: isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        mt5Stats?.disabled
      ),
      color: "#6B7280",
      description: "Currently disabled trading accounts",
    },
    {
      icon: TrendingUp,
      label: "Profitable Accounts",
      value: isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        mt5Stats?.profitable
      ),
      color: "#06B6D4",
      description: "Accounts with positive floating profit",
    },
    {
      icon: TrendingDown,
      label: "Loss Accounts",
      value: isLoading ? <Loader2 className="animate-spin" /> : mt5Stats?.loss,
      color: "#EF4444",
      description: "Accounts with negative floating profit",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto rounded-lg shadow-sm px-2 sm:px-0">
      <div className="flex flex-col justify-center items-center my-2 sm:my-4">
        <h1 className="text-lg sm:text-3xl font-bold bg-gradient-to-r from-white/80 to-primary-400 text-transparent bg-clip-text">
          MT5 Accounts Report
        </h1>
      </div>

      <div className="rounded-lg space-y-1">
        {metrics.map((metric, index) => (
          <MetricRow key={index} {...metric} />
        ))}
      </div>
    </div>
  );
};

export default Mt5AccountsReport;
