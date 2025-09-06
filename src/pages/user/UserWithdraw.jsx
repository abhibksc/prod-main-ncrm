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
import { withdrawRequestMail } from "@/components/emails/WithdrwalsMails";
import OtpUi from "@/components/OtpUi";
import { KYCVerificationSection } from "./UserPlatform";
import UseUserHook from "@/hooks/user/UseUserHook";
import useUserWithdrawals from "@/hooks/user/UseUserWithdrawal";
import { PiUniteSquare } from "react-icons/pi";

const UserWithdraw = () => {
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const [selectedGateway, setSelectedGateway] = useState("Wallet Transfer");
  const [selectWallet, setSelectWallet] = useState("USDT(Trc20)");
  const [account, selectAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [apiLoader, setApiLoader] = useState(false);
  const [error, setError] = useState("");
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [accountBalance, setAccountBalance] = useState("");
  const [accountType, setAccountType] = useState("");
  const siteConfig = useSelector((state) => state.user.siteConfig); // Get from Redux
  const [isWithdrawing, setIsWithdrawing] = useState(false); // NEW: Added withdrawal loading state
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const { getUpdateLoggedUser } = UseUserHook();
  const { isWithdrawalPending, refresh } = useUserWithdrawals();
  const [selectedAccount, setSelecetdAccount] = useState({});
  const [netWithdrawalAmount, setNetWithdrawalAmount] =
    useState(accountBalance);
  const [uniqueWithdrawalRequestId, setUniqueWithdrawalRequestId] =
    useState("");
  // console.log("accountBalance", accountBalance);
  // console.log("netWithdrawalAmount", netWithdrawalAmount);

  useEffect(() => {
    if (selectedAccount?.lockInfo?.isLocked) {
      setNetWithdrawalAmount(
        +(
          parseFloat(accountBalance || 0) -
          parseFloat(selectedAccount.lockInfo.amount || 0)
        ).toFixed(2)
      );
    } else {
      setNetWithdrawalAmount(accountBalance);
    }
  }, [accountBalance]);
  // console.log("selectedAccount", selectedAccount);

  const fetchAccountInfo = async () => {
    setBalanceLoading(true);
    try {
      setAccountBalance("");
      const res = await backendApi.get(`id-info?accountNumber=${account}`);

      setBalanceLoading(false);
      if (res.data.Equity) {
        setAccountBalance(res.data.Equity);
      }
    } catch (error) {
      console.log(error);
      setBalanceLoading(false);
    }
  };

  const withdrawalHandler = async (e) => {
    e.preventDefault();

    if (isWithdrawing) return;
    if (amount < 10) {
      toast.error(
        "The minimum withdrawal amount is 10$, if the withdrawal is less than 10$ then fund loss may occur!!"
      );
      return;
    }

    if (isWithdrawalPending) {
      toast.error(
        "Your last withdrawal is still pending. Please wait until it is processed."
      );
      return;
    }
    if (amount > netWithdrawalAmount) {
      toast.error("You don't have sufficient funds for withdrawal");
      return;
    }

    // Validate inputs first
    if (!account || !selectedGateway || !amount) {
      setError("All fields are required.");
      return;
    }
    const toastId = toast.loading("please wait..");

    // Send OTP first
    try {
      const sendOtpRes = await backendApi.post("/send-otp", {
        email: loggedUser.email,
      });
      toast.success("OTP sent to your email", { id: toastId });
      setShowOtpInput(true); // open OTP input modal
    } catch (err) {
      console.log("OTP error", err);
      toast.error(
        `Failed to send OTP, ${
          err?.response?.data?.message || "Please try again later"
        } `,
        {
          id: toastId,
        }
      );
    }
  };

  // verify and submit---

  const verifyOtpHandler = async () => {
    const toastID = toast.loading("Verifying your request..");
    if (!otp) {
      toast.error("OTP required", { id: toastID });
      return;
    }

    setApiLoader(true);
    setIsWithdrawing(true);

    try {
      const res = await backendApi.post("/verify-otp", {
        email: loggedUser.email,
        otp,
        purpose: "withdrawal",
      });
      const verificationToken = res.data.verificationToken;

      // console.log(" verificationToken", verificationToken);

      // Proceed to withdrawal logic
      if (accountBalance < amount) {
        setError("You don't have balance for withdrawal !!");
        toast.error("You don't have balance for withdrawal !!", {
          id: toastID,
        });
      } else {
        await backendApi.post(`/withdrawal`, {
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
          verificationToken,
          uniqueWithdrawalRequestId,
        });

        const customContent = withdrawRequestMail({
          loggedUser,
          amount,
          accountBalance,
        });
        toast.success("Withdrawal Requested.", { id: toastID });
        fetchAccountInfo();
        setAmount("");
        refresh();

        await backendApi.post(`/custom-mail`, {
          email: loggedUser.email,
          content: customContent,
          subject: "Withdrawal requested",
        });
      }

      // Reset OTP state
      setShowOtpInput(false);
      setOtp("");
    } catch (error) {
      toast.error(error?.response?.data.message || "Withdrawal failed", {
        id: toastID,
      });
      console.log("error during withdrawal", error);
    } finally {
      setApiLoader(false);
      setIsWithdrawing(false);
    }
  };

  useEffect(() => {
    fetchAccountInfo();
  }, [account]);

  useEffect(() => {
    getUpdateLoggedUser();
  }, []);

  return loggedUser?.kycVerified ? (
    <div className="w-full mx-auto flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className=" w-full bg-secondary-800/20 p-4 md:p-8 rounded-lg shadow-xl"
      >
        {showOtpInput && (
          <OtpUi
            otp={otp}
            setOtp={setOtp}
            setShowOtpInput={setShowOtpInput}
            verifyOtpHandler={verifyOtpHandler}
            apiLoader={apiLoader}
          ></OtpUi>
        )}
        <div className="flex items-center justify-between mb-6">
          <div className=" mb-4">
            <ModernHeading text={"Withdraw Funds"}></ModernHeading>
          </div>
        </div>
        <form onSubmit={withdrawalHandler} className="space-y-6">
          <div className=" flex flex-col gap-4">
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
                  setSelecetdAccount(selectedAccount);
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
            {/* locked amount UI if it has  */}
            {selectedAccount?.lockInfo?.isLocked && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-amber-500/20 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-amber-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-amber-400">
                        Account Partially Locked
                      </h3>
                      <span className="px-2 py-1 text-xs bg-amber-500/20 text-amber-300 rounded-full">
                        Restricted
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="space-y-1">
                        <p className="text-gray-400">Locked Amount</p>
                        <p className="font-semibold text-amber-300">
                          ${selectedAccount.lockInfo.amount || "0.00"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-gray-400">
                          Available for Withdrawal
                        </p>
                        <p className="font-semibold text-green-400">
                          $
                          {(
                            parseFloat(accountBalance || 0) -
                            parseFloat(selectedAccount.lockInfo.amount || 0)
                          ).toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {selectedAccount.lockInfo.comment && (
                      <div className="mt-3 p-3 bg-secondary-800/30 rounded-md border-l-2 border-amber-500/50">
                        <p className="text-xs text-gray-400 mb-1">
                          Administrator Note:
                        </p>
                        <p className="text-sm text-gray-200 italic">
                          "{selectedAccount.lockInfo.comment}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
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
                  {/* <option
                    selected
                    className=" bg-secondary-800 text-white"
                    value="Bank Transfer"
                  >
                    Bank Transfer
                  </option> */}
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
                      value="USDT(Bep20)"
                    >
                      USDT (Bep20)
                    </option>
                    {/* <option
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
                    </option> */}
                  </select>
                </div>
              )}
            </div>
          </div>
          {/* amount input ---- */}
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
                  className="w-full pl-10 py-3 min-w-32 bg-secondary-800/20 text-gray-200 border focus:ring-secondary-500  focus:ring-2 border-gray-700 rounded-md focus:outline-none placeholder-gray-500"
                  placeholder="Enter Amount"
                  value={amount}
                />
              </div>
            </div>
            {/* account details */}

            <div className=" w-full break-words">
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
                        <span className=" font-bold  ">
                          {loggedUser?.walletDetails?.tetherAddress}{" "}
                        </span>
                      </p>
                    </div>
                  )}
                  {selectWallet === "USDT(Bep20)" && (
                    <div>
                      <p>
                        USDT-Bep20 :{" "}
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
          {/* uniqueTransactionId ---- */}
          <div className=" flex flex-col md:flex-row justify-between items-center gap-10">
            {/* enter amount */}
            <div className="w-full">
              <div className=" w-full flex justify-between items-center">
                <label
                  htmlFor="amount"
                  className=" text-sm font-medium text-gray-200"
                >
                  Unique Withdrawal Request ID (Required*)
                </label>
              </div>
              <div className="relative bg-secondary-800/20 rounded-md cursor-not-allowed">
                {/* Icon */}
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <PiUniteSquare className="h-6 w-6 text-gray-400" />
                </div>
                {/* Input */}
                <input
                  type="text"
                  id="uniqueWithdrawalRequestId"
                  onChange={(e) => setUniqueWithdrawalRequestId(e.target.value)}
                  className="w-full pl-10 py-3 min-w-32 bg-secondary-800/20 text-gray-200 border focus:ring-secondary-500  focus:ring-2 border-gray-700 rounded-md focus:outline-none placeholder-gray-500"
                  placeholder="Enter Unique Withdrawal Request ID"
                  value={uniqueWithdrawalRequestId}
                />
              </div>
            </div>
          </div>
          <div className=" flex items-center justify-center">
            <button
              onClick={withdrawalHandler}
              type="submit"
              disabled={isWithdrawing} // NEW: Disable button while withdrawing
              className={`text-sm md:text-lg flex px-12 py-3 shadow-md transition-all md:hover:px-16 rounded-full ${
                isWithdrawing
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-secondary-500-80 hover:bg-secondary-500-70"
              }`}
            >
              {isWithdrawing ? "Processing..." : "Request Withdrawal"}
              {(apiLoader || isWithdrawing) && (
                <Loader2 className="animate-spin mx-3" />
              )}
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
  ) : (
    <KYCVerificationSection></KYCVerificationSection>
  );
};

export default UserWithdraw;
