import React, { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, User, Wallet } from "lucide-react";
import KYCVerification from "@/components/user/KycVarification";
import UserWalletDetails from "@/components/user/UserWalletDetails";

const TabButton = ({ active, onClick, children, icon: Icon }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    className={`flex items-center px-6 hover:shadow-2xl py-3 font-semibold transition-all duration-300 ${
      active
        ? "bg-secondary-500/50 text-white shadow-lg"
        : "bg-secondary-800/60 text-gray-300 hover:bg-secondary-800/70"
    } rounded-full mr-2`}
    onClick={onClick}
  >
    <Icon className="mr-2" size={18} />
    {children}
  </motion.button>
);

const InputField = ({ label, type = "text", placeholder }) => (
  <div className="mb-6">
    <label className="block text-sm font-medium text-white mb-2">{label}</label>
    <input
      type={type}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all duration-300 bg-white text-gray-800"
      placeholder={placeholder}
    />
  </div>
);

const AccountDetails = () => {
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    { id: "personal", label: "Kyc Details", icon: User },
    { id: "account", label: "Bank Details", icon: CreditCard },
    { id: "wallet", label: "Wallet Details", icon: Wallet },
  ];

  return (
    <div className="max-w-7xl mx-auto p-8 bg-secondary-800/30 rounded-2xl shadow-2xl">
      <h1 className="text-3xl font-bold mb-8 text-white">Account Details</h1>
      <div className="flex overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <TabButton
            key={tab.id}
            active={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            icon={tab.icon}
          >
            {tab.label}
          </TabButton>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className=" text-white p-6 rounded-xl shadow-inner"
      >
        {activeTab === "personal" && (
          <div>
            <KYCVerification></KYCVerification>
          </div>
        )}

        {activeTab === "account" && (
          <div className=" p-5 bg-secondary-700/30 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
              <InputField label="Name of Bank" placeholder="Enter bank name" />
              <InputField
                label="Name of Account Holder"
                placeholder="Enter account holder name"
              />
              <InputField
                label="Account Number"
                placeholder="Enter account number"
              />
              <InputField label="IFSC Code" placeholder="Enter IFSC code" />
              <InputField label="Swift Code" placeholder="Enter Swift code" />
            </div>
            <div className="col-span-full">
              <InputField label="Comments" placeholder="Enter any comments" />
            </div>

            <div className="flex items-center justify-center">
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="mt-8 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-lg"
              >
                Update Bank Details
              </motion.button>
            </div>
          </div>
        )}

        {activeTab === "wallet" && (
          <div>
            <UserWalletDetails></UserWalletDetails>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AccountDetails;
