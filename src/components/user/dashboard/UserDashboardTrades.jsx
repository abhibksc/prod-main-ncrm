import React from "react";
import { BarChart2, ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UserDashboardTrades() {
  const navigate = useNavigate();
  const openTrades = useSelector((store) => store.user.openTrades);
  // console.log("open trades--", openTrades);
  const ProfitTradesData = openTrades.filter((value) => value.Profit > 0);
  //   console.log("profit trades--", ProfitTradesData);
  const calculateWinningRatio = () => {
    const positiveTradesCount = openTrades.filter(
      (entry) => entry.Profit > 0
    ).length;

    const totalTradesCount = openTrades.length;
    if (totalTradesCount === 0) {
      return 0;
    }

    return (positiveTradesCount / totalTradesCount) * 100;
  };

  // console.log("Overall Profit Percentage:", calculateWinningRatio());

  const calculateTotalNetProfit = () => {
    const totalNetProfit = openTrades.reduce(
      (sum, entry) => sum + entry.Profit,
      0
    );

    return totalNetProfit;
  };

  // console.log("Total net profit:", calculateTotalNetProfit());

  const tradesSummary = {
    totalTrades: openTrades?.length,
    profitableTrades: ProfitTradesData?.length,
    winRate: calculateWinningRatio(),
    netProfit: calculateTotalNetProfit(),
  };

  return (
    <div className="bg-secondary-800/80 p-6 rounded-lg shadow-lg my-5 text-white">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <BarChart2 className="mr-2 text-secondary-500" />
          Trades Summary
        </h2>
        <button
          onClick={() => navigate("/user/trade-history")}
          className="flex items-center text-blue-400 hover:text-blue-300 transition-colors"
        >
          View Full History
          <ArrowRight className="ml-1" size={18} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-secondary-700/30  p-4 rounded-lg">
          <p className="text-gray-100 mb-1">Total Trades</p>
          <p className="text-2xl font-bold">{tradesSummary.totalTrades}</p>
        </div>
        <div className="bg-secondary-700/30 p-4 rounded-lg">
          <p className="text-gray-100 whitespace-nowrap mb-1">Profit Trades</p>
          <p className="text-2xl font-bold text-green-500">
            {tradesSummary.profitableTrades}
          </p>
        </div>
        <div className="bg-secondary-700/30 p-4 rounded-lg">
          <p className="text-gray-100 mb-1">PnL floating</p>
          <p className="text-2xl font-bold text-yellow-500">
            {tradesSummary.winRate.toFixed(2)}%
          </p>
        </div>
        <div className="bg-secondary-700/30 p-4 rounded-lg">
          <p className="text-gray-100 mb-1">Net Profit</p>
          <p
            className={`text-2xl font-bold ${
              tradesSummary.netProfit >= 0 ? "text-green-500" : "text-red-400"
            }`}
          >
            {tradesSummary.netProfit.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
