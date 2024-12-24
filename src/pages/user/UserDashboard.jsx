import { useEffect } from "react";
import { motion } from "framer-motion";
import UserDashboardAccount from "@/components/user/dashboard/UserDashboardAccount";
import UserDashboardBanner from "@/components/user/dashboard/UserDashboardBanner";
import UserDashboardTrades from "@/components/user/dashboard/UserDashboardTrades";
import UserDashboardBalanceCards from "@/components/user/dashboard/UserDashboardCards";
import TradingViewWidget from "@/components/user/dashboard/TradingViewWidget";

import UseUserHook from "@/hooks/user/UseUserHook";

export default function UserDashboard() {
  const { getUpdateLoggedUser } = UseUserHook();

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getUpdateLoggedUser();
      } catch (error) {
        console.error("Error in dashboard:", error);
      }
    };
    fetchData();
    const intervalId = setInterval(() => {
      fetchData();
    }, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <motion.div
      className="pb-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* 1st row  */}

      <motion.div
        className="grid grid-cols-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <UserDashboardBalanceCards></UserDashboardBalanceCards>
      </motion.div>
      {/* 2nd row */}
      <motion.div
        className="grid gap-6 md:grid-cols-2 grid-cols-1 items-center my-6 "
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="">
          <TradingViewWidget />
        </div>
        <div className="flex  justify-center items-center">
          <UserDashboardAccount />
        </div>
      </motion.div>
      {/* 3rd row  */}

      <motion.div
        className="grid md:grid-cols-2 grid-cols-1 my-4 gap-6 w-full"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <UserDashboardTrades></UserDashboardTrades>
        <UserDashboardBanner />
      </motion.div>
    </motion.div>
  );
}
