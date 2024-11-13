import { useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import UserDashboardAccount from "@/components/user/dashboard/UserDashboardAccount";
import UserDashboardAccountStats from "@/components/user/dashboard/UserDashboardAccountStats";
import UserDashboardBanner from "@/components/user/dashboard/UserDashboardBanner";
import UserDashboardCountdown from "@/components/user/dashboard/UserDashboardCountdown";
import UseUserHook from "@/hooks/user/UseUserHook";
import UserDashboardTrades from "@/components/user/dashboard/UserDashboardTrades";
import UserDashboardBalanceCards from "@/components/user/dashboard/UserDashboardCards";
import { setPhaseMaxLength, setPhaseStats } from "@/redux/user/userSlice";
import TradingViewWidget from "@/components/user/dashboard/TradingViewWidget";
import axios from "axios";
import UsePhaseStats from "@/hooks/user/UsePhaseStats";
import VisitorHoursGraph from "@/components/user/graph/VisitorHoursGraph";
import VisitorChart from "@/components/user/graph/VisitorChart";
import VisitorsLineChart from "@/components/user/graph/VisitorsLineChart";

export default function UserDashboard() {
  const {
    GetUserInfoAPI,
    getUpdatePhase,
    getUpdateLoggedUser,
    GetOpenTradeApi,
  } = UseUserHook();
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const dispatch = useDispatch();
  const phaseMaxLength = useSelector((store) => store.user.phaseMaxLength);
  const { updatePhaseStats } = UsePhaseStats();
  const phaseStats = useSelector((store) => store.user.phaseStats);

  const isMax = phaseMaxLength === loggedUser.phase - 1;

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
    const intervalId = setInterval(() => {
      fetchData();
    }, 4000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // phases data old way------

  // useEffect(() => {
  //   let phaseLimitValues;

  //   if (loggedUser?.accountType === "Beta Standard") {
  //     phaseLimitValues = [
  //       { phase: 1, min: 10, max: 8 },
  //       { phase: 2, min: 10, max: 5 },
  //       { phase: 3, min: 10, max: Infinity },
  //     ];
  //   } else if (loggedUser?.accountType === "Beta Algo") {
  //     phaseLimitValues = [
  //       { phase: 1, min: 8, max: 10 },
  //       { phase: 2, min: 8, max: Infinity },
  //     ];
  //   } else {
  //     phaseLimitValues = [
  //       { phase: 1, min: 8, max: 10 },
  //       { phase: 2, min: 8, max: Infinity },
  //     ];
  //   }
  //   const currentPhaseData = phaseLimitValues.find(
  //     (value) => value.phase === loggedUser.phase
  //   );
  //   dispatch(setPhaseMaxLength(phaseLimitValues.length));
  //   dispatch(setPhaseStats(currentPhaseData));
  // }, [loggedUser]);

  // // group phase new way -------------

  // useEffect(() => {
  //   const fetchPhases = async () => {
  //     try {
  //       const res = await axios.get(
  //         `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/get-phases`
  //       );

  //       const filterallPhaseData = res.data.data
  //         .map((value) => ({
  //           ...value,
  //           maxProfit: value.maxProfit === 0 ? Infinity : value.maxProfit,
  //         }))
  //         .filter((value) => value.accountType === loggedUser.accountType);

  //       const filterCurrentPhaseData = filterallPhaseData.filter(
  //         (value) => value.phase === loggedUser.phase
  //       )[0];
  //       const currentPhaseData = {
  //         phase: filterCurrentPhaseData.phase,
  //         min: filterCurrentPhaseData.maxOverallLoss,
  //         max: filterCurrentPhaseData.maxProfit,
  //       };
  //       console.log(
  //         "filter current phase data_________________________________",
  //         currentPhaseData
  //       );
  //       dispatch(setPhaseMaxLength(filterallPhaseData.length));
  //       dispatch(setPhaseStats(currentPhaseData));
  //     } catch (error) {
  //       console.log("Error fetching existing phases data", error);
  //     }
  //   };
  //   fetchPhases();
  // }, [loggedUser.phase]);

  // for update phase ---------------

  // useEffect(() => {
  //   const fetchData = async () => {
  //     if (!isMax && loggedUser.phase !== 0 && phaseStats) {
  //       // await getUpdatePhase();
  //     }
  //   };

  //   if (!isMax && loggedUser.phase !== 0 && phaseStats) {
  //     // getUpdatePhase();
  //     updatePhaseStats(); // for update phase stats---
  //   }

  //   const intervalId = setInterval(() => {
  //     fetchData();
  //   }, 10000);

  //   return () => {
  //     clearInterval(intervalId);
  //   };
  // }, [loggedUser]);

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
