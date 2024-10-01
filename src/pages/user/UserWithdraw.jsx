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
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const profitNloss = useSelector((store) => store.user.profitNloss);
  const [selectedGateway, setSelectedGateway] = useState("Bank Transfer");
  const [selectedAccount, setSelectedAccount] = useState(
    loggedUser.accountType
  );
  const [amount, setAmount] = useState(profitNloss);
  const [apiLoader, setApiLoader] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

  const userInfo = useSelector((store) => store.user.userInfo);
  const { GetUserInfoAPI } = UseUserHook();

  const withdrawalHandler = async (e) => {
    e.preventDefault();
    setApiLoader(true);
    setError("");
    console.log(selectedGateway, selectedAccount, amount);
    try {
      if (loggedUser.phase !== 3) {
        setError("You have to be in 3rd phase for withdrawal !!");
        setApiLoader(false);
      } else if (profitNloss > 0 && profitNloss >= amount) {
        const withdrawalDBres = await axios.post(
          `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/withdrawal`,
          {
            method: selectedGateway,
            tradeAccount: selectedAccount,
            amount: amount,
            mt5Account: userInfo.MT5Account,
            status: "pending",
            userId: loggedUser._id,
            managerIndex: 1,
            pNl: "40",
            phase: loggedUser.phase,
          }
        );
        setApiLoader(false);
        toast.success("Withdawal requested");
        // GetUserInfoAPI();

        console.log("withdrawal DB res--", withdrawalDBres.data.data);
      } else {
        setError("You don't have sufficient funds for withdrawal !!");
        setApiLoader(false);
      }
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
          <h2 className="text-2xl font-bold text-white flex items-center">
            <ArrowDownCircle className="w-8 h-8 mr-2" />
            Withdraw Funds
          </h2>
          <div>
            <h1 className=" font-semibold text-sm text-neutral-100">
              Withdrawalable Balance
            </h1>
            <p
              className={` text-center ${
                profitNloss > 0
                  ? "text-green-500 bg-secondary-700/70"
                  : "text-red-500 bg-red-400/20"
              }   mt-1 rounded-full py-1  font-bold`}
            >
              $ {profitNloss ? profitNloss.toFixed(2) : "0"}
            </p>
          </div>
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
              {/* <option value="">Select Gateway</option> */}
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
              <option value="">{loggedUser.accountType}</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-white mb-2"
            >
              Amount
            </label>
            <div className="relative bg-secondary-700 rounded-md cursor-not-allowed">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <BadgeDollarSign className="h-6 w-6 text-white" />
              </div>
              <input
                type="text"
                id="amount"
                className="w-full pl-10 py-3 cursor-not-allowed bg-secondary-700 text-white border-none outline-none rounded-md placeholder-gray-300 "
                placeholder="0.00"
                value={profitNloss}
                // onChange={(e) => setAmount(e.target.value)}
              />
              {/* <div className="absolute inset-y-0 right-0 flex items-center">
                <select
                  id="currency"
                  name="currency"
                  className="bg-secondary-700 text-white border border-secondary-600 rounded-md py-2 px-3"
                >
                  <option>USD</option>
                  <option>EUR</option>
                  <option>GBP</option>
                </select>
              </div> */}
            </div>
          </div>
          <button
            onClick={withdrawalHandler}
            type="submit"
            className="w-full flex justify-center hover:shadow-xl bg-green-600/80 text-white py-3 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-700 transition duration-300"
          >
            Submit Withdrawal
            {apiLoader && <Loader2 className=" animate-spin mx-3"></Loader2>}
          </button>
          <div className=" my-2 text-red-500 text-center">
            <p>{error}</p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default UserWithdraw;
