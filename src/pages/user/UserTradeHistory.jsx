import React, { useEffect, useState } from "react";
import { DollarSign, BarChart2 } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import Loader from "@/components/Loader/Loader";
import { AnimatePresence, motion } from "framer-motion";

export default function UserTradeHistory() {
  const [activeTab, setActiveTab] = useState("closed");
  const [tradeData, setTradeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const currentAccount = useSelector((store) => store.user.currentAccount);
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
          }/api/web/GetCloseTradeAll?Manager_Index=${
            import.meta.env.VITE_MANAGER_INDEX
          }&MT5Accont=${
            loggedUser.mt5Account
          }&StartTime=2021-07-20 00:00:00&EndTime=${currentDate} 23:59:59`
        );
      } else {
        res = await axios.get(
          `${
            import.meta.env.VITE_API_END_POINT
          }/api/web/getOpenTradeByAccount?Manager_Index=${
            import.meta.env.VITE_MANAGER_INDEX
          }&MT5Accont=${loggedUser.mt5Account}`
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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  };

  const tableVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="bg-secondary-800/70 p-6 rounded-lg shadow-lg my-5 text-white"
    >
      <motion.h1
        variants={itemVariants}
        className="mb-6 text-2xl font-bold flex items-center"
      >
        <BarChart2 className="mr-2" />
        Trades History
      </motion.h1>
      <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors ${
            activeTab === "closed"
              ? "bg-yellow-600 text-white"
              : "bg-secondary-800 text-gray-300 hover:bg-secondary-700/50"
          }`}
          onClick={() => handleTabClick("closed")}
        >
          Closed Trades
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors ${
            activeTab === "open"
              ? "bg-green-700 text-white"
              : "bg-secondary-800 text-gray-300 hover:bg-secondary-700/50"
          }`}
          onClick={() => handleTabClick("open")}
        >
          Open Trades
        </motion.button>
      </motion.div>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center py-4"
        >
          <Loader />
        </motion.div>
      )}
      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="text-center py-4 text-red-500"
        >
          {error}
        </motion.div>
      )}
      {!loading && !error && (
        <motion.div
          variants={tableVariants}
          initial="hidden"
          animate="visible"
          className="overflow-x-auto"
        >
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
            <AnimatePresence>
              <motion.tbody variants={tableVariants}>
                {tradeData?.map((trade, index) => (
                  <motion.tr
                    key={index}
                    variants={rowVariants}
                    className="border-b border-gray-700 hover:bg-secondary-800 transition-all"
                    whileHover={{
                      backgroundColor: "rgba(255,255,255,0.05)",
                      transition: { duration: 0.2 },
                    }}
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
                        trade?.BUY_SELL === 0
                          ? "text-green-500"
                          : "text-red-500"
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
                      <span className="flex items-center justify-end">
                        {trade?.Profit}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </motion.tbody>
            </AnimatePresence>
          </table>
        </motion.div>
      )}
    </motion.div>
  );
}
