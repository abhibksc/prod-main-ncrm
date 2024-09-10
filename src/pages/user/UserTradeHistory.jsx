import React, { useEffect, useState } from "react";
import { DollarSign, BarChart2 } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import Loader from "@/components/Loader/Loader";

export default function UserTradeHistory() {
  const [activeTab, setActiveTab] = useState("closed");
  const [tradeData, setTradeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userInfo = useSelector((store) => store.user.userInfo);
  const currentDate = new Date().toISOString().slice(0, 10);

  const fetchTradeData = async (tradeType = "closed") => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (tradeType === "closed") {
        res = await axios.get(
          `${
            import.meta.env.VITE_API_END_POINT
          }/api/web/GetCloseTradeAll?Manager_Index=1&MT5Accont=${
            userInfo.MT5Account
          }&StartTime=2021-07-20 00:00:00&EndTime=${currentDate} 23:59:59`
        );
      } else {
        res = await axios.get(
          `${
            import.meta.env.VITE_API_END_POINT
          }/api/web/getOpenTradeByAccount?Manager_Index=1&MT5Accont=${
            userInfo.MT5Account
          }`
        );
      }
      console.log("res trade history--", res.data);
      setTradeData(res.data);
      setActiveTab(tradeType);
    } catch (error) {
      console.error("Error fetching trade data:", error);
      // setError("Failed to fetch trade data. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchTradeData();
  }, []);

  const handleTabClick = (tradeType) => {
    fetchTradeData(tradeType);
  };

  return (
    <div className="bg-secondary-800/70 p-6 rounded-lg shadow-lg my-5 text-white">
      <h1 className="mb-6 text-2xl font-bold flex items-center">
        <BarChart2 className="mr-2" />
        Trades History
      </h1>
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors ${
            activeTab === "closed"
              ? "bg-yellow-600 text-white"
              : "bg-secondary-800 text-gray-300 hover:bg-secondary-700/50"
          }`}
          onClick={() => handleTabClick("closed")}
        >
          Closed Trades
        </button>
        <button
          className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors ${
            activeTab === "open"
              ? "bg-green-700 text-white"
              : "bg-secondary-800 text-gray-300 hover:bg-secondary-700/50"
          }`}
          onClick={() => handleTabClick("open")}
        >
          Open Trades
        </button>
      </div>
      {loading && (
        <div className="text-center py-4">
          <span>
            <Loader></Loader>
          </span>
        </div>
      )}
      {error && <div className="text-center py-4 text-red-500">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="text-left py-3 px-4">Account No</th>
                <th className="text-left py-3 px-4">Symbol</th>
                {activeTab === "open" ? (
                  <th className="text-left py-3 px-4">Open Time</th>
                ) : (
                  <th className="text-left py-3 px-4">Close Time</th>
                )}
                <th className="text-left py-3 px-4">Open Price</th>
                {activeTab === "closed" && (
                  <th className="text-left py-3 px-4">Close Price</th>
                )}
                <th className="text-center py-3 px-4">Buy/Sell</th>
                <th className="text-right py-3 px-4">Volume</th>
                <th className="text-right py-3 px-4">P/L</th>
              </tr>
            </thead>
            <tbody>
              {tradeData?.map((trade, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-700 hover:bg-secondary-800"
                >
                  <td className="py-1 px-4">{trade?.MT5Account}</td>
                  <td className="py-1 px-4">{trade?.Symbol}</td>
                  <td className="py-1">
                    {activeTab === "open"
                      ? trade?.Open_Time
                      : trade?.Close_Time}
                  </td>
                  <td className="text-left py-1 px-6">{trade?.Open_Price}</td>
                  {activeTab === "closed" && (
                    <td className="text-left py-2 px-6 ">
                      {trade?.Close_Price}
                    </td>
                  )}
                  <td
                    className={`text-center py-3 px-4 ${
                      trade?.BUY_SELL === 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {trade?.BUY_SELL === 0 ? "Buy" : "Sell"}
                  </td>
                  <td className="text-right py-3 px-4">
                    {trade?.Lot / 100000}
                  </td>
                  <td
                    className={`text-right py-3 px-4 ${
                      trade?.Profit >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    <span className={`flex items-center justify-end`}>
                      {trade?.Profit}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
