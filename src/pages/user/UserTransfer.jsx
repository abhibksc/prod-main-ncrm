import ModernHeading from "@/lib/ModernHeading";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { backendApi, metaApi } from "@/utils/apiClients";
import { useSelector } from "react-redux";
import { LoaderPinwheelIcon } from "lucide-react";
import toast from "react-hot-toast";
import UserP2pTransfer from "@/components/user/UserP2pTransfer";

// Motion Variants
const containerStagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const UserTransfer = () => {
  const [activeTab, setActiveTab] = useState("internal");
  const [fromAccount, setFromAccount] = useState("");
  const [toAccount, setToAccount] = useState("");
  const [amount, setAmount] = useState("");
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const [fromAccountBalance, setFromAccountBalance] = useState("");
  const [toAccountBalance, setToAccountBalance] = useState("");
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [isTransferLoading, setIsTransferLoading] = useState(false);

  const fromAccountInfo = async () => {
    try {
      setFromAccountBalance("");
      setBalanceLoading(true);
      const res = await metaApi.get(
        `/GetUserInfo?Manager_Index=${
          import.meta.env.VITE_MANAGER_INDEX
        }&MT5Account=${fromAccount}`
      );
      setBalanceLoading(false);
      if (res.data.Equity) setFromAccountBalance(res.data.Equity);
    } catch (error) {
      console.log(error);
      setBalanceLoading(false);
    }
  };

  const toAccountInfo = async () => {
    try {
      setToAccountBalance("");
      setBalanceLoading(true);
      const res = await metaApi.get(
        `/GetUserInfo?Manager_Index=${
          import.meta.env.VITE_MANAGER_INDEX
        }&MT5Account=${toAccount}`
      );
      setBalanceLoading(false);
      if (res.data.Equity) setToAccountBalance(res.data.Equity);
    } catch (error) {
      console.log(error);
      setBalanceLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isTransferLoading) return;
    if (!fromAccount || !toAccount) {
      toast.error("Both two account must be selected !!");
      return;
    }
    const toastId = toast.loading("Processing your transfer. Please wait...");
    setIsTransferLoading(true);

    try {
      await metaApi.get(
        `/MakeWithdrawBalance?Manager_Index=${
          import.meta.env.VITE_MANAGER_INDEX
        }&MT5Account=${fromAccount}&Amount=${amount}&Comment=transfer`
      );
      await metaApi.get(
        `/MakeDepositBalance?Manager_Index=${
          import.meta.env.VITE_MANAGER_INDEX
        }&MT5Account=${toAccount}&Amount=${amount}&Comment=transfer`
      );
      await backendApi.post(`/add-transfer`, {
        userId: loggedUser._id,
        type: "internal",
        fromAccount: fromAccount,
        toAccount: toAccount,
        amount: amount,
        status: "success",
      });
      toast.success("Transfer completed successfully!", { id: toastId });
      setAmount("");
      await fromAccountInfo();
      await toAccountInfo();
    } catch (error) {
      console.log(error);
      toast.error("Transfer failed. Please try again.", { id: toastId });
    } finally {
      setIsTransferLoading(false);
    }
  };

  useEffect(() => {
    fromAccountInfo();
  }, [fromAccount]);

  useEffect(() => {
    toAccountInfo();
  }, [toAccount]);

  return (
    <motion.div
      className="mx-auto p-6 bg-secondary-800/20 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <ModernHeading text="Transfer Funds" />

      {/* Tabs */}
      <div className="flex justify-center mt-6 mb-6 space-x-4">
        {["internal", "p2p"].map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveTab(tab)}
            whileTap={{ scale: 0.95 }}
            className={`px-6 py-2 rounded-full  text-[10px] md:text-sm font-semibold transition-all ${
              activeTab === tab
                ? "bg-secondary-500 text-white"
                : "bg-secondary-700/60 hover:bg-secondary-500-30 text-gray-300"
            }`}
          >
            {tab === "internal" ? "Internal Transfer" : "P2P Transfer"}
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "internal" ? (
          <motion.div
            key="internal-tab"
            variants={containerStagger}
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <motion.p
              variants={fadeInUp}
              className="text-gray-400 mb-6 text-sm"
            >
              Instantly transfer funds between your own accounts with same
              currency. <br />
              For different currencies, contact admin.
            </motion.p>

            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              variants={containerStagger}
            >
              <motion.div
                className="flex flex-col md:flex-row justify-between gap-5"
                variants={fadeInUp}
              >
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
                    onChange={(e) => setFromAccount(e.target.value)}
                    className="w-full px-4 py-2 mt-2 border bg-secondary-800/20 border-gray-700 rounded-md focus:ring-2 focus:ring-secondary-500"
                  >
                    <option className=" bg-secondary-800" value="" disabled>
                      Select Account
                    </option>
                    {loggedUser?.accounts?.map((acc, i) => (
                      <option
                        key={i}
                        value={acc.accountNumber}
                        disabled={toAccount === acc.accountNumber}
                        className="bg-secondary-800 text-white"
                      >
                        {acc.accountNumber}
                      </option>
                    ))}
                  </select>
                </div>

                {/* To Account */}
                <div className="w-full">
                  <label className="text-sm font-medium flex justify-between text-gray-200">
                    <span>To Account</span>
                    {balanceLoading ? (
                      <LoaderPinwheelIcon className="animate-spin text-secondary-500" />
                    ) : (
                      toAccountBalance && (
                        <span className="px-4">
                          Balance:{" "}
                          <span className="bg-secondary-500-10 px-3 py-1 rounded-full text-secondary-500">
                            ${toAccountBalance}
                          </span>
                        </span>
                      )
                    )}
                  </label>
                  <select
                    required
                    value={toAccount}
                    onChange={(e) => setToAccount(e.target.value)}
                    className="w-full px-4 py-2 mt-2 border bg-secondary-800/20 border-gray-700 rounded-md focus:ring-2 focus:ring-secondary-500"
                  >
                    <option className=" bg-secondary-800" value="" disabled>
                      Select Account
                    </option>
                    {loggedUser?.accounts?.map((acc, i) => (
                      <option
                        key={i}
                        value={acc.accountNumber}
                        disabled={fromAccount === acc.accountNumber}
                        className="bg-secondary-800 text-white"
                      >
                        {acc.accountNumber}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>

              {/* Amount */}
              <motion.div variants={fadeInUp}>
                <label className="text-sm font-medium text-gray-200">
                  Amount to Transfer
                </label>
                <input
                  type="number"
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full px-4 py-2 mt-2 border bg-secondary-800/20 border-gray-700 rounded-md focus:ring-2 focus:ring-secondary-500"
                />
              </motion.div>

              {/* Button */}
              <motion.div className="flex justify-center" variants={fadeInUp}>
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.95 }}
                  disabled={isTransferLoading}
                  className={`px-10 py-3 text-white font-semibold rounded-full transition-all focus:ring-2 ${
                    isTransferLoading
                      ? "bg-gray-500 cursor-not-allowed"
                      : "bg-secondary-500-90 hover:bg-secondary-500-80"
                  }`}
                >
                  {isTransferLoading ? "Processing..." : "Transfer Now"}
                </motion.button>
              </motion.div>
            </motion.form>
          </motion.div>
        ) : (
          <motion.div
            key="p2p-tab"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <UserP2pTransfer></UserP2pTransfer>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default UserTransfer;
