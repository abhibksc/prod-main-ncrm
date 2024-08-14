import { setProfitNloss } from "@/redux/user/userSlice";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
// -------------------
export default function UseUserHook() {
  const currentAccount = useSelector((store) => store.user.currentAccount);
  const dispatch = useDispatch();

  const GetCloseTradeAPI = async () => {
    const res = await axios.get(
      `http://194.163.147.216//api/web/GetCloseTradeAll?Manager_Index=1&MT5Accont=${currentAccount}&StartTime=2021-07-20 00:00:00&EndTime=2024-08-14 23:59:59`
    );
    if ((res.data, length === 0)) {
      dispatch(setProfitNloss("000"));
    } else {
      dispatch(setProfitNloss("201"));
    }

    console.log("custom hook--", res);
  };

  return { GetCloseTradeAPI };
}
