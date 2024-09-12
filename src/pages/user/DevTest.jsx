import {
  setCurrentAccount,
  setOpenTrades,
  setProfitNloss,
} from "@/redux/user/userSlice";
import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";

export default function DevTest() {
  const dispatch = useDispatch();
  const currentAccount = useSelector((store) => store.user.currentAccount);
  console.log("cuurent ac--", currentAccount);
  const buttonHandler = async () => {
    // dispatch(setOpenTrades([]));
    const res = await axios.get(
      `${
        import.meta.env.VITE_API_END_POINT
      }/api/web/getOpenTradeByAccount?Manager_Index=1&MT5Accont=${currentAccount}`
    );
    console.log("dev$$$$$$$$$", res.data);
  };
  return (
    <div className=" flex justify-center mt-20 items-center flex-col">
      <div>
        <button
          onClick={buttonHandler}
          className=" px-5 py-2 bg-green-400 rounded "
        >
          Click me
        </button>
      </div>
    </div>
  );
}
