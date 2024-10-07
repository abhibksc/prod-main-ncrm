import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import UserDashboardAccount from "@/components/user/dashboard/UserDashboardAccount";
import UserDashboardAccountStats from "@/components/user/dashboard/UserDashboardAccountStats";
import UserDashboardBanner from "@/components/user/dashboard/UserDashboardBanner";
import UserDashboardCountdown from "@/components/user/dashboard/UserDashboardCountdown";
import UserLineChart from "@/components/user/UserLineChart";
import UseUserHook from "@/hooks/user/UseUserHook";
import UserDashboardTrades from "@/components/user/dashboard/UserDashboardTrades";
import UserDashboardBalanceCards from "@/components/user/dashboard/UserDashboardCards";
import { setProfitNloss } from "@/redux/user/userSlice";
import { useLocation } from "react-router-dom";

export default function UserDashboard() {
  const {
    GetUserInfoAPI,
    getUpdatePhase,
    getUpdateLoggedUser,
    GetOpenTradeApi,
  } = UseUserHook();
  const closeTrades = useSelector((store) => store.user.closeTrades);
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const dispatch = useDispatch();
  const profitNloss = useSelector((store) => store.user.profitNloss);

  // const allTrades = [...openTrades, ...closeTrades];

  // const totalNetProfit = allTrades.reduce(
  //   (sum, entry) => sum + entry.Profit,
  //   0
  // );

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

    const intervalId = setInterval(() => {
      fetchData();
      getUpdatePhase();
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    if (loggedUser.phase >= 2) {
      getUpdatePhase();
    }
  }, [profitNloss]);

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
        className="grid md:grid-cols-2 grid-cols-1 justify-between my-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.0, delay: 0.0 }}
      >
        <div className="">
          <UserLineChart />
        </div>
        <div className="md:ml-20">
          <UserDashboardAccount />
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
