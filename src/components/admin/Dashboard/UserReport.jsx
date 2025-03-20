import useDashboardStats from "@/hooks/admin/UseDashboardStats";
import {
  Users,
  UserCheck,
  Mail,
  MailX,
  ShieldCheck,
  ShieldX,
  Clock,
  UserPlus,
  Loader2,
  Globe2,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";

const MetricRow = ({ icon: Icon, label, value, color, description, link }) => {
  const Wrapper = ({ children }) =>
    link ? (
      <Link to={link} className="block no-underline">
        {children}
      </Link>
    ) : (
      <>{children}</>
    );

  return (
    <Wrapper>
      <div className="flex bg-primary-700/40 items-center gap-3 sm:gap-10 p-2 sm:px-8 px-4 hover:bg-primary-700 rounded-xl transition-colors border-b border-primary-400 cursor-pointer">
        <div
          className="p-2 sm:p-3 rounded-full shrink-0"
          style={{ backgroundColor: `${color}26` }}
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
    </Wrapper>
  );
};

const UserReport = () => {
  const { error, isLoading, userStats } = useDashboardStats();

  const renderValue = (data) => {
    if (isLoading) return <Loader2 className="animate-spin" />;
    if (error) return "Error";
    return data ?? "N/A";
  };

  const metrics = [
    {
      icon: Users,
      label: "Total Users",
      value: renderValue(userStats?.totalUsers),
      color: "#3B82F6",
      link: "/admin/manage-users/all-users",
      description: "All registered platform users",
    },
    {
      icon: ShieldCheck,
      label: "KYC Verified",
      value: renderValue(userStats?.kycVerified),
      color: "#059669",
      link: "/admin/manage-users/kyc-verified",
      description: "Users with completed KYC",
    },
    {
      icon: ShieldX,
      label: "KYC Unverified",
      value: renderValue(userStats?.kycUnverified),
      color: "#DC2626",
      link: "/admin/manage-users/kyc-unverified",
      description: "Pending KYC verification",
    },
    {
      icon: Mail,
      label: "Email Verified",
      value: renderValue(userStats?.emailVerified),
      color: "#2563EB",
      link: "/admin/manage-users/email-verified",
      description: "Users with verified emails",
    },
    {
      icon: MailX,
      label: "Email Unverified",
      value: renderValue(userStats?.emailUnverified),
      color: "#EF4444",
      link: "/admin/manage-users/email-unverified",
      description: "Pending email verification",
    },
    {
      icon: UserPlus,
      label: "Today Registered Users",
      value: renderValue(userStats?.todayCount),
      color: "#8B5CF6",
      description: "New users in last 24h",
    },
    {
      icon: Clock,
      label: "Last Week Users",
      value: renderValue(userStats?.lastWeekCount),
      color: "#F59E0B",
      description: "New users in last 7 days",
    },
    {
      icon: Clock,
      label: "Last Month Users",
      value: renderValue(userStats?.lastMonthCount),
      color: "#8B5CF6",
      description: "New users in last 30 days",
    },
    {
      icon: Globe2,
      label: "Total IB Users",
      value: renderValue(userStats?.totalIbUsers),
      color: "#34D399",
      description: "Users registered as IB",
    },
    {
      icon: UsersRound,
      label: "Total Referral Users",
      value: renderValue(userStats?.totalReferralUsers),
      color: "#F97316",
      description: "Users joined via referral links",
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto rounded-lg shadow-sm px-2 sm:px-0">
      <div className="flex flex-col justify-center items-center my-2 sm:my-4">
        <h1 className="text-lg sm:text-3xl font-bold bg-gradient-to-r from-white/80 to-primary-400 text-transparent bg-clip-text">
          User Report
        </h1>
      </div>

      {error ? (
        <div className="text-center text-red-500 text-lg">
          Error fetching user stats
        </div>
      ) : (
        <div className="rounded-lg space-y-1">
          {metrics.map((metric, index) => (
            <MetricRow key={index} {...metric} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserReport;
