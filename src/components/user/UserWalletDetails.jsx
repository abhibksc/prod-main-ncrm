import React from "react";
import { motion } from "framer-motion";

const InputField = ({ label, placeholder }) => (
  <div className="mb-6 w-full">
    <label className="block text-sm font-medium text-white mb-2">{label}</label>
    <input
      type="text"
      placeholder={placeholder}
      className="w-full px-4 py-3 border  rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-white"
    />
  </div>
);

const UserWalletDetails = () => {
  return (
    <div className="max-w-7xl mx-auto p-8 bg-secondary-700/30 rounded-2xl ">
      <div className=" text-white p-6 rounded-xl ">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputField
            label="Tether Wallet Address"
            placeholder="Enter Tether wallet address"
          />
          <InputField
            label="ETH Wallet Address"
            placeholder="Enter ETH wallet address"
          />
          <InputField label="Account No" placeholder="Enter account number" />
          <InputField
            label="TRX Wallet Address"
            placeholder="Enter TRX wallet address"
          />
        </div>
        <div className="flex items-center justify-center mt-8">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-lg"
          >
            Update Account Details
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default UserWalletDetails;
