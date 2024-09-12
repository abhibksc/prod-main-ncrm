import {
  setAvailableBalance,
  setCloseTrades,
  setOpenTrades,
  setUserInfo,
} from "@/redux/user/userSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
// -------------------
export default function UseUserHook() {
  const currentAccount = useSelector((store) => store.user.currentAccount);
  const isRefreshed = useSelector((store) => store.user.isRefreshed);
  const dispatch = useDispatch();
  const currentDate = new Date().toISOString().slice(0, 10);

  // close trade api --------------------

  const GetCloseTradeApi = async () => {
    try {
      // dispatch(setCloseTrades([]));

      const res = await axios.get(
        `${
          import.meta.env.VITE_API_END_POINT
        }/api/web/GetCloseTradeAll?Manager_Index=1&MT5Accont=${currentAccount}&StartTime=2021-07-20 00:00:00&EndTime=${currentDate} 23:59:59`
      );
      dispatch(setCloseTrades(res.data));
      console.log("closeTrade hook####--", res.data);
    } catch (error) {
      console.log("error while closeTrade hook--", error);
    }
  };

  // open trade api --------------------

  const GetOpenTradeApi = async () => {
    try {
      // dispatch(setOpenTrades([]));
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_END_POINT
        }/api/web/getOpenTradeByAccount?Manager_Index=1&MT5Accont=${currentAccount}`
      );
      console.log("openTrade hook--#####", res.data);
      dispatch(setOpenTrades(res.data));
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

  // user info api --------------------

  const GetUserInfoAPI = async () => {
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_API_END_POINT
        }/api/web/GetUserInfo?Manager_Index=1&MT5Account=9283987`
      );
      dispatch(setUserInfo(res.data));
      dispatch(setAvailableBalance(res.data.Balance));
      console.log("userInfo hook ####--", res.data);
    } catch (error) {
      console.log("error while userInfo hook--", error.data);
    }
  };

  return { GetOpenTradeApi, GetUserInfoAPI, GetCloseTradeApi, getAllTradeApi };
}
