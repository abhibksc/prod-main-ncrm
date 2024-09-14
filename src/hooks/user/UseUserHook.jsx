import {
  setAvailableBalance,
  setCloseTrades,
  setCurrentAccount,
  setOpenTrades,
  setPhase,
  setUserInfo,
} from "@/redux/user/userSlice";
import axios from "axios";
import toast from "react-hot-toast";
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
        }/api/web/GetUserInfo?Manager_Index=1&MT5Account=${currentAccount}`
      );
      dispatch(setUserInfo(res.data));
      dispatch(setAvailableBalance(res.data.Balance));
      console.log("userInfo hook ####--", res.data);
    } catch (error) {
      console.log("error while userInfo hook--", error.data);
    }
  };

  // update phase ----------------

  const profitNloss = useSelector((store) => store.user.profitNloss);
  const phase = useSelector((store) => store.user.phase);
  const depositBalance = useSelector((store) => store.user.depositBalance);
  const userInfo = useSelector((store) => store.user.userInfo);

  console.log("phase--", phase);
  const phaseLimitValues = [
    {
      phase: 1,
      min: 5,
      max: 10,
    },
    {
      phase: 2,
      min: 10,
      max: 15,
    },
    {
      phase: 3,
      min: 15,
      max: 20,
    },
  ];

  const currentPhaseData = phaseLimitValues.find(
    (value) => value.phase === phase
  );
  // console.log("currentPhase--", currentPhaseData);

  const phaseMinValueInNumber =
    (currentPhaseData.min / 100) * depositBalance * -1;
  const phaseMaxValueInNumber = (currentPhaseData.max / 100) * depositBalance;

  console.log("calculated min values---", phaseMinValueInNumber);
  console.log("calculated max values---", phaseMaxValueInNumber);
  console.log("current phase data---", currentPhaseData);

  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  const testProftNloss = 3751;

  const randomNumber = Math.floor(1000000 + Math.random() * 9000000).toString();

  const getUpdatePhase = async () => {
    if (testProftNloss >= phaseMaxValueInNumber && phase !== 3) {
      console.log("max profit reached**********");

      try {
        await axios.get(
          `${
            import.meta.env.VITE_API_END_POINT
          }/api/web/EnableProfileAccount?Manager_Index=1&MT5Account=${
            userInfo.MT5Account
          }&Status=0`
        );
        const res = await axios.post(
          `${import.meta.env.VITE_API_END_POINT}/api/web/Adduser`,

          {
            Manager_Index: 1,
            MT5Account: randomNumber,
            Name: "testa1",
            lName: "tt",
            Email: "testa1@gamil.com",
            Phone: "123456",
            Address: "delhi",
            City: "delhi",
            Country: "In",
            State: "delhi",
            Zip_Code: "284303",
            Leverage: "100",
            Group_Name: "SK GROUP\\M10\\CLASSIC",
          }
        );
        dispatch(setCurrentAccount(randomNumber));
        dispatch(setPhase(phase + 1));
        getAllTradeApi();
        GetUserInfoAPI();
        toast("Maximum profit reached");

        console.log("update phase max data--", res);
      } catch (error) {
        console.log("error in update phase--", error);
      }
    }
    if (testProftNloss <= phaseMinValueInNumber && phase !== 3) {
      console.log("max loss reached**********");
      try {
        await axios.get(
          `${
            import.meta.env.VITE_API_END_POINT
          }/api/web/EnableProfileAccount?Manager_Index=1&MT5Account=${
            userInfo.MT5Account
          }&Status=0`
        );
        const res = await axios.post(
          `${import.meta.env.VITE_API_END_POINT}/api/web/Adduser`,

          {
            Manager_Index: 1,
            MT5Account: randomNumber,
            Name: "testa1",
            lName: "tt",
            Email: "testa1@gamil.com",
            Phone: "123456",
            Address: "delhi",
            City: "delhi",
            Country: "In",
            State: "delhi",
            Zip_Code: "284303",
            Leverage: "100",
            Group_Name: "SK GROUP\\M10\\CLASSIC",
          }
        );

        dispatch(setCurrentAccount(randomNumber));
        dispatch(setPhase(phase + 1));
        GetUserInfoAPI();
        getAllTradeApi();
        toast("Maximum loss reached");
        console.log("update phase min data--", res);
      } catch (error) {
        console.log("error in update phase--", error);
      }
    }
  };

  return {
    GetOpenTradeApi,
    GetUserInfoAPI,
    GetCloseTradeApi,
    getAllTradeApi,
    getUpdatePhase,
  };
}
