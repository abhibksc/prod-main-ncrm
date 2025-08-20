import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { backendApi, metaApi } from "@/utils/apiClients";
import { useSelector } from "react-redux";
import { LoaderPinwheelIcon, CheckCircle2Icon } from "lucide-react";
import toast from "react-hot-toast";
import useMT5Stats from "@/hooks/admin/UseMT5AccountStats";
import OtpUi from "../OtpUi";
import { useNavigate } from "react-router-dom";

const UserP2pTransfer = () => {
  const [fromAccount, setFromAccount] = useState("");
  const [toAccountInput, setToAccountInput] = useState("");
  const [selectedToAccount, setSelectedToAccount] = useState(null);
  const [amount, setAmount] = useState("");
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const [fromAccountBalance, setFromAccountBalance] = useState("");
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [isTransferLoading, setIsTransferLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { accounts } = useMT5Stats();
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [apiLoader, setApiLoader] = useState(false);
  const [selectedFromAccount, setSelectedFromAccount] = useState({});
  const [netTransferAmount, setNetTransferAmount] =
    useState(fromAccountBalance);
  // -----------------
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedFromAccount?.lockInfo?.isLocked) {
      setNetTransferAmount(
        +(
          parseFloat(fromAccountBalance || 0) -
          parseFloat(selectedFromAccount.lockInfo.amount || 0)
        ).toFixed(2)
      );
    } else {
      setNetTransferAmount(fromAccountBalance);
    }
  }, [fromAccountBalance]);

  const fromAccountInfo = async () => {
    try {
      setFromAccountBalance("");
      setBalanceLoading(true);
      const res = await backendApi.get(`id-info?accountNumber=${fromAccount}`);

      setBalanceLoading(false);
      if (res.data.Equity) setFromAccountBalance(res.data.Equity);
    } catch (error) {
      console.log(error);
      setBalanceLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isTransferLoading) return;
    if (!selectedToAccount?.MT5Account) {
      toast.error(
        "Invalid receiver account. Please double-check and try again."
      );
      return;
    }

    if (amount > netTransferAmount) {
      toast.error("You don't have sufficient funds for transfer");
      return;
    }

    const toastId = toast.loading("Processing your transfer. Please wait...");
    // Send OTP first --
    setIsTransferLoading(false);

    try {
      const sendOtpRes = await backendApi.post("/send-otp", {
        email: loggedUser.email,
        subject: "P2P Transfer Verification OTP",
      });
      toast.success("OTP sent to your email", { id: toastId });
      setShowOtpInput(true);
    } catch (err) {
      toast.error("Failed to send OTP", { id: toastId });
      console.log("OTP error", err);
    } finally {
      setIsTransferLoading(false);
    }
  };

  // verify and process otp

  const verifyOtpHandler = async () => {
    const toastID = toast.loading("Verifying your request..");
    if (!otp) {
      toast.error("OTP required", { id: toastID });
      return;
    }
    setApiLoader(true);
    try {
      const res = await backendApi.post("/verify-otp", {
        email: loggedUser.email,
        otp,
      });
      // Proceed to transfer logic
      if (netTransferAmount < amount) {
        toast.error("You don't have sufficient funds for transfer !!", {
          id: toastID,
        });
        return;
      }
      // withdraw from account ----
      await metaApi.get(
        `/MakeWithdrawBalance?Manager_Index=${
          import.meta.env.VITE_MANAGER_INDEX
        }&MT5Account=${fromAccount}&Amount=${amount}&Comment=p2p-transfer`
      );
      // deposit to account ----

      await metaApi.get(
        `/MakeDepositBalance?Manager_Index=${
          import.meta.env.VITE_MANAGER_INDEX
        }&MT5Account=${
          selectedToAccount.MT5Account
        }&Amount=${amount}&Comment=p2p-transfer`
      );
      // add to db ----------

      await backendApi.post(`/add-transfer`, {
        userId: loggedUser._id,
        type: "p2p",
        fromAccount: fromAccount,
        toAccount: selectedToAccount.MT5Account,
        amount: amount,
        status: "success",
      });
      // after process---
      toast.success("P2P transfer successful !!", {
        id: toastID,
      });
      // Reset OTP state
      setShowOtpInput(false);
      setOtp("");
      fromAccountInfo();
      navigate("/user/transaction");
    } catch (error) {
      toast.error(error.response.data.message || "Transfer failed", {
        id: toastID,
      });
      console.log("error during transfer", error);
    } finally {
      setApiLoader(false);
    }
  };

  useEffect(() => {
    if (fromAccount) fromAccountInfo();
  }, [fromAccount]);

  const matchingAccounts = toAccountInput
    ? accounts.filter(
        (acc) =>
          acc.MT5Account.toString().includes(toAccountInput) &&
          acc.MT5Account.toString() !== fromAccount.toString()
      )
    : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
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
      <p className="text-gray-400 mb-6">
        You can instantly send funds to other users using their account number.
        Make sure both accounts use the same currency. For cross-currency
        transfers, contact Admin.
      </p>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: "easeOut", delay: 0.3 }}
      >
        <div className="flex flex-col md:flex-row justify-between gap-5">
          {/* From Account */}
          <div className="w-full">
            <label className="text-sm font-medium flex justify-between text-gray-200">
              <span>From Account</span>
              {balanceLoading ? (
                <LoaderPinwheelIcon className="animate-spin text-secondary-500" />
              ) : (
                fromAccountBalance && (
                  <span className="px-4">
                    Balance:{" "}
                    <span className="bg-secondary-500-10 px-3 py-1 rounded-full text-secondary-500">
                      ${fromAccountBalance}
                    </span>
                  </span>
                )
              )}
            </label>
            <select
              required
              value={fromAccount}
              onChange={(e) => {
                setFromAccount(e.target.value);
                const selectedAccount = loggedUser?.accounts?.find(
                  (acc) => acc.accountNumber === e.target.value
                );
                setSelectedFromAccount(selectedAccount || {});
              }}
              className="w-full px-4 py-2 mt-2 border bg-secondary-900 border-gray-700 rounded-md focus:ring-2 focus:ring-secondary-500"
            >
              <option className="bg-secondary-900" value="" disabled>
                Select Account
              </option>
              {loggedUser?.accounts?.map((acc, i) => (
                <option
                  key={i}
                  value={acc.accountNumber}
                  disabled={
                    +selectedToAccount?.MT5Account === +acc.accountNumber
                  }
                  className="bg-secondary-900 text-white"
                >
                  {acc.accountNumber}
                </option>
              ))}
            </select>
          </div>

          {/* To Account Autocomplete */}
          <div className="w-full relative">
            <label className="text-sm font-medium text-gray-200 mb-1 block">
              To Account
            </label>
            <input
              type="number"
              value={toAccountInput}
              onChange={(e) => {
                setToAccountInput(e.target.value);
                setSelectedToAccount(null);
                setShowSuggestions(true);
              }}
              placeholder="Enter Account Number"
              className="w-full px-4 py-2 border bg-secondary-800/20 border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
            />
            {showSuggestions &&
              toAccountInput.length >= 6 &&
              matchingAccounts.length > 0 && (
                <ul className="absolute z-10 bg-secondary-900 text-white mt-1 rounded-md shadow max-h-40 overflow-y-auto w-full border border-secondary-700">
                  {matchingAccounts.map((acc) => (
                    <li
                      key={acc.MT5Account}
                      onClick={() => {
                        setToAccountInput(acc.MT5Account.toString());
                        setSelectedToAccount(acc);
                        setShowSuggestions(false);
                        document.activeElement.blur(); // closes mobile keyboards etc.
                      }}
                      className="px-4 py-2 hover:bg-secondary-700 cursor-pointer"
                    >
                      {+acc.MT5Account}
                    </li>
                  ))}
                </ul>
              )}
            {selectedToAccount && (
              <div className="mt-2 text-sm flex items-center gap-1 text-green-500 font-medium">
                <CheckCircle2Icon size={18} className="text-green-500" />
                <span>
                  Verified: {selectedToAccount.First?.trim()} (
                  {selectedToAccount.MT5Account})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Locked Amount UI */}
        {selectedFromAccount?.lockInfo?.isLocked && (
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
                      ${selectedFromAccount.lockInfo.amount || "0.00"}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-gray-400">Available for Transfer</p>
                    <p className="font-semibold text-green-400">
                      $
                      {(
                        parseFloat(fromAccountBalance || 0) -
                        parseFloat(selectedFromAccount.lockInfo.amount || 0)
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>

                {selectedFromAccount.lockInfo.comment && (
                  <div className="mt-3 p-3 bg-secondary-800/30 rounded-md border-l-2 border-amber-500/50">
                    <p className="text-xs text-gray-400 mb-1">
                      Administrator Note:
                    </p>
                    <p className="text-sm text-gray-200 italic">
                      "{selectedFromAccount.lockInfo.comment}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Amount */}
        <div>
          <label className="text-sm font-medium text-gray-200 mb-1 block">
            Amount to Transfer
          </label>
          <input
            type="number"
            required
            value={amount}
            onChange={(e) => {
              const val = e.target.value;
              const num = parseFloat(val);

              if (
                val === "" ||
                (num >= 0 && num <= parseFloat(netTransferAmount))
              ) {
                setAmount(val);
              }
            }}
            placeholder="Enter amount"
            className="w-full px-4 py-2 border bg-secondary-800/20 border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500"
          />
        </div>

        <div className="flex justify-center items-center">
          <motion.button
            type="submit"
            whileTap={{ scale: 0.95 }}
            disabled={isTransferLoading}
            className={`px-12 py-3 mt-4 text-white font-semibold rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-secondary-500/30 ${
              isTransferLoading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-secondary-500-90 hover:px-16 hover:bg-secondary-500-80"
            }`}
          >
            {isTransferLoading ? "Processing..." : "Transfer Now"}
          </motion.button>
        </div>
      </motion.form>
    </motion.div>
  );
};

export default UserP2pTransfer;
