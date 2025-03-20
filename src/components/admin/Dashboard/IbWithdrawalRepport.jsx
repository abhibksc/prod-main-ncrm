import React from "react";
import { BadgeDollarSign, Loader, Loader2, ShieldX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useDashboardStats from "@/hooks/admin/UseDashboardStats";

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

const IBWithdrawalReport = () => {
  const { error, isLoading, ibWithdrawalStats } = useDashboardStats();
  const metrics = [
    {
      icon: BadgeDollarSign,
      label: "Total IB Withdrawn",
      link: "/admin/ib-withdrawal/all",
      value: isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        ibWithdrawalStats?.total
      ),
      color: "#8B5CF6",
      description: "All-time total IB withdrawals by users",
    },
    {
      icon: Loader,
      label: "Pending IB Withdrawals",
      link: "/admin/ib-withdrawal/pending",
      value: isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        ibWithdrawalStats?.pending
      ),
      color: "#06B6D4",
      description: "IB withdrawals awaiting verification",
    },
    {
      icon: ShieldX,
      label: "Rejected IB Withdrawals",
      link: "/admin/ib-withdrawal/rejected",
      value: isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        ibWithdrawalStats?.rejected
      ),
      color: "#F97316",
      description: "Total rejected IB withdrawal requests",
    },
    {
      icon: BadgeDollarSign,
      label: "Approved IB Withdrawals",
      link: "/admin/ib-withdrawal/approved",
      value: isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        ibWithdrawalStats?.approved
      ),
      color: "#10B981",
      description: "Total approved IB withdrawals",
    },
    {
      icon: BadgeDollarSign,
      label: "Today's Approved IB Withdrawals",
      value: isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        ibWithdrawalStats?.todayApproved
      ),
      color: "#F59E0B",
      description: "IB withdrawals approved in the last 24 hours",
    },
    {
      icon: BadgeDollarSign,
      label: "Last Week Approved IB Withdrawals",
      value: isLoading ? (
        <Loader2 className="animate-spin" />
      ) : (
        ibWithdrawalStats?.lastWeekApproved
      ),
      color: "#3B82F6",
      description: "IB withdrawals approved in the last 7 days",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto rounded-lg shadow-sm px-2 sm:px-0">
      <div className="flex flex-col justify-center items-center my-2 sm:my-4">
        <h1 className="text-lg sm:text-3xl font-bold bg-gradient-to-r from-white/80 to-primary-400 text-transparent bg-clip-text">
          IB Withdrawal Report
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

export default IBWithdrawalReport;
