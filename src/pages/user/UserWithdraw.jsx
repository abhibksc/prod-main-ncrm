import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  BadgeDollarSign,
  Loader2,
  LoaderPinwheelIcon,
  WalletCardsIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

import ModernHeading from "@/lib/ModernHeading";
import { backendApi, metaApi } from "@/utils/apiClients";

const UserWithdraw = () => {
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const [selectedGateway, setSelectedGateway] = useState("");
  const [selectWallet, setSelectWallet] = useState("USDT(Trc20)");
  const [account, selectAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [apiLoader, setApiLoader] = useState(false);
  const [error, setError] = useState("");
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [accountBalance, setAccountBalance] = useState("");
  const [accountType, setAccountType] = useState("");
  const siteConfig = useSelector((state) => state.user.siteConfig); // Get from Redux

  const currentDateTime = new Date();
  const formattedDateTime =
    currentDateTime.toLocaleDateString("en-GB") +
    ", " +
    currentDateTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // 12-hour format with AM/PM
    });
  // account info--

  const fetchAccountInfo = async () => {
    setBalanceLoading(true);
    try {
      setAccountBalance("");
      const res = await metaApi.get(
        `/GetUserInfo?Manager_Index=${
          import.meta.env.VITE_MANAGER_INDEX
        }&MT5Account=${account}`
      );
      setBalanceLoading(false);
      if (res.data.Equity) {
        setAccountBalance(res.data.Equity);
      }
    } catch (error) {
      console.log(error);
      setBalanceLoading(false);
    }
  };

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
          <h1>Withdrawal Requested</h1>
        </div>
        <div class="content">
          <p>Dear ${loggedUser.firstName + " " + loggedUser.lastName},</p>
  <p>  We have received your withdrawal request and are currently processing it. Our team is working diligently to verify your details, and you will be notified as soon as the verification is complete.</p>
        <div class="withdrawal-details">
          <p>Username: <span class="highlight">${loggedUser.email}</span></p>
          <p>Withdrawal Amount: <span class="highlight">${amount}</span></p>
          <p>Last Balance: <span class="highlight">${accountBalance}</span></p>
            <p>Processing time: <span class="highlight">${" 1-3 business days"}</span></p>
            <p>Updated Date: <span class="highlight">${formattedDateTime}</span></p>
          </div>
    
          <p>Thank you for choosing us.</p>
          <p>Happy trading!</p>
          
           <p>Best regards,<br>${import.meta.env.VITE_WEBSITE_NAME} Team</p>
          <hr>
     <div class="risk-warning">
      <strong>Risk Warning:</strong> Trading CFDs carries high risk and may result in losses beyond your initial investment. Trade only with money you can afford to lose and understand the risks.  
      <br><br>
      ${
        import.meta.env.VITE_WEBSITE_NAME
      } Trade’s services are not for U.S. citizens or in jurisdictions where they violate local laws.
    </div>
        
    
        </div>
      <div class="footer">
          <div class="footer-info">    
            <p>${import.meta.env.VITE_EMAIL_ADDRESS}</p>
            <p>Website: <a href=${import.meta.env.VITE_EMAIL_WEBSITE}>${
    import.meta.env.VITE_WEBSITE_NAME
  }</a> | E-mail: <a href="mailto:${import.meta.env.VITE_EMAIL_EMAIL}">${
    import.meta.env.VITE_EMAIL_EMAIL
  }</a></p>
            <p>We sent out this message to all existing traders. Please visit this page to know more about our Privacy Policy.</p>
            <p>&copy; 2024 ${
              import.meta.env.VITE_WEBSITE_NAME
            }. All Rights Reserved</p>
          </div>
        </div>
      </div>
    </body>
    </html>`;

  const withdrawalHandler = async (e) => {
    e.preventDefault();
    setError("");
    setApiLoader(true);
    try {
      if (accountBalance < amount) {
        setError("You don't have balance for withdrawal !!");
        setApiLoader(false);
      } else if (amount <= accountBalance && amount > 0) {
        const withdrawalDBres = await backendApi.post(`/withdrawal`, {
          method:
            selectedGateway === "Bank Transfer"
              ? selectedGateway
              : selectWallet,
          accountType: accountType,
          amount: amount,
          mt5Account: account,
          status: "pending",
          userId: loggedUser._id,
          lastBalance: accountBalance,
        });
        console.log(withdrawalDBres);
        const customMailRes = await backendApi.post(`/custom-mail`, {
          email: loggedUser.email,
          content: customContent,
          subject: "Withdrawal requested",
        });
        setApiLoader(false);
        toast.success("Withdrawal Requested.");
        fetchAccountInfo();
        setAmount("");
      } else {
        setError("Something went wrong!!");
        setApiLoader(false);
      }
    } catch (error) {
      setApiLoader(false);
      toast.error("Withdrawal Failed");
      console.log("error while withdraw", error);
    }
  };
  useEffect(() => {
    fetchAccountInfo();
  }, [account]);

  return (
    <div className="w-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className=" w-full bg-secondary-800/20 p-8 rounded-lg shadow-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div className=" mb-4">
            <ModernHeading text={"Withdraw Funds"}></ModernHeading>
          </div>
        </div>
        <form onSubmit={withdrawalHandler} className="space-y-6">
          <div className=" flex flex-col md:flex-row justify-between items-center gap-5">
            {/* select account */}
            <div className=" w-full">
              <label
                htmlFor="from-account"
                className="text-sm flex justify-between font-medium text-gray-200"
              >
                <p>Select Account</p>
                {balanceLoading ? (
                  <LoaderPinwheelIcon className=" animate-spin text-secondary-500"></LoaderPinwheelIcon>
                ) : (
                  accountBalance && (
                    <p className="px-4">
                      Balance :{" "}
                      <span className="bg-secondary-500-10 px-3 py-1 rounded-full text-secondary-500">
                        ${accountBalance}
                      </span>{" "}
                    </p>
                  )
                )}
              </label>
              <select
                id="from-account"
                onChange={(e) => {
                  selectAccount(e.target.value);
                  const selectedAccount = loggedUser?.accounts?.find(
                    (value) => value.accountNumber === e.target.value
                  );
                  setAccountType(selectedAccount?.accountType || ""); // Handle potential undefined value
                }}
                className="w-full px-4 py-2 mt-2 border bg-secondary-800/20 border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
              >
                <option
                  className="bg-secondary-800 text-white/30"
                  value=""
                  disabled
                  selected
                >
                  Select Account
                </option>
                {loggedUser?.accounts?.map((value, index) => (
                  <option
                    key={index}
                    className="bg-secondary-800 text-white"
                    value={value.accountNumber}
                  >
                    {value.accountNumber}
                  </option>
                ))}
              </select>
            </div>
            {/* Gateway Selection */}
            <div className="w-full space-y-4">
              <div className="w-full">
                <label
                  htmlFor="gateway"
                  className="block text-sm font-medium text-gray-200 mb-2"
                >
                  Withdrawal Method
                </label>
                <select
                  id="gateway"
                  value={selectedGateway}
                  onChange={(e) => setSelectedGateway(e.target.value)}
                  className="block w-full px-4 py-2 bg-secondary-800/20 text-gray-200 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                >
                  <option
                    selected
                    className=" bg-secondary-800 text-white/20"
                    value=""
                  >
                    select Method
                  </option>
                  <option
                    selected
                    className=" bg-secondary-800 text-white"
                    value="Bank Transfer"
                  >
                    Bank Transfer
                  </option>
                  <option
                    className=" bg-secondary-800 text-white"
                    value="Wallet Transfer"
                  >
                    Wallet Transfer
                  </option>
                </select>
              </div>

              {/* Conditional Wallet Selection */}
              {selectedGateway === "Wallet Transfer" && (
                <div className="w-full">
                  <label
                    htmlFor="account"
                    className="block text-sm font-medium text-gray-200 mb-2"
                  >
                    Choose Wallet
                  </label>
                  <select
                    id="account"
                    value={selectWallet}
                    onChange={(e) => setSelectWallet(e.target.value)}
                    className="block w-full px-4 py-2 bg-secondary-800/20 text-gray-200 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                  >
                    <option
                      className=" bg-secondary-800 text-white"
                      value="USDT(Trc20)"
                    >
                      USDT (Trc20)
                    </option>
                    <option
                      className=" bg-secondary-800 text-white"
                      value="USDT(Erc20)"
                    >
                      USDT (Erc20)
                    </option>
                    <option
                      className=" bg-secondary-800 text-white"
                      value="BinanceID"
                    >
                      Binance ID
                    </option>
                    <option
                      className=" bg-secondary-800 text-white"
                      value="BTCAddress"
                    >
                      BTC Address
                    </option>
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className=" flex flex-col md:flex-row justify-between items-center gap-10">
            {/* enter amount */}
            <div className="w-full">
              <div className=" w-full flex justify-between items-center">
                <label
                  htmlFor="amount"
                  className=" text-sm font-medium text-gray-200"
                >
                  Enter Amount
                </label>
                {siteConfig?.inrUi !== false ? (
                  <div className="flex mb-2 whitespace-nowrap gap-2 items-center">
                    <h1 className="text-sm font-bold text-gray-300">In INR:</h1>

                    <p className="bg-secondary-500-10 text-secondary-500 px-2 text-sm py-1 font-semibold rounded-full">
                      &#8377; {amount * siteConfig?.dollarWithdrawalRate}
                    </p>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="relative bg-secondary-800/20 rounded-md cursor-not-allowed">
                {/* Icon */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <BadgeDollarSign className="h-6 w-6 text-gray-400" />
                </div>
                {/* Input */}
                <input
                  type="number"
                  id="amount"
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full pl-10 py-3 bg-secondary-800/20 text-gray-200 border focus:ring-secondary-500  focus:ring-2 border-gray-700 rounded-md focus:outline-none placeholder-gray-500"
                  placeholder="Enter Amount"
                  value={amount}
                />
              </div>
            </div>
            {/* account details */}

            <div className=" w-full">
              {selectedGateway === "Bank Transfer" ? (
                <div>
                  <div className=" flex items-center gap-2 mb-3">
                    <WalletCardsIcon></WalletCardsIcon>
                    <h1 className=" text-lg font-bold">Account details</h1>
                  </div>
                  <div>
                    <p>
                      Bank Name :{" "}
                      <span className=" font-bold">
                        {loggedUser?.bankDetails?.bankName}{" "}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p>
                      Holder Name :{" "}
                      <span className=" font-bold">
                        {loggedUser?.bankDetails?.holderName}
                      </span>{" "}
                    </p>
                  </div>
                  <div>
                    <p>
                      Account Number :{" "}
                      <span className=" font-bold">
                        {loggedUser?.bankDetails?.accountNumber}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p>
                      IFSC Code :{" "}
                      <span className=" font-bold">
                        {loggedUser?.bankDetails?.ifscCode}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p>
                      Swift Code :{" "}
                      <span className=" font-bold">
                        {loggedUser?.bankDetails?.swiftCode}
                      </span>
                    </p>
                  </div>
                  <div>
                    <p>
                      UPI ID :{" "}
                      <span className=" font-bold">
                        {loggedUser?.bankDetails?.upiId}
                      </span>
                    </p>
                  </div>
                </div>
              ) : selectedGateway === "Wallet Transfer" ? (
                <div>
                  <div className=" flex items-center gap-2 mb-3">
                    <WalletCardsIcon></WalletCardsIcon>
                    <h1 className=" text-lg font-bold">Account details</h1>
                  </div>{" "}
                  {selectWallet === "USDT(Trc20)" && (
                    <div>
                      <p>
                        USDT-Trc20 :{" "}
                        <span className=" font-bold">
                          {loggedUser?.walletDetails?.tetherAddress}{" "}
                        </span>
                      </p>
                    </div>
                  )}
                  {selectWallet === "USDT(Erc20)" && (
                    <div>
                      <p>
                        USDT-Erc20 :{" "}
                        <span className=" font-bold">
                          {loggedUser?.walletDetails?.ethAddress}
                        </span>{" "}
                      </p>
                    </div>
                  )}
                  {selectWallet === "BinanceID" && (
                    <div>
                      <p>
                        Binance ID :
                        <span className=" font-bold">
                          {loggedUser?.walletDetails?.accountNumber}
                        </span>
                      </p>
                    </div>
                  )}
                  {selectWallet === "BTCAddress" && (
                    <div>
                      <p>
                        BTC Address :{" "}
                        <span className=" font-bold">
                          {loggedUser?.walletDetails?.trxAddress}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className=" flex items-center justify-center">
            <button
              onClick={withdrawalHandler}
              type="submit"
              className=" text-sm md:text-lg bg-secondary-500-80 flex px-12 py-3 shadow-md hover:bg-secondary-500-70 transition-all md:hover:px-16 rounded-full"
            >
              Request Withdrawal
              {apiLoader && <Loader2 className=" animate-spin mx-3"></Loader2>}
            </button>
          </div>
          {siteConfig?.inrUi !== false ? (
            <p className="text-xs mb-2 text-gray-500">
              USD to INR Rate:{" "}
              <span className="font-medium text-gray-400/80">
                ₹ {siteConfig?.dollarWithdrawalRate}
              </span>
            </p>
          ) : (
            ""
          )}

          <div className=" my-2 text-red-500 text-center">
            <p>{error}</p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UserWithdraw;
