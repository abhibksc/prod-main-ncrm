import {
  setOpenTrades,
  setProfitNloss,
  setUserInfo,
} from "@/redux/user/userSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// -------------------
export default function UseUserHook() {
  const currentAccount = useSelector((store) => store.user.currentAccount);
  const isRefreshed = useSelector((store) => store.user.isRefreshed);
  const dispatch = useDispatch();

  const GetCloseTradeAPI = async () => {
    const res = await axios.get(
      `${
        import.meta.env.VITE_API_END_POINT
      }/api/web/GetOpenTradeByAccount?Manager_Index=1&MT5Accont=${currentAccount}`
    );
    dispatch(setOpenTrades(res.data));
    if (res.data.length === 0) {
      dispatch(setProfitNloss("0000"));
    } else {
      dispatch(setProfitNloss(res.data[res.data.length - 1].Profit));
      // dispatch(setProfitNloss(200));
    }

    console.log("custom hook open trade--", res.data.length);
  };
  const GetUserInfoAPI = async () => {
    const res = await axios.get(
      `${
        import.meta.env.VITE_API_END_POINT
      }/api/web/GetUserInfo?Manager_Index=1&MT5Account=${currentAccount}`
    );
    dispatch(setUserInfo(res.data));

    console.log("custom hook userInfo--", res.data);
  };

  return { GetCloseTradeAPI, GetUserInfoAPI };
}
