import { useEffect } from "react";
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

export default function UserDashboard() {
  const { GetUserInfoAPI, getAllTradeApi, getUpdatePhase } = UseUserHook();
  const openTrades = useSelector((store) => store.user.openTrades);
  const closeTrades = useSelector((store) => store.user.closeTrades);
  const dispatch = useDispatch();

  const allTrades = [...openTrades, ...closeTrades];

  const totalNetProfit = allTrades.reduce(
    (sum, entry) => sum + entry.Profit,
    0
  );

  dispatch(setProfitNloss(totalNetProfit));

  // console.log("calcilated net profit--", totalNetProfit);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await GetUserInfoAPI();
        await getAllTradeApi();
        await getUpdatePhase();
      } catch (error) {
        console.error("Error in useEffect:", error);
      }
    };

    fetchData();
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
