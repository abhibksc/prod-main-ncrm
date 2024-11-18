import { useEffect } from "react";
import { motion } from "framer-motion";
import UserDashboardAccount from "@/components/user/dashboard/UserDashboardAccount";
import UserDashboardAccountStats from "@/components/user/dashboard/UserDashboardAccountStats";
import UserDashboardBanner from "@/components/user/dashboard/UserDashboardBanner";
import UserDashboardCountdown from "@/components/user/dashboard/UserDashboardCountdown";
import UseUserHook from "@/hooks/user/UseUserHook";
import UserDashboardTrades from "@/components/user/dashboard/UserDashboardTrades";
import UserDashboardBalanceCards from "@/components/user/dashboard/UserDashboardCards";
import TradingViewWidget from "@/components/user/dashboard/TradingViewWidget";
import UsePhaseStats from "@/hooks/user/UsePhaseStats";
import VisitorHoursGraph from "@/components/user/graph/VisitorHoursGraph";
import VisitorChart from "@/components/user/graph/VisitorChart";
import VisitorsLineChart from "@/components/user/graph/VisitorsLineChart";

export default function UserDashboard() {
  const { GetUserInfoAPI, getUpdateLoggedUser, GetOpenTradeApi } =
    UseUserHook();
  const { updatePhaseStats } = UsePhaseStats();

  // for update logged data and userInfo-------------

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getUpdateLoggedUser();
        await GetUserInfoAPI();
        await GetOpenTradeApi();
      } catch (error) {
        console.error("Error in dashboard:", error);
      }
    };
    fetchData();
    // updatePhaseStats();
    const intervalId = setInterval(() => {
      fetchData();
    }, 4000);

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
      <motion.div
        className="grid grid-cols-1"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <UserDashboardBalanceCards></UserDashboardBalanceCards>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-2 grid-cols-1 items-center gap-5 justify-between my-5"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.0, delay: 0.0 }}
      >
        <div className="">
          {/* <UserLineChart /> */}
          {/* <TradingViewWidget></TradingViewWidget> */}{" "}
          <VisitorChart></VisitorChart>
        </div>
        <div className=" flex md:ml-20 flex-col">
          <UserDashboardAccount />
          {/* <VisitorHoursGraph></VisitorHoursGraph> */}
          {/* <VisitorHoursGraph></VisitorHoursGraph> */}
          {/* <VisitorChart></VisitorChart> */}
          {/* <VisitorsLineChart></VisitorsLineChart> */}
        </div>
      </motion.div>

      <motion.div
        className="grid md:grid-cols-2 grid-cols-1 justify-between my-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div>
          <UserDashboardAccountStats />
          <UserDashboardTrades></UserDashboardTrades>
        </div>
        <div className="flex flex-col gap-10 mt-10">
          <div>
            <UserDashboardBanner />
          </div>
          <div>
            <UserDashboardCountdown />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
