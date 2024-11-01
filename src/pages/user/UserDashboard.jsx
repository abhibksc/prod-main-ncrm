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
import {
  setPhaseMaxLength,
  setPhaseStats,
  setProfitNloss,
} from "@/redux/user/userSlice";
import { useLocation } from "react-router-dom";
import TradingViewWidget from "@/components/user/dashboard/TradingViewWidget";

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
  const phaseMaxLength = useSelector((store) => store.user.phaseMaxLength);

  const isMax = phaseMaxLength === loggedUser.phase - 1;
  // const isOnLast = phaseMaxLength - 1 === phaseMaxLength - 1 ? true : false;
  console.log("is max dashboard ---", isMax);

  // console.log("isOnLast dashboard ----", isOnLast);

  // console.log("is max length__________", loggedUser.phase + 1);
  // console.log("is max__________", isMax);

  // for fetch logged user data-------------
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
    }, 6000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  // for update phase ---------------

  useEffect(() => {
    const fetchData = async () => {
      if (!isMax && loggedUser.phase !== 0) {
        await getUpdatePhase();
      }
    };

    if (!isMax && loggedUser.phase !== 0) {
      getUpdatePhase();
    }

    const intervalId = setInterval(() => {
      fetchData();
      console.log("getUpdatePhase");
    }, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, [loggedUser]);

  // group phase-------------
  useEffect(() => {
    let phaseLimitValues;

    if (loggedUser?.accountType === "Beta Standard") {
      phaseLimitValues = [
        { phase: 1, min: 10, max: 8 },
        { phase: 2, min: 10, max: 5 },
        { phase: 3, min: 10, max: Infinity },
      ];
    } else if (loggedUser?.accountType === "Beta Algo") {
      phaseLimitValues = [
        { phase: 1, min: 8, max: 10 },
        { phase: 2, min: 8, max: Infinity },
      ];
    } else {
      phaseLimitValues = [
        { phase: 1, min: 8, max: 10 },
        { phase: 2, min: 8, max: Infinity },
      ];
    }
    const currentPhaseData = phaseLimitValues.find(
      (value) => value.phase === loggedUser.phase
    );
    dispatch(setPhaseMaxLength(phaseLimitValues.length));
    dispatch(setPhaseStats(currentPhaseData));
  }, [loggedUser]);

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
          <TradingViewWidget></TradingViewWidget>
        </div>
        <div className=" flex md:ml-20 flex-col">
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
