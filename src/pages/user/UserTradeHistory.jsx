import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import DynamicLoder from "@/components/Loader/DynamicLoder";
import ModernHeading from "@/lib/ModernHeading";
import { metaApi } from "@/utils/apiClients";
import { useSocketOpenTradesByAccounts } from "@/hooks/user/UseSocketOpenTradesByAccounts";

export default function UserTradeHistory() {
  const [activeTab, setActiveTab] = useState("open");
  const [tradeData, setTradeData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loggedUser = useSelector((store) => store.user.loggedUser);
  const accounts = loggedUser?.accounts?.map((a) => +a.accountNumber) || [];

  const {
    data: socketOpenTrades = [],
    loading: socketLoading,
    error: socketError,
  } = useSocketOpenTradesByAccounts(accounts);

  const fetchClosedTrades = async () => {
    setLoading(true);
    setError(null);

    const currentDate = new Date().toISOString().slice(0, 10);
    const result = [];

    try {
      for (const account of loggedUser.accounts) {
        const res = await metaApi.get(
          `/GetCloseTradeAll?Manager_Index=${
            import.meta.env.VITE_MANAGER_INDEX
          }&MT5Accont=${
            account.accountNumber
          }&StartTime=2021-07-20 00:00:00&EndTime=${currentDate} 23:59:59`
        );
        if (Array.isArray(res.data)) result.push(...res.data);
      }

      setTradeData(result);
      if (result.length === 0) setError("No closed trades found.");
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to fetch closed trade data.");
      setTradeData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "open") {
      setTradeData(socketOpenTrades || []);
    }
  }, [activeTab, socketOpenTrades]);

  useEffect(() => {
    if (activeTab === "closed") {
      fetchClosedTrades("closed");
    }
  }, [activeTab]);

  const handleTabClick = (tab) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      setTradeData([]); // reset data on switch
      setError(null);
    }
  };

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
      className="bg-secondary-800/20 p-5 rounded-lg shadow-lg text-white"
    >
      <div className="mb-5 flex justify-between">
        <ModernHeading text="Trades History" />
      </div>

      <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-6">
        {["open", "closed"].map((tab) => (
          <motion.button
            key={tab}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors ${
              activeTab === tab
                ? "bg-secondary-500-50 text-white"
                : "bg-secondary-800/40 text-gray-300 hover:bg-secondary-700/30"
            }`}
            onClick={() => handleTabClick(tab)}
          >
            {tab === "open" ? "Open Trades" : "Closed Trades"}
          </motion.button>
        ))}
      </motion.div>

      {(activeTab === "open" && socketLoading) ||
      (activeTab === "closed" && loading) ? (
        <div className="text-center py-4">
          <DynamicLoder />
        </div>
      ) : (activeTab === "open" && socketError) ||
        (activeTab === "closed" && error) ? (
        <div className="text-center py-4 text-red-500">
          {activeTab === "open" ? socketError : error}
        </div>
      ) : (
        <motion.div
          variants={tableVariants}
          initial="hidden"
          animate="visible"
          className="overflow-x-auto"
        >
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b whitespace-nowrap border-gray-700">
                <th className="text-left py-3 px-4">Account No</th>
                <th className="text-left py-3 px-4">Symbol</th>
                <th className="text-left py-3 px-4">Open Time</th>
                {activeTab === "closed" && (
                  <th className="text-left py-3 px-4">Close Time</th>
                )}
                <th className="text-left py-3 px-4">Open Price</th>
                {activeTab === "closed" && (
                  <th className="text-left py-3 px-4">Close Price</th>
                )}
                <th className="text-center py-3 px-4">Buy/Sell</th>
                <th className="text-center py-3 px-4">Volume</th>
                <th className="text-left py-3 px-4">P/L</th>
              </tr>
            </thead>
            <AnimatePresence>
              <motion.tbody variants={tableVariants}>
                {tradeData.map((trade, index) => (
                  <motion.tr
                    key={index}
                    variants={rowVariants}
                    className="border-b py-2 border-gray-700 hover:bg-secondary-800 transition-all"
                    whileHover={{
                      backgroundColor: "rgba(255,255,255,0.05)",
                      transition: { duration: 0.2 },
                    }}
                  >
                    <td className="py-2 px-4">{trade.MT5Account}</td>
                    <td className="py-1 px-4">{trade.Symbol}</td>
                    <td className="py-1 px-4">{trade.Open_Time}</td>
                    {activeTab === "closed" && (
                      <td className="py-1 px-4">{trade.Close_Time}</td>
                    )}
                    <td className="py-1 px-4">{trade.Open_Price}</td>
                    {activeTab === "closed" && (
                      <td className="py-1 px-4">{trade.Close_Price}</td>
                    )}
                    <td
                      className={`text-center py-1 px-4 ${
                        trade.OrderType === 0 || trade.BUY_SELL === 1
                          ? "text-red-500"
                          : "text-green-500"
                      }`}
                    >
                      {trade.OrderType !== undefined
                        ? trade.OrderType === 0
                          ? "Sell"
                          : "Buy"
                        : trade.BUY_SELL === 0
                        ? "Buy"
                        : "Sell"}
                    </td>
                    <td className="text-center py-1 px-4">
                      {activeTab === "closed"
                        ? trade.Lot
                        : trade.Volume / 10000}
                    </td>
                    <td
                      className={`text-left py-1 px-4 ${
                        trade.Profit >= 0 ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {trade.Profit?.toFixed(2)}
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
