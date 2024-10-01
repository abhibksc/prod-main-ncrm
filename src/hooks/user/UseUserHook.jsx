import {
  setAvailableBalance,
  setCloseTrades,
  setCurrentAccount,
  setCurrentUser,
  setDepositBalance,
  setInvestorPassword,
  setLoggedUser,
  setMasterPassword,
  setOpenTrades,
  setPaymentMethods,
  setPhase,
  setPlatforms,
  setProfitNloss,
  setSignUpData,
  setUserFormData,
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
  const userInfo = useSelector((store) => store.user.userInfo);
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const availableBalance = useSelector((store) => store.user.availableBalance);

  const randomNumber = Math.floor(1000000 + Math.random() * 9000000).toString();
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
    (value) => value.phase === loggedUser.phase
  );

  const phaseMinValueInNumber =
    (currentPhaseData?.min / 100) * loggedUser.accountSize * -1;
  const phaseMaxValueInNumber =
    (currentPhaseData?.max / 100) * loggedUser.accountSize;

  // @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
  const testProftNloss = profitNloss;

  console.log("calculated min values---", phaseMinValueInNumber);
  console.log("calculated max values---", phaseMaxValueInNumber);
  console.log("current phase data---", currentPhaseData);

  // close trade api --------------------

  const GetCloseTradeApi = async () => {
    try {
      if (loggedUser.phase !== 0) {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_END_POINT
          }/api/web/GetCloseTradeAll?Manager_Index=1&MT5Accont=${
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
          }/api/web/getOpenTradeByAccount?Manager_Index=1&MT5Accont=${
            loggedUser.mt5Account
          }`
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

  // user info api --------------------

  const GetUserInfoAPI = async () => {
    try {
      if (loggedUser.phase !== 0) {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_END_POINT
          }/api/web/GetUserInfo?Manager_Index=1&MT5Account=${
            loggedUser.mt5Account
          }`
        );
        dispatch(setUserInfo(res.data));
        dispatch(setAvailableBalance(res.data.Balance));
        dispatch(setProfitNloss(res.data.Balance - loggedUser.accountSize));

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
    if (testProftNloss >= phaseMaxValueInNumber && loggedUser.phase !== 3) {
      const toastId = toast.loading("Updating phase..");
      try {
        console.log("max profit reached---------");

        const addApiRes = await axios.post(
          `${import.meta.env.VITE_API_END_POINT}/api/web/Adduser`,

          {
            Manager_Index: 1,
            MT5Account: randomNumber,
            Name: loggedUser.firstName + " " + loggedUser.lastName,
            Leverage: loggedUser.leverage,
            Country: loggedUser.country,
            Group_Name: "SK GROUP\\M10\\CLASSIC",
          }
        );
        const depositApires = await axios.get(
          `${
            import.meta.env.VITE_API_END_POINT
          }/api/web/MakeDepositBalance?Manager_Index=1&MT5Account=${randomNumber}&Amount=${
            loggedUser.accountSize
          }&Comment=TEST`
        );
        const updateChallengeDB = await axios.put(
          `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/update-challenge`,
          {
            mt5Account: loggedUser.mt5Account,
            status: "closed",
            reason: "Profit reached",
          }
        );
        const addChallengeDB = await axios.post(
          `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/add-challenge`,
          {
            mt5Account: randomNumber,
            type: loggedUser.accountType,
            accountSize: loggedUser.accountSize,
            deposit: loggedUser.depositBalance,
            phase: Number(loggedUser.phase) + 1,
            reason: "pending",
            status: "active",
            leverage: loggedUser.leverage,
            masterPassword: addApiRes.data.Master_Pwd,
            investarPassword: addApiRes.data.Investor_Pwd,
            userId: loggedUser._id,
          }
        );

        const updateLoggedUser = await axios.put(
          `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/update-user`,
          {
            id: loggedUser._id,
            phase: Number(loggedUser.phase) + 1,
            masterPassword: addApiRes.data.Master_Pwd,
            investorPassword: addApiRes.data.Investor_Pwd,
            mt5Account: randomNumber,
          }
        );
        await axios.get(
          `${
            import.meta.env.VITE_API_END_POINT
          }/api/web/EnableProfileAccount?Manager_Index=1&MT5Account=${
            loggedUser.mt5Account
          }&Status=0`
        );

        await GetUserInfoAPI();
        await getUpdateLoggedUser();
        toast.success("Phase updated", { id: toastId });
        toast("Maximum profit reached");
      } catch (error) {
        toast.error("Something went wrong", { id: toastId });
        console.log("error in update phase--", error);
      }
    }
    if (testProftNloss <= phaseMinValueInNumber && phase !== 3) {
      console.log("max loss reached**********");
      const toastId = toast.loading("Updating phase..");
      try {
        console.log("max Loss reached---------");

        const addApiRes = await axios.post(
          `${import.meta.env.VITE_API_END_POINT}/api/web/Adduser`,

          {
            Manager_Index: 1,
            MT5Account: randomNumber,
            Name: loggedUser.firstName + " " + loggedUser.lastName,
            Leverage: loggedUser.leverage,
            Country: loggedUser.country,
            Group_Name: "SK GROUP\\M10\\CLASSIC",
          }
        );
        const depositApires = await axios.get(
          `${
            import.meta.env.VITE_API_END_POINT
          }/api/web/MakeDepositBalance?Manager_Index=1&MT5Account=${randomNumber}&Amount=${
            loggedUser.accountSize
          }&Comment=TEST`
        );

        const updateChallengeDB = await axios.put(
          `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/update-challenge`,
          {
            mt5Account: loggedUser.mt5Account,
            status: "closed",
            reason: "Loss reached",
          }
        );

        const updateLoggedUser = await axios.put(
          `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/update-user`,
          {
            id: loggedUser._id,
            phase: Number(loggedUser.phase) + 1,
            masterPassword: addApiRes.data.Master_Pwd,
            investorPassword: addApiRes.data.Investor_Pwd,
            mt5Account: randomNumber,
          }
        );

        await axios.get(
          `${
            import.meta.env.VITE_API_END_POINT
          }/api/web/EnableProfileAccount?Manager_Index=1&MT5Account=${
            loggedUser.mt5Account
          }&Status=0`
        );

        await GetUserInfoAPI();
        await getUpdateLoggedUser();
        toast.success("Phase updated", { id: toastId });
        toast("Maximum loss reached");
      } catch (error) {
        toast.error("Something went wrong", { id: toastId });
        console.log("error in update phase--", error);
      }
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
      // console.log("res logged user hook ---", res.data.data);
      dispatch(setLoggedUser(res.data.data));
    } catch (error) {
      console.log("error in update logedUser hook", error);
    }
  };

  // reset all details --------------

  const getReset = () => {
    dispatch(setLoggedUser(""));
    dispatch(setCurrentAccount(""));
    dispatch(setCurrentUser(""));
    dispatch(setDepositBalance(""));
    dispatch(setAvailableBalance(""));
    dispatch(setUserInfo(""));
    dispatch(setLoggedUser(""));
    dispatch(setInvestorPassword(""));
    dispatch(setMasterPassword(""));
    dispatch(setOpenTrades([]));
    dispatch(setCloseTrades([]));
    dispatch(setPlatforms([]));
    dispatch(setPaymentMethods([]));
    dispatch(setUserFormData(""));
    dispatch(setSignUpData(""));
    dispatch(setProfitNloss(""));
    // navigate("/user/login");
  };
  return {
    GetOpenTradeApi,
    GetUserInfoAPI,
    GetCloseTradeApi,
    getAllTradeApi,
    getUpdatePhase,
    getUpdateLoggedUser,
    getReset,
  };
}
