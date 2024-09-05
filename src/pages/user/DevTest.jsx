import { setOpenTrades, setProfitNloss } from "@/redux/user/userSlice";
import React from "react";
import { useDispatch } from "react-redux";

export default function DevTest() {
  const dispatch = useDispatch();
  const buttonHandler = () => {
    dispatch(setOpenTrades([]));
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
