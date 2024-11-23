import {
  setAvailableBalance,
  setCloseTrades,
  setDepositBalance,
  setLoggedUser,
  setOpenTrades,
  setPaymentMethods,
  setPlatforms,
  setProfitNloss,
  setUserInfo,
} from "@/redux/user/userSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

export default function UseUserHook() {
  const dispatch = useDispatch();
  const currentDate = new Date().toISOString().slice(0, 10);
  const loggedUser = useSelector((store) => store.user.loggedUser);

  // get user info api-----------------

  const GetUserInfoAPI = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_END_POINT}/GetUserInfo?Manager_Index=${
          import.meta.env.VITE_MANAGER_INDEX
        }&MT5Account=${loggedUser.mt5Account}`
      );
      if (res.data.Equity && loggedUser.accountSize) {
        dispatch(setUserInfo(res.data));
        dispatch(setAvailableBalance(Number(res.data.Equity)));
        const finalPnL = Number(res.data.Equity - loggedUser.accountSize);
        dispatch(setProfitNloss(finalPnL));
        // console.log("finalPnL:~~~~~~~~~~~~~~~~~~~~", finalPnL);
        // console.log("Account Size~~~~~~~~~~~~~~~~~~~~~~~~`:", accountSize);
      }
    } catch (error) {
      console.error("Error in GetUserInfoAPI:", error);
    }
  };

  const GetCloseTradeApi = async () => {
    try {
      if (loggedUser.phase !== 0) {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_END_POINT
          }/GetCloseTradeAll?Manager_Index=${
            import.meta.env.VITE_MANAGER_INDEX
          }&MT5Accont=${
            loggedUser.mt5Account
          }&StartTime=2021-07-20 00:00:00&EndTime=${currentDate} 23:59:59`
        );
        dispatch(setCloseTrades(res.data));
        console.log("closeTrade hook####--", res.data);
      } else {
        console.log("Account yet to open--xxx");
      }
    } catch (error) {
      console.log("error while closeTrade hook-xxxx", error);
    }
  };

  // open trade api --------------------

  const GetOpenTradeApi = async () => {
    try {
      if (loggedUser.phase !== 0) {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_END_POINT
          }/getOpenTradeByAccount?Manager_Index=${
            import.meta.env.VITE_MANAGER_INDEX
          }&MT5Accont=${loggedUser.mt5Account}`
        );

        dispatch(setOpenTrades(res.data));
      } else {
        console.log("Account yet to open--xxxx");
      }
    } catch (error) {
      console.log("error in openTrades hook", error);
    }
  };
  // all trade api --------------------

  const getAllTradeApi = async () => {
    try {
      await GetOpenTradeApi(); // Await the first call
      await GetCloseTradeApi(); // Await the second call
    } catch (error) {
      console.error("Error in getAllTradeApi:", error);
    }
  };

  // update logged user -----

  const getUpdateLoggedUser = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/get-user?id=${
          loggedUser._id
        }`
      );
      dispatch(setLoggedUser(res.data.data));
    } catch (error) {
      console.log("error in update logedUser hook", error);
    }
  };

  const getReset = () => {
    dispatch(setLoggedUser(""));
    dispatch(setUserInfo(""));
    dispatch(setDepositBalance(0));
    dispatch(setAvailableBalance(0));
    dispatch(setProfitNloss(0));
    dispatch(setOpenTrades([]));
    dispatch(setCloseTrades([]));
    dispatch(setPlatforms([]));
    dispatch(setPaymentMethods([]));
  };
  return {
    GetOpenTradeApi,
    GetUserInfoAPI,
    GetCloseTradeApi,
    getAllTradeApi,
    getUpdateLoggedUser,
    getReset,
  };
}
