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
  setPlatforms,
  setProfitNloss,
  setSignUpData,
  setUserFormData,
  setUserInfo,
} from "@/redux/user/userSlice";
import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export default function UseUserHook() {
  const currentAccount = useSelector((store) => store.user.currentAccount);
  const dispatch = useDispatch();
  const currentDate = new Date().toISOString().slice(0, 10);
  const profitNloss = useSelector((store) => store.user.profitNloss);
  const phase = useSelector((store) => store.user.phase);
  const userInfo = useSelector((store) => store.user.userInfo);
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const availableBalance = useSelector((store) => store.user.availableBalance);

  const currentPnlRef = useRef(0);
  const [currentPnl, setCurrentPnl] = useState(0);

  const randomNumber = Math.floor(1000000 + Math.random() * 9000000).toString();

  console.log("initial pnl  ********", currentPnl);

  const setCurrentPnlAndRef = useCallback((newValue) => {
    currentPnlRef.current = newValue;
    setCurrentPnl(newValue);
  }, []);

  useEffect(() => {
    currentPnlRef.current = currentPnl;
  }, [currentPnl]);

  const GetUserInfoAPI = useCallback(async () => {
    // console.log("current pnl after update ********", currentPnlRef.current);

    try {
      if (loggedUser.phase !== 0) {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_END_POINT
          }/api/web/GetUserInfo?Manager_Index=1&MT5Account=${
            loggedUser.mt5Account
          }`
        );
        if (res.data.Balance > 0) {
          dispatch(setUserInfo(res.data));
          dispatch(setAvailableBalance(res.data.Balance));
          const newPnl = res.data.Balance - loggedUser.accountSize;
          setCurrentPnlAndRef(newPnl);
          dispatch(setProfitNloss(newPnl));
        }
      }
      if (currentAccount < 0) {
        console.log("undefined current ac--#####");
      }
    } catch (error) {
      console.log("error while userInfo hook--", error.data);
    }
  }, [loggedUser, currentAccount, dispatch, setCurrentPnlAndRef]);

  const getCurrentPnl = useCallback(() => {
    return currentPnlRef.current;
  }, []);

  const testProftNloss = currentPnlRef.current;

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

  // update phase ----------------

  const getUpdatePhase = useCallback(async () => {
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

    console.log("calculated min values---", phaseMinValueInNumber);
    console.log("calculated max values---", phaseMaxValueInNumber);
    console.log("current logged phase---", loggedUser.phase);
    // console.log("profit n loss#######---", profitNloss);
    console.log("phase update hook********", currentPnlRef.current);
    // console.log(
    //   " max reached ########---",
    //   currentPnlRef.current >= phaseMaxValueInNumber ? true : false
    // );
    console.log("current phase data---", currentPhaseData);
    if (
      currentPnlRef.current >= phaseMaxValueInNumber &&
      loggedUser.phase <= 2
    ) {
      const toastId = toast.loading("Updating phase..");
      try {
        console.log("Profit reached---------");

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
        const disableAccountRes = await axios.get(
          `${
            import.meta.env.VITE_API_END_POINT
          }/api/web/EnableProfileAccount?Manager_Index=1&MT5Account=${
            loggedUser.mt5Account
          }&Status=0`
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

        dispatch(setLoggedUser(updateLoggedUser.data.data));
        // await getUpdateLoggedUser();
        dispatch(setProfitNloss(""));
        dispatch(setAvailableBalance(""));
        // await GetUserInfoAPI();
        toast.success("Maximum profit reached", { id: toastId });

        const customContent = `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Withdrawal Request Confirmation - Arena Trade</title>
          <style>
            body, html {
              margin: 0;
              padding: 0;
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 5px;
              background-color: #ffffff;
            }
            .header {
              background-color: #19422df2;
              color: #ffffff;
              padding: 20px 15px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .header h1 {
              margin: 0;
              font-size: 22px;
              letter-spacing: 1px;
            }
            .content {
              padding: 10px 20px;
            }
            .cta-button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #2d6a4f;
              color: #FFFFFF;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 10px 0;
            }
            .footer {
              background-color: #19422df2;
              color: #ffffff;
              text-align: center;
              padding: 5px 10px;
              font-size: 12px;
              border-radius: 0 0 10px 10px;
            }
            .footer-info {
              margin-top: 6px;
            }
            .footer-info a {
              color: #B6D0E2;
              text-decoration: none;
            }
    
            .withdrawal-details {
              background-color: #f8f8f8;
              border-left: 4px solid #2d6a4f;
              padding: 15px;
              margin: 20px 0;
            }
            .withdrawal-details p {
              margin: 5px 0;
            }
            .highlight {
              font-weight: bold;
              color: #0a2342;
            }
            .risk-warning {
              color: #C70039;
              padding: 5px;
              font-size: 12px;
              line-height: 1.4;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Phase Updated</h1>
            </div>
            <div class="content">
              <p>Dear ${loggedUser?.firstName + " " + loggedUser?.lastName},</p>
<p>We regret to inform you that your account ID: <strong>${
          loggedUser.mt5Account
        }</strong> has been blocked due to reaching <strong> Maximum Profit Limit</strong> from phase <strong>${
          loggedUser.phase
        }</strong>.</p>
<br>
<p>We are pleased to inform you that a new account has been successfully opened with the following details given below</p>
            <div class="withdrawal-details">
              <p>Account No: <span class="highlight">${randomNumber}
                </span></p>
              <p>Phase : <span class="highlight">
              ${loggedUser.phase + 1}
                </span></p>
              <p>Master Password : <span class="highlight">
              ${addApiRes.data.Master_Pwd}
                </span></p>
              <p>Investor Password : <span class="highlight">
              ${addApiRes.data.Investor_Pwd}
                </span></p>
               
               
              </div>
    
        <p>Thank you for choosing us.</p>
        <p>Happy trading!</p>
    
              <p>Best regards,<br>The Arena Trade Team</p>
              <hr>
         <div class="risk-warning">
          <strong>Risk Warning:</strong> Trading CFDs carries high risk and may result in losses beyond your initial investment. Trade only with money you can afford to lose and understand the risks.
          <br><br>
          Arena Trade’s services are not for U.S. citizens or in jurisdictions where they violate local laws.
        </div>
    
            </div>
            <div class="footer">
              <div class="footer-info">
                <p>35-37, Ludgate Hill, London Post Box: EC4M7JN United Kingdom | P.O. Box 151</p>
                <p>Website: <a href="http://www.capitalstreetfx.com">www.capitalstreetfx.com</a> | E-mail: <a href="mailto:support@capitalstreetfx.com">support@capitalstreetfx.com</a></p>
                <p>WHATSAPP US: +760-7500-0197 | SKYPE US: dfhhgffdfdgfgx.support</p>
                <p>We sent out this message to all existing Alena Traders. Please visit this page to know more about our Privacy Policy.</p>
                <p>&copy; 2024 Arena Trade 2012-2021. All Rights Reserved</p>
              </div>
            </div>
          </div>
        </body>
        </html>`;

        const customMailRes = await axios.post(
          `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/custom-mail`,
          {
            email: loggedUser.email,
            content: customContent,
            subject: "Phase updated",
          }
        );
        window.location.reload();
      } catch (error) {
        toast.error("Something went wrong", { id: toastId });
        console.log("error in update phase--", error);
      }
    }
    if (
      currentPnlRef.current <= phaseMinValueInNumber &&
      loggedUser.phase <= 2
    ) {
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

        const disableAccountRes = await axios.get(
          `${
            import.meta.env.VITE_API_END_POINT
          }/api/web/EnableProfileAccount?Manager_Index=1&MT5Account=${
            loggedUser.mt5Account
          }&Status=0`
        );
        await getUpdateLoggedUser();
        // await GetUserInfoAPI();
        dispatch(setProfitNloss(""));
        toast.success("Maximum loss reached", { id: toastId });

        const customContent = `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Withdrawal Request Confirmation - Arena Trade</title>
          <style>
            body, html {
              margin: 0;
              padding: 0;
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 5px;
              background-color: #ffffff;
            }
            .header {
              background-color: #19422df2;
              color: #ffffff;
              padding: 20px 15px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .header h1 {
              margin: 0;
              font-size: 22px;
              letter-spacing: 1px;
            }
            .content {
              padding: 10px 20px;
            }
            .cta-button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #2d6a4f;
              color: #FFFFFF;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 10px 0;
            }
            .footer {
              background-color: #19422df2;
              color: #ffffff;
              text-align: center;
              padding: 5px 10px;
              font-size: 12px;
              border-radius: 0 0 10px 10px;
            }
            .footer-info {
              margin-top: 6px;
            }
            .footer-info a {
              color: #B6D0E2;
              text-decoration: none;
            }
    
            .withdrawal-details {
              background-color: #f8f8f8;
              border-left: 4px solid #2d6a4f;
              padding: 15px;
              margin: 20px 0;
            }
            .withdrawal-details p {
              margin: 5px 0;
            }
            .highlight {
              font-weight: bold;
              color: #0a2342;
            }
            .risk-warning {
              color: #C70039;
              padding: 5px;
              font-size: 12px;
              line-height: 1.4;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Phase Updated</h1>
            </div>
            <div class="content">
              <p>Dear ${loggedUser?.firstName + " " + loggedUser?.lastName},</p>
<p>We regret to inform you that your account ID: <strong>${
          loggedUser.mt5Account
        }</strong> has been blocked due to reaching <strong> Maximum Loss Limit</strong> from phase <strong>${
          loggedUser.phase
        }</strong>.</p>
<br>
<p>We are pleased to inform you that a new account has been successfully opened with the following details given below</p>
            <div class="withdrawal-details">
              <p>Account No: <span class="highlight">${randomNumber}
                </span></p>
              <p>Phase : <span class="highlight">
              ${loggedUser.phase + 1}
                </span></p>
              <p>Master Password : <span class="highlight">
              ${addApiRes.data.Master_Pwd}
                </span></p>
              <p>Investor Password : <span class="highlight">
              ${addApiRes.data.Investor_Pwd}
                </span></p>
               
               
              </div>
    
        <p>Thank you for choosing us.</p>
        <p>Happy trading!</p>
    
              <p>Best regards,<br>The Arena Trade Team</p>
              <hr>
         <div class="risk-warning">
          <strong>Risk Warning:</strong> Trading CFDs carries high risk and may result in losses beyond your initial investment. Trade only with money you can afford to lose and understand the risks.
          <br><br>
          Arena Trade’s services are not for U.S. citizens or in jurisdictions where they violate local laws.
        </div>
    
            </div>
            <div class="footer">
              <div class="footer-info">
                <p>35-37, Ludgate Hill, London Post Box: EC4M7JN United Kingdom | P.O. Box 151</p>
                <p>Website: <a href="http://www.capitalstreetfx.com">www.capitalstreetfx.com</a> | E-mail: <a href="mailto:support@capitalstreetfx.com">support@capitalstreetfx.com</a></p>
                <p>WHATSAPP US: +760-7500-0197 | SKYPE US: dfhhgffdfdgfgx.support</p>
                <p>We sent out this message to all existing Alena Traders. Please visit this page to know more about our Privacy Policy.</p>
                <p>&copy; 2024 Arena Trade 2012-2021. All Rights Reserved</p>
              </div>
            </div>
          </div>
        </body>
        </html>`;
        const customMailRes = await axios.post(
          `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/custom-mail`,
          {
            email: loggedUser.email,
            content: customContent,
            subject: "Phase updated",
          }
        );
        window.location.reload();
      } catch (error) {
        toast.error("Something went wrong", { id: toastId });
        console.log("error in update phase--", error);
      }
    }
  }, [loggedUser, currentAccount, dispatch, setCurrentPnl]);

  //   const getUpdatePhase = async () => {
  //     const phaseLimitValues = [
  //       {
  //         phase: 1,
  //         min: 5,
  //         max: 10,
  //       },
  //       {
  //         phase: 2,
  //         min: 10,
  //         max: 15,
  //       },
  //       {
  //         phase: 3,
  //         min: 15,
  //         max: 20,
  //       },
  //     ];

  //     const currentPhaseData = phaseLimitValues.find(
  //       (value) => value.phase === loggedUser.phase
  //     );

  //     const phaseMinValueInNumber =
  //       (currentPhaseData?.min / 100) * loggedUser.accountSize * -1;
  //     const phaseMaxValueInNumber =
  //       (currentPhaseData?.max / 100) * loggedUser.accountSize;

  //     console.log("calculated min values---", phaseMinValueInNumber);
  //     console.log("calculated max values---", phaseMaxValueInNumber);
  //     // console.log("profit n loss#######---", profitNloss);
  //     console.log("current pnl  22 ********", currentPnl);
  //     console.log(
  //       " max reached ########---",
  //       testProftNloss >= phaseMaxValueInNumber ? true : false
  //     );
  //     // console.log("current phase data---", currentPhaseData);
  //     if (testProftNloss >= phaseMaxValueInNumber) {
  //       const toastId = toast.loading("Updating phase..");
  //       try {
  //         console.log("Profit reached---------");

  //         const addApiRes = await axios.post(
  //           `${import.meta.env.VITE_API_END_POINT}/api/web/Adduser`,

  //           {
  //             Manager_Index: 1,
  //             MT5Account: randomNumber,
  //             Name: loggedUser.firstName + " " + loggedUser.lastName,
  //             Leverage: loggedUser.leverage,
  //             Country: loggedUser.country,
  //             Group_Name: "SK GROUP\\M10\\CLASSIC",
  //           }
  //         );
  //         const depositApires = await axios.get(
  //           `${
  //             import.meta.env.VITE_API_END_POINT
  //           }/api/web/MakeDepositBalance?Manager_Index=1&MT5Account=${randomNumber}&Amount=${
  //             loggedUser.accountSize
  //           }&Comment=TEST`
  //         );
  //         const updateChallengeDB = await axios.put(
  //           `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/update-challenge`,
  //           {
  //             mt5Account: loggedUser.mt5Account,
  //             status: "closed",
  //             reason: "Profit reached",
  //           }
  //         );
  //         const addChallengeDB = await axios.post(
  //           `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/add-challenge`,
  //           {
  //             mt5Account: randomNumber,
  //             type: loggedUser.accountType,
  //             accountSize: loggedUser.accountSize,
  //             deposit: loggedUser.depositBalance,
  //             phase: Number(loggedUser.phase) + 1,
  //             reason: "pending",
  //             status: "active",
  //             leverage: loggedUser.leverage,
  //             masterPassword: addApiRes.data.Master_Pwd,
  //             investarPassword: addApiRes.data.Investor_Pwd,
  //             userId: loggedUser._id,
  //           }
  //         );
  //         const disableAccountRes = await axios.get(
  //           `${
  //             import.meta.env.VITE_API_END_POINT
  //           }/api/web/EnableProfileAccount?Manager_Index=1&MT5Account=${
  //             loggedUser.mt5Account
  //           }&Status=0`
  //         );

  //         const updateLoggedUser = await axios.put(
  //           `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/update-user`,
  //           {
  //             id: loggedUser._id,
  //             phase: Number(loggedUser.phase) + 1,
  //             masterPassword: addApiRes.data.Master_Pwd,
  //             investorPassword: addApiRes.data.Investor_Pwd,
  //             mt5Account: randomNumber,
  //           }
  //         );

  //         dispatch(setLoggedUser(updateLoggedUser.data.data));
  //         // await getUpdateLoggedUser();
  //         dispatch(setProfitNloss(""));
  //         dispatch(setAvailableBalance(""));
  //         // await GetUserInfoAPI();
  //         toast.success("Maximum profit reached", { id: toastId });

  //         const customContent = `<!DOCTYPE html>
  //         <html lang="en">
  //         <head>
  //           <meta charset="UTF-8">
  //           <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //           <title>Withdrawal Request Confirmation - Arena Trade</title>
  //           <style>
  //             body, html {
  //               margin: 0;
  //               padding: 0;
  //               font-family: 'Arial', sans-serif;
  //               line-height: 1.6;
  //               color: #333;
  //               background-color: #f4f4f4;
  //             }
  //             .container {
  //               max-width: 600px;
  //               margin: 0 auto;
  //               padding: 5px;
  //               background-color: #ffffff;
  //             }
  //             .header {
  //               background-color: #19422df2;
  //               color: #ffffff;
  //               padding: 20px 15px;
  //               text-align: center;
  //               border-radius: 10px 10px 0 0;
  //             }
  //             .header h1 {
  //               margin: 0;
  //               font-size: 22px;
  //               letter-spacing: 1px;
  //             }
  //             .content {
  //               padding: 10px 20px;
  //             }
  //             .cta-button {
  //               display: inline-block;
  //               padding: 12px 24px;
  //               background-color: #2d6a4f;
  //               color: #FFFFFF;
  //               text-decoration: none;
  //               border-radius: 5px;
  //               font-weight: bold;
  //               margin: 10px 0;
  //             }
  //             .footer {
  //               background-color: #19422df2;
  //               color: #ffffff;
  //               text-align: center;
  //               padding: 5px 10px;
  //               font-size: 12px;
  //               border-radius: 0 0 10px 10px;
  //             }
  //             .footer-info {
  //               margin-top: 6px;
  //             }
  //             .footer-info a {
  //               color: #B6D0E2;
  //               text-decoration: none;
  //             }

  //             .withdrawal-details {
  //               background-color: #f8f8f8;
  //               border-left: 4px solid #2d6a4f;
  //               padding: 15px;
  //               margin: 20px 0;
  //             }
  //             .withdrawal-details p {
  //               margin: 5px 0;
  //             }
  //             .highlight {
  //               font-weight: bold;
  //               color: #0a2342;
  //             }
  //             .risk-warning {
  //               color: #C70039;
  //               padding: 5px;
  //               font-size: 12px;
  //               line-height: 1.4;
  //             }
  //           </style>
  //         </head>
  //         <body>
  //           <div class="container">
  //             <div class="header">
  //               <h1>Phase Updated</h1>
  //             </div>
  //             <div class="content">
  //               <p>Dear ${loggedUser?.firstName + " " + loggedUser?.lastName},</p>
  // <p>We regret to inform you that your account ID: <strong>${
  //           loggedUser.mt5Account
  //         }</strong> has been blocked due to reaching <strong> Maximum Profit Limit</strong> from phase <strong>${
  //           loggedUser.phase
  //         }</strong>.</p>
  // <br>
  // <p>We are pleased to inform you that a new account has been successfully opened with the following details given below</p>
  //             <div class="withdrawal-details">
  //               <p>Account No: <span class="highlight">${randomNumber}
  //                 </span></p>
  //               <p>Phase : <span class="highlight">
  //               ${loggedUser.phase + 1}
  //                 </span></p>
  //               <p>Master Password : <span class="highlight">
  //               ${addApiRes.data.Master_Pwd}
  //                 </span></p>
  //               <p>Investor Password : <span class="highlight">
  //               ${addApiRes.data.Investor_Pwd}
  //                 </span></p>

  //               </div>

  //         <p>Thank you for choosing us.</p>
  //         <p>Happy trading!</p>

  //               <p>Best regards,<br>The Arena Trade Team</p>
  //               <hr>
  //          <div class="risk-warning">
  //           <strong>Risk Warning:</strong> Trading CFDs carries high risk and may result in losses beyond your initial investment. Trade only with money you can afford to lose and understand the risks.
  //           <br><br>
  //           Arena Trade’s services are not for U.S. citizens or in jurisdictions where they violate local laws.
  //         </div>

  //             </div>
  //             <div class="footer">
  //               <div class="footer-info">
  //                 <p>35-37, Ludgate Hill, London Post Box: EC4M7JN United Kingdom | P.O. Box 151</p>
  //                 <p>Website: <a href="http://www.capitalstreetfx.com">www.capitalstreetfx.com</a> | E-mail: <a href="mailto:support@capitalstreetfx.com">support@capitalstreetfx.com</a></p>
  //                 <p>WHATSAPP US: +760-7500-0197 | SKYPE US: dfhhgffdfdgfgx.support</p>
  //                 <p>We sent out this message to all existing Alena Traders. Please visit this page to know more about our Privacy Policy.</p>
  //                 <p>&copy; 2024 Arena Trade 2012-2021. All Rights Reserved</p>
  //               </div>
  //             </div>
  //           </div>
  //         </body>
  //         </html>`;

  //         const customMailRes = await axios.post(
  //           `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/custom-mail`,
  //           {
  //             email: loggedUser.email,
  //             content: customContent,
  //             subject: "Phase updated",
  //           }
  //         );
  //         window.location.reload();
  //       } catch (error) {
  //         toast.error("Something went wrong", { id: toastId });
  //         console.log("error in update phase--", error);
  //       }
  //     }
  //     if (testProftNloss <= phaseMinValueInNumber && loggedUser.phase <= 2) {
  //       console.log("max loss reached**********");
  //       const toastId = toast.loading("Updating phase..");
  //       try {
  //         console.log("max Loss reached---------");

  //         const addApiRes = await axios.post(
  //           `${import.meta.env.VITE_API_END_POINT}/api/web/Adduser`,

  //           {
  //             Manager_Index: 1,
  //             MT5Account: randomNumber,
  //             Name: loggedUser.firstName + " " + loggedUser.lastName,
  //             Leverage: loggedUser.leverage,
  //             Country: loggedUser.country,
  //             Group_Name: "SK GROUP\\M10\\CLASSIC",
  //           }
  //         );
  //         const depositApires = await axios.get(
  //           `${
  //             import.meta.env.VITE_API_END_POINT
  //           }/api/web/MakeDepositBalance?Manager_Index=1&MT5Account=${randomNumber}&Amount=${
  //             loggedUser.accountSize
  //           }&Comment=TEST`
  //         );

  //         const updateChallengeDB = await axios.put(
  //           `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/update-challenge`,
  //           {
  //             mt5Account: loggedUser.mt5Account,
  //             status: "closed",
  //             reason: "Loss reached",
  //           }
  //         );

  //         const updateLoggedUser = await axios.put(
  //           `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/update-user`,
  //           {
  //             id: loggedUser._id,
  //             phase: Number(loggedUser.phase) + 1,
  //             masterPassword: addApiRes.data.Master_Pwd,
  //             investorPassword: addApiRes.data.Investor_Pwd,
  //             mt5Account: randomNumber,
  //           }
  //         );

  //         const disableAccountRes = await axios.get(
  //           `${
  //             import.meta.env.VITE_API_END_POINT
  //           }/api/web/EnableProfileAccount?Manager_Index=1&MT5Account=${
  //             loggedUser.mt5Account
  //           }&Status=0`
  //         );
  //         await getUpdateLoggedUser();
  //         // await GetUserInfoAPI();
  //         dispatch(setProfitNloss(""));
  //         toast.success("Maximum loss reached", { id: toastId });

  //         const customContent = `<!DOCTYPE html>
  //         <html lang="en">
  //         <head>
  //           <meta charset="UTF-8">
  //           <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //           <title>Withdrawal Request Confirmation - Arena Trade</title>
  //           <style>
  //             body, html {
  //               margin: 0;
  //               padding: 0;
  //               font-family: 'Arial', sans-serif;
  //               line-height: 1.6;
  //               color: #333;
  //               background-color: #f4f4f4;
  //             }
  //             .container {
  //               max-width: 600px;
  //               margin: 0 auto;
  //               padding: 5px;
  //               background-color: #ffffff;
  //             }
  //             .header {
  //               background-color: #19422df2;
  //               color: #ffffff;
  //               padding: 20px 15px;
  //               text-align: center;
  //               border-radius: 10px 10px 0 0;
  //             }
  //             .header h1 {
  //               margin: 0;
  //               font-size: 22px;
  //               letter-spacing: 1px;
  //             }
  //             .content {
  //               padding: 10px 20px;
  //             }
  //             .cta-button {
  //               display: inline-block;
  //               padding: 12px 24px;
  //               background-color: #2d6a4f;
  //               color: #FFFFFF;
  //               text-decoration: none;
  //               border-radius: 5px;
  //               font-weight: bold;
  //               margin: 10px 0;
  //             }
  //             .footer {
  //               background-color: #19422df2;
  //               color: #ffffff;
  //               text-align: center;
  //               padding: 5px 10px;
  //               font-size: 12px;
  //               border-radius: 0 0 10px 10px;
  //             }
  //             .footer-info {
  //               margin-top: 6px;
  //             }
  //             .footer-info a {
  //               color: #B6D0E2;
  //               text-decoration: none;
  //             }

  //             .withdrawal-details {
  //               background-color: #f8f8f8;
  //               border-left: 4px solid #2d6a4f;
  //               padding: 15px;
  //               margin: 20px 0;
  //             }
  //             .withdrawal-details p {
  //               margin: 5px 0;
  //             }
  //             .highlight {
  //               font-weight: bold;
  //               color: #0a2342;
  //             }
  //             .risk-warning {
  //               color: #C70039;
  //               padding: 5px;
  //               font-size: 12px;
  //               line-height: 1.4;
  //             }
  //           </style>
  //         </head>
  //         <body>
  //           <div class="container">
  //             <div class="header">
  //               <h1>Phase Updated</h1>
  //             </div>
  //             <div class="content">
  //               <p>Dear ${loggedUser?.firstName + " " + loggedUser?.lastName},</p>
  // <p>We regret to inform you that your account ID: <strong>${
  //           loggedUser.mt5Account
  //         }</strong> has been blocked due to reaching <strong> Maximum Loss Limit</strong> from phase <strong>${
  //           loggedUser.phase
  //         }</strong>.</p>
  // <br>
  // <p>We are pleased to inform you that a new account has been successfully opened with the following details given below</p>
  //             <div class="withdrawal-details">
  //               <p>Account No: <span class="highlight">${randomNumber}
  //                 </span></p>
  //               <p>Phase : <span class="highlight">
  //               ${loggedUser.phase + 1}
  //                 </span></p>
  //               <p>Master Password : <span class="highlight">
  //               ${addApiRes.data.Master_Pwd}
  //                 </span></p>
  //               <p>Investor Password : <span class="highlight">
  //               ${addApiRes.data.Investor_Pwd}
  //                 </span></p>

  //               </div>

  //         <p>Thank you for choosing us.</p>
  //         <p>Happy trading!</p>

  //               <p>Best regards,<br>The Arena Trade Team</p>
  //               <hr>
  //          <div class="risk-warning">
  //           <strong>Risk Warning:</strong> Trading CFDs carries high risk and may result in losses beyond your initial investment. Trade only with money you can afford to lose and understand the risks.
  //           <br><br>
  //           Arena Trade’s services are not for U.S. citizens or in jurisdictions where they violate local laws.
  //         </div>

  //             </div>
  //             <div class="footer">
  //               <div class="footer-info">
  //                 <p>35-37, Ludgate Hill, London Post Box: EC4M7JN United Kingdom | P.O. Box 151</p>
  //                 <p>Website: <a href="http://www.capitalstreetfx.com">www.capitalstreetfx.com</a> | E-mail: <a href="mailto:support@capitalstreetfx.com">support@capitalstreetfx.com</a></p>
  //                 <p>WHATSAPP US: +760-7500-0197 | SKYPE US: dfhhgffdfdgfgx.support</p>
  //                 <p>We sent out this message to all existing Alena Traders. Please visit this page to know more about our Privacy Policy.</p>
  //                 <p>&copy; 2024 Arena Trade 2012-2021. All Rights Reserved</p>
  //               </div>
  //             </div>
  //           </div>
  //         </body>
  //         </html>`;
  //         const customMailRes = await axios.post(
  //           `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/custom-mail`,
  //           {
  //             email: loggedUser.email,
  //             content: customContent,
  //             subject: "Phase updated",
  //           }
  //         );
  //         window.location.reload();
  //       } catch (error) {
  //         toast.error("Something went wrong", { id: toastId });
  //         console.log("error in update phase--", error);
  //       }
  //     }
  //   };

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
