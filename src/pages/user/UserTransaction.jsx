import React, { useEffect, useState } from "react";
import { DollarSign, ArrowUpDownIcon } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import Loader from "@/components/Loader/Loader";
import { AnimatePresence, motion } from "framer-motion";
import { data } from "autoprefixer";

export default function UserTransaction() {
  const [activeTab, setActiveTab] = useState("withdrawal");
  const [transactionData, setTransactionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const loggedUser = useSelector((store) => store.user.loggedUser);

  const fetchTransactionData = async (tradeType = "withdrawal") => {
    setLoading(true);
    setError(null);
    try {
      let res;
      if (tradeType === "withdrawal") {
        res = await axios.get(
          `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/withdrawals`
        );
      }
      if (tradeType === "deposit") {
        res = await axios.get(
          `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/deposits`
        );
      }
      // console.log("privious data--", res.data.data);
      const filteredData = res.data.data.reverse().filter((value) => {
        return (
          value.userId &&
          value.userId._id &&
          value.userId._id === loggedUser._id
        );
      });
      console.log("filtered data--", filteredData);

      if (filteredData.length === 0) {
        setError(`No ${tradeType} data available.`);
        setTransactionData([]);
      } else {
        setTransactionData(filteredData);
      }
    } catch (error) {
      console.error(`Error fetching ${tradeType} data:`, error);
      setError(`Failed to fetch ${tradeType} data. Please try again.`);
      setTransactionData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tradeType) => {
    setActiveTab(tradeType);
    fetchTransactionData(tradeType);
  };

  // Formate date
  function formatDate(isoDateString) {
    const date = new Date(isoDateString);
    const formattedDate = date.toLocaleDateString("en-GB", {
      year: "numeric",
      day: "2-digit",
      month: "2-digit",
    });

    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });

    return `${formattedDate}, ${formattedTime}`;
  }

  useEffect(() => {
    fetchTransactionData(activeTab);
  }, [activeTab]);

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
      className="bg-secondary-800/10 pb-20 rounded-lg shadow-lg p-3 text-white overflow-hidden"
    >
      <motion.h1
        variants={itemVariants}
        className="mb-6 text-2xl font-bold flex items-center"
      >
        <ArrowUpDownIcon className="mr-2" />
        Transaction History
      </motion.h1>

      <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors ${
            activeTab === "deposit"
              ? "bg-yellow-600 text-white"
              : "bg-secondary-800 text-gray-300 hover:bg-secondary-700/50"
          }`}
          onClick={() => handleTabClick("deposit")}
        >
          Deposits
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`px-6 py-2 text-sm font-semibold rounded-full transition-colors ${
            activeTab === "withdrawal"
              ? "bg-green-700 text-white"
              : "bg-secondary-800 text-gray-300 hover:bg-secondary-700/50"
          }`}
          onClick={() => handleTabClick("withdrawal")}
        >
          Withdrawals
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

      {!loading && !error && transactionData.length > 0 && (
        <motion.div
          variants={tableVariants}
          initial="hidden"
          animate="visible"
          className="overflow-x-auto"
        >
          <table className="w-full text-sm overflow-y-hidden">
            <thead>
              <tr className="text-gray-400 border-b border-gray-700">
                <th className="text-center py-3 px-4 whitespace-nowrap">
                  Account No
                </th>
                <th className="text-center py-3 px-4 whitespace-nowrap">
                  Type
                </th>
                <th className="text-center py-3 px-4 whitespace-nowrap">
                  Phase
                </th>
                <th className="text-center py-3 px-4 whitespace-nowrap">
                  Deposit
                </th>
                <th className="text-center py-3 px-4 whitespace-nowrap">
                  Ac size
                </th>
                <th className="text-center py-3 px-4 whitespace-nowrap">
                  Requested on
                </th>
                <th className="text-center py-3 px-4 whitespace-nowrap">
                  Updated on
                </th>
                <th className="text-center py-3 px-4 whitespace-nowrap">
                  Status
                </th>
              </tr>
            </thead>
            <AnimatePresence>
              <motion.tbody variants={tableVariants}>
                {transactionData?.map((item, index) => (
                  <motion.tr
                    key={index}
                    variants={rowVariants}
                    className="border-b border-gray-700 hover:bg-secondary-800 transition-all"
                    whileHover={{
                      backgroundColor: "rgba(255,255,255,0.05)",
                      transition: { duration: 0.2 },
                    }}
                  >
                    <td className="py-2 px-4 text-center">
                      {item?.mt5Account}
                    </td>
                    <td className="py-2 px-4 text-center">
                      <motion.div
                        className="bg-cyan-100/20 rounded-full px-2 py-1 inline-block"
                        whileHover={{ scale: 1.05 }}
                      >
                        {item?.userId.accountType}
                      </motion.div>
                    </td>
                    <td className="py-2 px-4 text-center">
                      {activeTab === "withdrawal" ? item?.phase : "1"}
                    </td>
                    <td className="py-2 text-center">
                      {activeTab === "withdrawal"
                        ? item?.userId?.depositBalance
                        : item?.deposit}
                    </td>
                    <td className="py-2 px-4 text-center">
                      {item?.userId?.accountSize}
                    </td>
                    <td className="text-center py-2 px-3">
                      {formatDate(item?.createdAt)}
                    </td>
                    <td className="text-center py-2 px-3">
                      {formatDate(item?.updatedAt)}
                    </td>
                    <td className="text-center py-2 px-2">
                      <motion.div
                        className={`inline-block px-2 py-1 font-semibold rounded-full ${
                          item?.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : item?.status === "approved"
                            ? "bg-green-500/20 text-green-500"
                            : item?.status === "rejected"
                            ? "bg-red-400/20 text-red-500"
                            : ""
                        }`}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <p className="first-letter:capitalize">
                          {item?.status}
                        </p>
                      </motion.div>
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
