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
  const dispatch = useDispatch();
  const currentDate = new Date().toISOString().slice(0, 10);
  const profitNloss = useSelector((store) => store.user.profitNloss);
  const phase = useSelector((store) => store.user.phase);
  const depositBalance = useSelector((store) => store.user.depositBalance);
  const userInfo = useSelector((store) => store.user.userInfo);
  const userFormData = useSelector((store) => store.user.userFormData);
  const investorPassword = useSelector((store) => store.user.investorPassword);
  const masterPassword = useSelector((store) => store.user.masterPasswoord);

  const randomNumber = Math.floor(1000000 + Math.random() * 9000000).toString();
  const ifHaveBalance = userInfo.Balance > 0 ? true : false;

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

  const phaseMinValueInNumber =
    (currentPhaseData?.min / 100) * depositBalance * -1;
  const phaseMaxValueInNumber = (currentPhaseData?.max / 100) * depositBalance;

  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  const testProftNloss = -50;

  console.log("calculated min values---", phaseMinValueInNumber);
  console.log("calculated max values---", phaseMaxValueInNumber);
  console.log("current phase data---", currentPhaseData);

  // close trade api --------------------

  const GetCloseTradeApi = async () => {
    try {
      if (ifHaveBalance) {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_END_POINT
          }/api/web/GetCloseTradeAll?Manager_Index=1&MT5Accont=${
            userInfo?.MT5Account
          }&StartTime=2021-07-20 00:00:00&EndTime=${currentDate} 23:59:59`
        );
        dispatch(setCloseTrades(res.data));
        console.log("closeTrade hook####--", res.data);
      } else {
        console.log("undifined current ac--#####");
      }
    } catch (error) {
      console.log("error while closeTrade hook--", error);
    }
  };

  // open trade api --------------------

  const GetOpenTradeApi = async () => {
    console.log("checkk ifHaveBalance @@@@@@", ifHaveBalance);
    try {
      if (ifHaveBalance) {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_END_POINT
          }/api/web/getOpenTradeByAccount?Manager_Index=1&MT5Accont=${
            userInfo?.MT5Account
          }`
        );
        console.log("openTrade hook--#####", res.data);
        dispatch(setOpenTrades(res.data));
      } else {
        console.log("undifined current ac--#####");
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

  // user info api --------------------

  const GetUserInfoAPI = async () => {
    console.log("GetUserInfoAPI current account ---", currentAccount);
    try {
      if (currentAccount > 0) {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_END_POINT
          }/api/web/GetUserInfo?Manager_Index=1&MT5Account=${currentAccount}`
        );
        dispatch(setUserInfo(res.data));
        dispatch(setAvailableBalance(res.data.Balance));
        console.log("userInfo hook ####--", res.data);
      }
      if (currentAccount < 0) {
        console.log("undifined current ac--#####");
      }
    } catch (error) {
      console.log("error while userInfo hook--", error.data);
    }
  };

  // update phase ----------------

  const getUpdatePhase = async () => {
    // console.log("form data@@@@@@@@@@@@@@@@@", userFormData);
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
        const updateChallengeDB = await axios.put(
          `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/update-challenge`,
          {
            mt5Account: currentAccount,
            status: "closed",
            reason: "Profit reached",
          }
        );

        const addApiRes = await axios.post(
          `${import.meta.env.VITE_API_END_POINT}/api/web/Adduser`,

          {
            Manager_Index: 1,
            MT5Account: randomNumber,
            Name: userFormData.firstName,
            lName: userFormData.lastName,
            Email: userFormData.email,
            Phone: userFormData.phone,
            Address: userFormData.address,
            City: userFormData.city,
            Country: userFormData.country,
            State: userFormData.state,
            Zip_Code: userFormData.zipCode,
            Leverage: userFormData.leverage,
            Group_Name: "SK GROUP\\M10\\CLASSIC",
          }
        );
        const depositApires = await axios.get(
          `${
            import.meta.env.VITE_API_END_POINT
          }/api/web/MakeDepositBalance?Manager_Index=1&MT5Account=${randomNumber}&Amount=${
            userFormData.accountBalance
          }&Comment=TEST`
        );

        const addChallengeDB = await axios.post(
          `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/add-challenge`,
          {
            mt5Account: randomNumber,
            type: userFormData.accountType,
            deposit: userFormData.accountBalance,
            balance: userInfo.Balance,
            accountSize: userFormData.accountSize,
            phase: phase + 1,
            reason: "pending",
            status: "active",
            leverage: userFormData.leverage,
            masterPassword: "000",
            investarPassword: "000",
          }
        );
        dispatch(setCurrentAccount(randomNumber));
        dispatch(setPhase(phase + 1));
        toast("Maximum profit reached");
        await GetUserInfoAPI();
        await getAllTradeApi();

        // console.log("update phase max data--", res);
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
        const updateChallengeDB = await axios.put(
          `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/update-challenge`,
          {
            mt5Account: currentAccount,
            status: "closed",
            reason: "Loss reached",
          }
        );
        const addApires = await axios.post(
          `${import.meta.env.VITE_API_END_POINT}/api/web/Adduser`,

          {
            Manager_Index: 1,
            MT5Account: randomNumber,
            Name: userFormData.firstName,
            lName: userFormData.lastName,
            Email: userFormData.email,
            Phone: userFormData.phone,
            Address: userFormData.address,
            City: userFormData.city,
            Country: userFormData.country,
            State: userFormData.state,
            Zip_Code: userFormData.zipCode,
            Leverage: userFormData.leverage,
            Group_Name: "SK GROUP\\M10\\CLASSIC",
          }
        );
        const depositApires = await axios.get(
          `${
            import.meta.env.VITE_API_END_POINT
          }/api/web/MakeDepositBalance?Manager_Index=1&MT5Account=${randomNumber}&Amount=${
            userFormData.accountBalance
          }&Comment=TEST`
        );
        const addChallengeDB = await axios.post(
          `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/add-challenge`,
          {
            mt5Account: randomNumber,
            type: userFormData.accountType,
            deposit: userFormData.accountBalance,
            balance: userInfo.Balance,
            accountSize: userFormData.accountSize,
            phase: phase + 1,
            reason: "pending",
            status: "active",
            leverage: userFormData.leverage,
            masterPassword: "000",
            investarPassword: "000",
          }
        );

        dispatch(setCurrentAccount(randomNumber));
        dispatch(setPhase(phase + 1));
        toast("Maximum loss reached");
        await GetUserInfoAPI();
        await getAllTradeApi();
        // console.log("update phase min data--", res);
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
