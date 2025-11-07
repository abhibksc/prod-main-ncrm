import { useEffect, useMemo, useState } from "react";
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
import UseUserHook from "@/hooks/user/UseUserHook";

// Small helper for wallet meta mapping
const WALLET_META = {
  "USDT(Trc20)": {
    field: "tetherAddress",
    label: "USDT (TRC20) address",
    placeholder: "Enter USDT (TRC20) address",
  },
  BITCOIN: {
    field: "ethAddress", // matches your "Bitcoin" input in UserWalletDetails
    label: "Bitcoin address",
    placeholder: "Enter Bitcoin address",
  },
  "USDT(BEP20)": {
    field: "bep20Address",
    label: "USDT (BEP20) address",
    placeholder: "Enter USDT (BEP20) address",
  },
};

const UserWithdraw = () => {
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const siteConfig = useSelector((state) => state.user.siteConfig);

  const [selectedGateway, setSelectedGateway] = useState("");
  const [selectWallet, setSelectWallet] = useState("USDT(BEP20)"); // default aligns with option value casing
  const [account, selectAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [apiLoader, setApiLoader] = useState(false);
  const [error, setError] = useState("");
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [accountBalance, setAccountBalance] = useState("");
  const [accountType, setAccountType] = useState("");
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");

  // Modal for adding/updating selected wallet address
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [walletAddressInput, setWalletAddressInput] = useState("");

  const { getUpdateLoggedUser } = UseUserHook();

  const walletMeta = useMemo(() => WALLET_META[selectWallet] || null, [selectWallet]);

  const currentWalletAddress = useMemo(() => {
    if (!walletMeta) return "";
    return loggedUser?.walletDetails?.[walletMeta.field] || "";
  }, [loggedUser, walletMeta]);

  const fetchAccountInfo = async () => {
    if (!account) return;
    setBalanceLoading(true);
    try {
      setAccountBalance("");
      const res = await metaApi.get(
        `/GetUserInfo?Manager_Index=${import.meta.env.VITE_MANAGER_INDEX}&MT5Account=${account}`
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

  // When wallet selection changes under Wallet Transfer, auto-prompt if address missing
  useEffect(() => {
    if (selectedGateway === "Wallet Transfer" && walletMeta) {
      if (!currentWalletAddress) {
        setWalletAddressInput("");
        setShowAddressModal(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGateway, selectWallet]);

  const openAddressModalManually = () => {
    setWalletAddressInput(currentWalletAddress || "");
    setShowAddressModal(true);
  };

  const saveWalletAddress = async () => {
    if (!walletMeta) return;
    const value = walletAddressInput?.trim();
    if (!value) {
      toast.error("Please enter an address.");
      return;
    }

    // IMPORTANT: send full walletDetails so backend doesn't wipe others
    const existing = {
      tetherAddress: loggedUser?.walletDetails?.tetherAddress || "",
      ethAddress: loggedUser?.walletDetails?.ethAddress || "",
      accountNumber: loggedUser?.walletDetails?.accountNumber || "",
      trxAddress: loggedUser?.walletDetails?.trxAddress || "",
      bep20Address: loggedUser?.walletDetails?.bep20Address || "",
    };
    const payload = { ...existing, [walletMeta.field]: value };

    const toastId = toast.loading("Saving address...");
    try {
      await backendApi.put(`/${loggedUser._id}/wallet-details`, payload);
      await getUpdateLoggedUser();
      toast.success("Wallet address saved.", { id: toastId });
      setShowAddressModal(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to save wallet address.", { id: toastId });
    }
  };

  const withdrawalHandler = async (e) => {
    e.preventDefault();
    setError("");

    const amt = Number(amount || 0);
    const equity = Number(accountBalance || 0);

    if (!account || !selectedGateway || !amount) {
      setError("All fields are required.");
      return;
    }

    if (amt < 10) {
      toast.error("Minimum withdrawal amount is $10. Please increase your amount.");
      return;
    }

    if (equity < amt) {
      setError("You don't have sufficient balance for the withdrawal !!");
      toast.error("You don't have sufficient balance for the withdrawal !!");
      return;
    }

    // Ensure wallet address exists for selected wallet if using Wallet Transfer
    if (selectedGateway === "Wallet Transfer" && walletMeta) {
      if (!currentWalletAddress) {
        toast.error(`Please add your ${walletMeta.label} first.`);
        setWalletAddressInput("");
        setShowAddressModal(true);
        return;
      }
    }

    if (isWithdrawing) return;

    const toastId = toast.loading("please wait..");

    // Send OTP first
    try {
      const sendOtpRes = await backendApi.post("/send-otp", {
        email: loggedUser.email,
      });

      if (sendOtpRes.data.otp) {
        toast.success("OTP sent to your email", { id: toastId });
        setShowOtpInput(true);
      } else {
        toast.error("Failed to send OTP", { id: toastId });
      }
    } catch (err) {
      console.log("OTP error", err);
      toast.error("Error sending OTP", { id: toastId });
    }
  };

  const verifyOtpHandler = async () => {
    const toastID = toast.loading("Verifying your request..");
    if (!otp) {
      toast.error("OTP required", { id: toastID });
      return;
    }

    const amt = Number(amount || 0);
    const equity = Number(accountBalance || 0);

    setApiLoader(true);
    setIsWithdrawing(true);

    try {
      await backendApi.post("/verify-otp", {
        email: loggedUser.email,
        otp,
      });

      if (equity < amt) {
        setError("You don't have balance for withdrawal !!");
      } else {
        await backendApi.post(`/withdrawal`, {
          method: selectedGateway === "Bank Transfer" ? selectedGateway : selectWallet,
          accountType: accountType,
          amount: amt,
          mt5Account: account,
          status: "pending",
          userId: loggedUser._id,
          lastBalance: equity,
        });

        const customContent = withdrawRequestMail({
          loggedUser,
          amount: amt,
          accountBalance: equity,
        });

        console.log(customContent);
        

        toast.success("Withdrawal Requested.", { id: toastID });
        fetchAccountInfo();
        setAmount("");

        console.log(loggedUser);
        

       const mailres =  await backendApi.post(`/custom-mail`, {
          email: loggedUser.email,
          content: customContent,
          subject: "Withdrawal requested",
        });

        console.log(mailres);
        


      }

      setShowOtpInput(false);
      setOtp("");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Withdrawal failed", {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  return (
    <div className="w-full flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className=" w-full bg-secondary-800/20 p-8 rounded-lg shadow-xl"
      >
        {showOtpInput && (
          <OtpUi
            otp={otp}
            setOtp={setOtp}
            setShowOtpInput={setShowOtpInput}
            verifyOtpHandler={verifyOtpHandler}
            apiLoader={apiLoader}
          />
        )}

        {/* Address Modal */}
        {showAddressModal && walletMeta && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm">
            <div className="w-full max-w-md bg-secondary-800/90 border border-gray-700 rounded-2xl p-6 shadow-2xl">
              <h3 className="text-lg font-semibold text-gray-100 mb-2">
                {currentWalletAddress ? "Update" : "Add"} {walletMeta.label}
              </h3>
              <p className="text-xs text-gray-400 mb-4">
                This will be saved in your profile’s wallet details.
              </p>
              <input
                type="text"
                value={walletAddressInput}
                onChange={(e) => setWalletAddressInput(e.target.value)}
                placeholder={walletMeta.placeholder}
                className="w-full px-4 py-3 border text-gray-100 bg-secondary-900/80 border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all duration-300"
              />
              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddressModal(false)}
                  className="px-4 py-2 rounded-full border border-gray-700 text-gray-200 hover:bg-secondary-800/60"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={saveWalletAddress}
                  className="px-5 py-2 rounded-full bg-secondary-500-80 hover:bg-secondary-500-70 text-white shadow"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div className=" mb-4">
            <ModernHeading text={"Withdraw Funds"} />
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
                  <LoaderPinwheelIcon className=" animate-spin text-secondary-500" />
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
                  setAccountType(selectedAccount?.accountType || "");
                }}
                className="w-full px-4 py-2 mt-2 border bg-secondary-800/20 border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
                defaultValue=""
              >
                <option className="bg-secondary-800 text-white/30" value="" disabled>
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
                  <option className=" bg-secondary-800 text-white/20" value="">
                    select Method
                  </option>
                  {/* <option className=" bg-secondary-800 text-white" value="Bank Transfer">
                    Bank Transfer
                  </option> */}
                  <option className=" bg-secondary-800 text-white" value="Wallet Transfer">
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
                    <option className=" bg-secondary-800 text-white" value="USDT(Trc20)">
                      USDT (Trc20)
                    </option>
                    <option className=" bg-secondary-800 text-white" value="BITCOIN">
                      BITCOIN
                    </option>
                    <option className=" bg-secondary-800 text-white" value="USDT(BEP20)">
                      USDT(BEP20)
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
                <label htmlFor="amount" className=" text-sm font-medium text-gray-200">
                  Enter Amount
                </label>
                {siteConfig?.inrUi !== false ? (
                  <div className="flex mb-2 whitespace-nowrap gap-2 items-center">
                    <h1 className="text-sm font-bold text-gray-300">In INR:</h1>
                    <p className="bg-secondary-500-10 text-secondary-500 px-2 text-sm py-1 font-semibold rounded-full">
                      &#8377; {(Number(amount || 0) * Number(siteConfig?.dollarWithdrawalRate || 0)).toFixed(2)}
                    </p>
                  </div>
                ) : (
                  ""
                )}
              </div>
              <div className="relative bg-secondary-800/20 rounded-md">
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
                  min={0}
                />
              </div>
            </div>

            {/* account details */}
            <div className=" w-full">
              {selectedGateway === "Bank Transfer" ? (
                <div>
                  <div className=" flex items-center gap-2 mb-3">
                    <WalletCardsIcon />
                    <h1 className=" text-lg font-bold">Account details</h1>
                  </div>
                  <div>
                    <p>
                      Bank Name :{" "}
                      <span className=" font-bold">{loggedUser?.bankDetails?.bankName}</span>
                    </p>
                  </div>
                  <div>
                    <p>
                      Holder Name :{" "}
                      <span className=" font-bold">{loggedUser?.bankDetails?.holderName}</span>{" "}
                    </p>
                  </div>
                  <div>
                    <p>
                      Account Number :{" "}
                      <span className=" font-bold">{loggedUser?.bankDetails?.accountNumber}</span>
                    </p>
                  </div>
                  <div>
                    <p>
                      IFSC Code :{" "}
                      <span className=" font-bold">{loggedUser?.bankDetails?.ifscCode}</span>
                    </p>
                  </div>
                  <div>
                    <p>
                      Swift Code :{" "}
                      <span className=" font-bold">{loggedUser?.bankDetails?.swiftCode}</span>
                    </p>
                  </div>
                  <div>
                    <p>
                      UPI ID : <span className=" font-bold">{loggedUser?.bankDetails?.upiId}</span>
                    </p>
                  </div>
                </div>
              ) : selectedGateway === "Wallet Transfer" ? (
                <div>
                  <div className=" flex items-center gap-2 mb-3">
                    <WalletCardsIcon />
                    <h1 className=" text-lg font-bold">Account details</h1>
                  </div>

                  {/* Dynamic wallet row */}
                  {!!walletMeta && (
                    <div className="flex items-start md:items-center justify-between gap-3">
                      <p className="text-sm">
                        {walletMeta.label} :{" "}
                        <span className=" font-bold break-all">
                          {currentWalletAddress || "Not set"}
                        </span>
                      </p>

                      <button
                        type="button"
                        onClick={openAddressModalManually}
                        className="text-xs px-3 py-1 rounded-full border border-secondary-500/40 text-secondary-200 hover:bg-secondary-500-10"
                      >
                        {currentWalletAddress ? "Update" : "Add"} Address
                      </button>
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
              disabled={isWithdrawing}
              className={`text-sm md:text-lg flex px-12 py-3 shadow-md transition-all md:hover:px-16 rounded-full ${
                isWithdrawing
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-secondary-500-80 hover:bg-secondary-500-70"
              }`}
            >
              {isWithdrawing ? "Processing..." : "Request Withdrawal"}
              {(apiLoader || isWithdrawing) && <Loader2 className="animate-spin mx-3" />}
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
