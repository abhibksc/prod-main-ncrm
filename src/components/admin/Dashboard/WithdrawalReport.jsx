import { BadgeDollarSign, Loader, Loader2, ShieldX } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Dummy hook to prevent errors (replace with real hook later)
const useWithdrawalStats = () => {
  return {
    withdrawalStats: {
      total: 10000,
      pending: 500,
      rejected: 120,
      approved: 9380,
      todayApproved: 250,
      lastWeekApproved: 1800,
    },
    isLoading: false, // Set true to test loader
  };
};

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

const WithdrawalReport = () => {
  const { withdrawalStats, isLoading } = useWithdrawalStats();

  const metrics = [
    {
      icon: BadgeDollarSign,
      label: "Total Withdrawn",
      link: "/admin/withdrawal/all",
      value: isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        withdrawalStats?.total
      ),
      color: "#8B5CF6",
      description: "All-time total withdrawals by users",
    },
    {
      icon: Loader,
      label: "Pending Withdrawals",
      link: "/admin/withdrawal/pending",
      value: isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        withdrawalStats?.pending
      ),
      color: "#06B6D4",
      description: "Withdrawals awaiting verification",
    },
    {
      icon: ShieldX,
      label: "Rejected Withdrawals",
      link: "/admin/withdrawal/rejected",
      value: isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        withdrawalStats?.rejected
      ),
      color: "#F97316",
      description: "Total rejected withdrawal requests",
    },
    {
      icon: BadgeDollarSign,
      label: "Approved Withdrawals",
      link: "/admin/withdrawal/approved",
      value: isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        withdrawalStats?.approved
      ),
      color: "#10B981",
      description: "Total approved withdrawals",
    },
    {
      icon: BadgeDollarSign,
      label: "Today's Approved Withdrawals",
      value: isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        withdrawalStats?.todayApproved
      ),
      color: "#F59E0B",
      description: "Withdrawals approved in the last 24 hours",
    },
    {
      icon: BadgeDollarSign,
      label: "Last Week Approved Withdrawals",
      value: isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        withdrawalStats?.lastWeekApproved
      ),
      color: "#3B82F6",
      description: "Withdrawals approved in the last 7 days",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto rounded-lg shadow-sm px-2 sm:px-0">
      <div className="flex flex-col justify-center items-center my-2 sm:my-4">
        <h1 className="text-lg sm:text-3xl font-bold bg-gradient-to-r from-white/80 to-primary-400 text-transparent bg-clip-text">
          Withdrawal Report
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

export default WithdrawalReport;
