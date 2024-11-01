import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const UserIBcards = ({ commissionsData }) => {
  const totalCommissionLength = commissionsData.length;
  const totalCommissionValue = commissionsData.reduce(
    (increment, value) => increment + Number(value.commission),
    0
  );

  const stats = {
    totalIBs: totalCommissionLength,
    totalCommission: totalCommissionValue,
    availableCommission: totalCommissionValue,
    pendingWithdrawals: "$0",
    pendingDeposits: "$0", // Dummy data for pending deposits
    activeClients: "0", // Dummy data for active clients
  };

  return (
    <div className="p-6 w-full max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* IB ID Card */}
        <div className="bg-secondary-600/10 rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-gray-300">
                Total Affiliates
              </span>
              <span className="text-2xl font-bold text-gray-100">
                {stats.totalIBs}
              </span>
            </div>
            <div className="p-3 bg-blue-200 rounded-full">
              <svg
                className="w-6 h-6 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm  text-blue-300/80 flex items-center">
              <span>Total Deposit Entries</span>
            </div>
          </div>
        </div>

        {/* Total Commission Card */}
        <div className="bg-secondary-600/10  rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-gray-300">
                Total Commission
              </span>
              <span className="text-2xl font-bold text-gray-100">
                ${Number(stats?.totalCommission || 0).toFixed(2)}
              </span>
            </div>

            <div className="p-3 bg-green-200 rounded-full">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-sm text-green-300/80 flex items-center">
              <span>Lifetime Commission Earnings</span>
            </div>
          </div>
        </div>
        {/* Withdrawal Hisstory Card */}
        <div className="bg-secondary-600/10  rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-gray-300">
                Withdrawals History
              </span>
              <span className="text-2xl font-bold text-gray-100">
                {stats.pendingWithdrawals}
              </span>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <svg
                className="w-6 h-6 text-orange-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <Link to={"/user/referrals/withdrawal-history"}>
              <div className="text-sm text-blue-400 hover:text-blue-500 hover:pl-1  transition-all flex gap-1 items-center">
                <span>Withdrwal History </span>
                <ArrowRight></ArrowRight>
              </div>
            </Link>
          </div>
        </div>

        {/* Available Commission Card */}
        <div className="bg-secondary-600/10  rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-gray-300">
                Available Commission
              </span>
              <span className="text-2xl font-bold text-green-500/70">
                ${Number(stats?.availableCommission || 0).toFixed(2)}
              </span>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <svg
                className="w-6 h-6 text-purple-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <Link to={"/user/referrals/withdraw"}>
              <button
                className="w-full bg-green-600/80 hover:bg-green-700 text-white py-2 px-4 rounded-full transition-colors duration-200 flex items-center justify-center font-medium"
                onClick={() => console.log("Withdraw clicked")}
              >
                Withdraw
              </button>
            </Link>
          </div>
        </div>

        {/* Pending Deposits Card */}
        <div className="bg-secondary-600/10 rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-gray-300">
                Pending Deposits
              </span>
              <span className="text-2xl font-bold text-gray-100">
                {stats.pendingDeposits}
              </span>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <svg
                className="w-6 h-6 text-yellow-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <button
              className="w-full bg-yellow-600/80 hover:bg-yellow-700 text-white py-2 px-4 rounded-full transition-colors duration-200 flex items-center justify-center font-medium"
              onClick={() => console.log("View Deposits clicked")}
            >
              View List
            </button>
          </div>
        </div>

        {/* Active Clients Card */}
        <div className="bg-secondary-600/10 rounded-xl shadow-sm hover:shadow-xl transition-shadow duration-200 p-6">
          <div className="flex items-center justify-between">
            <div className="flex flex-col space-y-1">
              <span className="text-sm font-medium text-gray-300">
                Active Clients
              </span>
              <span className="text-2xl font-bold text-gray-100">
                {stats.activeClients}
              </span>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full">
              <svg
                className="w-6 h-6 text-indigo-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <button
              className="w-full bg-indigo-600/80 hover:bg-indigo-700 text-white py-2 px-4 rounded-full transition-colors duration-200 flex items-center justify-center font-medium"
              onClick={() => console.log("View Clients clicked")}
            >
              View Clients
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserIBcards;
