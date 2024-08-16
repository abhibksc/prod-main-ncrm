import { setProfitNloss, setUserInfo } from "@/redux/user/userSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// -------------------
export default function UseUserHook() {
  const currentAccount = useSelector((store) => store.user.currentAccount);
  const isRefreshed = useSelector((store) => store.user.isRefreshed);
  const dispatch = useDispatch();
  const currentDate = new Date().toISOString().slice(0, 10);

  const GetCloseTradeAPI = async () => {
    const res = await axios.get(
      `http://194.163.147.216//api/web/GetCloseTradeAll?Manager_Index=1&MT5Accont=${currentAccount}&StartTime=2021-07-20 00:00:00&EndTime=${currentDate} 23:59:59`
    );
    if (res.data.length === 0) {
      dispatch(setProfitNloss("000"));
    } else {
      dispatch(setProfitNloss(res.data[res.data.length - 1].Profit));
      // dispatch(setProfitNloss(200));
    }

    console.log("custom hook--", res.data[res.data.length - 1]);
  };
  const GetUserInfoAPI = async () => {
    const res = await axios.get(
      `http://194.163.147.216//api/web/GetUserInfo?Manager_Index=1&MT5Account=${currentAccount}`
    );
    dispatch(setUserInfo(res.data));

    console.log("custom hook userInfo--", res.data);
  };

  // useeffect---------
  // useEffect(() => {
  //   GetUserInfoAPI();
  // }, [isRefreshed]);

  return { GetCloseTradeAPI, GetUserInfoAPI };
}
