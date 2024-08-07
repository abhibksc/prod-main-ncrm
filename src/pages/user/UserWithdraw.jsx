import React, { useState } from "react";
import { ArrowDownCircle, BadgeDollarSign } from "lucide-react";

const UserWithdraw = () => {
  const [selectedGateway, setSelectedGateway] = useState("");
  const [selectedAccount, setSelectedAccount] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <div className="max-w-md mx-auto bg-secondary-800 text-white shadow-lg rounded-lg overflow-hidden">
      <div className="px-6 flex justify-between py-4 bg-secondary-600">
        <h2 className="text-2xl font-bold text-white flex justify-between items-center">
          <ArrowDownCircle className="w-6 h-6 mr-2" />
          Withdraw Funds
        </h2>
        <button
          type="button"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md  bg-secondary-600 hover:bg-secondary-700  focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Withdraw History
        </button>
      </div>
      <form className="px-6 py-4 space-y-4">
        <div>
          <label htmlFor="gateway" className="block text-sm font-medium mb-1">
            Method
          </label>
          <div className="relative">
            <select
              id="gateway"
              value={selectedGateway}
              onChange={(e) => setSelectedGateway(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base bg-secondary-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Select Gateway</option>
              <option value="bank">Bank Transfer</option>
              <option value="paypal">PayPal</option>
              <option value="crypto">Cryptocurrency</option>
            </select>
          </div>
        </div>
        <div>
          <label htmlFor="account" className="block text-sm font-medium mb-1">
            Trade Account
          </label>
          <div className="relative">
            <select
              id="account"
              value={selectedAccount}
              onChange={(e) => setSelectedAccount(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base bg-secondary-700 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">Select Account</option>
              <option value="main">Main Account</option>
              <option value="savings">Savings Account</option>
              <option value="investment">Investment Account</option>
            </select>
          </div>
        </div>
        <div className=" ">
          <label htmlFor="amount" className="block text-sm font-medium mb-1">
            Amount
          </label>
          <div className="mt-1 bg-secondary-700 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BadgeDollarSign className="h-5 w-5" />
            </div>
            <input
              type="text"
              name="amount"
              id="amount"
              className="focus:ring-indigo-500 bg-secondary-700 py-3 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm outline-none rounded-md"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <label htmlFor="currency" className="sr-only">
                Currency
              </label>
              <select
                id="currency"
                name="currency"
                className="focus:ring-indigo-500 bg-secondary-700 text-black font-semibold focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent sm:text-sm rounded-md"
              >
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
              </select>
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Submit Withdrawal
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserWithdraw;
