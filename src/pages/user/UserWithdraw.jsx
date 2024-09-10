import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownCircle, BadgeDollarSign, Loader2 } from "lucide-react";
import axios from "axios";
import Loader from "../../components/Loader/Loader";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setAvailableBalance, setIsRefresh } from "../../redux/user/userSlice";
import UseUserHook from "../../hooks/user/UseUserHook";

const UserWithdraw = () => {
  const [selectedGateway, setSelectedGateway] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [amount, setAmount] = useState("");
  const [apiLoader, setApiLoader] = useState(false);
  const dispatch = useDispatch();

  const userInfo = useSelector((store) => store.user.userInfo);
  const { GetUserInfoAPI } = UseUserHook();

  const withdrawalHandler = async (e) => {
    e.preventDefault();
    setApiLoader(true);
    try {
      const withdrawalDBres = await axios.post(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/withdrawal`,
        {
          method: selectedAccount,
          tradeAccount: selectedGateway,
          amount: amount,
          mt5Account: userInfo.MT5Account,
          status: "pending",
          userId: "66de89ee0ab97583ae19ec9a",
          managerIndex: 1,
          pNl: "40",
        }
      );
      setApiLoader(false);
      toast.success("Withdawal requested");
      // GetUserInfoAPI();

      console.log("withdrawal DB res--", withdrawalDBres.data.data);
    } catch (error) {
      setApiLoader(false);
      toast.error("Withdawal Failed");
      console.log("error while withdraw", error);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-r">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg bg-secondary-800 -mt-20 p-8 rounded-lg shadow-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white flex items-center">
            <ArrowDownCircle className="w-8 h-8 mr-2" />
            Withdraw Funds
          </h2>
          <button
            type="button"
            className="bg-secondary-700 text-white px-4 py-2 rounded-md hover:bg-secondary-600 transition duration-300"
          >
            Withdraw History
          </button>
        </div>
        <form onSubmit={withdrawalHandler} className="space-y-6">
          <div>
            <label
              htmlFor="gateway"
              className="block text-sm font-medium text-white mb-2"
            >
              Method
            </label>
            <select
              id="gateway"
              value={selectedGateway}
              onChange={(e) => setSelectedGateway(e.target.value)}
              className="block w-full p-3 text-base bg-secondary-700 outline-none border-none text-white rounded-md "
            >
              <option value="">Select Gateway</option>
              <option value="bank">Bank Transfer</option>
              <option value="paypal">PayPal</option>
              <option value="crypto">Cryptocurrency</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="account"
              className="block text-sm font-medium text-white mb-2"
            >
              Trade Account
            </label>
            <select
              id="account"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="block w-full p-3 text-base bg-secondary-700 text-white border outline-none border-none rounded-md "
            >
              <option value="">Select Account</option>
              <option value="main">Main Account</option>
              <option value="savings">Savings Account</option>
              <option value="investment">Investment Account</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-white mb-2"
            >
              Amount
            </label>
            <div className="relative bg-secondary-700 rounded-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BadgeDollarSign className="h-6 w-6 text-white" />
              </div>
              <input
                type="text"
                id="amount"
                className="w-full pl-10 py-3 bg-secondary-700 text-white border-none outline-none rounded-md placeholder-gray-300 "
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <div className="absolute inset-y-0 right-0 flex items-center">
                <select
                  id="currency"
                  name="currency"
                  className="bg-secondary-700 text-white border border-secondary-600 rounded-md py-2 px-3"
                >
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>
              </div>
            </div>
          </div>
          <button
            onClick={withdrawalHandler}
            type="submit"
            className="w-full flex justify-center bg-green-600/80 text-white py-3 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-700 transition duration-300"
          >
            Submit Withdrawal
            {apiLoader && <Loader2 className=" animate-spin mx-3"></Loader2>}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default UserWithdraw;
