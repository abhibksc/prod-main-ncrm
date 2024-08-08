import React, { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDownCircle, BadgeDollarSign } from "lucide-react";

const UserWithdraw = () => {
  const [selectedGateway, setSelectedGateway] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [amount, setAmount] = useState("");

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
        <form className="space-y-6">
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
              className="block w-full p-3 text-base bg-secondary-700 text-white border border-secondary-600 rounded-md "
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
              className="block w-full p-3 text-base bg-secondary-700 text-white border border-secondary-600 rounded-md "
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
                className="w-full pl-10 py-3 bg-secondary-700 text-white  border-secondary-600 rounded-md placeholder-gray-300 "
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
            type="submit"
            className="w-full bg-green-600/80 text-white py-3 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-700 transition duration-300"
          >
            Submit Withdrawal
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default UserWithdraw;
