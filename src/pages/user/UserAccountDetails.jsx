import React, { useState } from "react";
import { motion } from "framer-motion";
import { CreditCard, User, Wallet } from "lucide-react";
import UserBankDetails from "@/components/user/accountDetails/UserBankDetails";
import UserWalletDetails from "@/components/user/accountDetails/UserWalletDetails";
import UserKycDetails from "@/components/user/accountDetails/UserKycDetails";

const TabButton = ({ active, onClick, children, icon: Icon }) => (
  <motion.button
    whileTap={{ scale: 0.95 }}
    className={`flex items-center px-4 sm:px-6 hover:shadow-2xl py-2 sm:py-3 font-semibold transition-all duration-300 ${
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

const UserAccountDetails = () => {
  const [activeTab, setActiveTab] = useState("personal");

  const tabs = [
    { id: "personal", label: "Kyc Details", icon: User },
    { id: "account", label: "Bank Details", icon: CreditCard },
    { id: "wallet", label: "Wallet Details", icon: Wallet },
  ];

  return (
    <div className="max-w-full sm:max-w-5xl lg:max-w-7xl mx-auto p-4 sm:p-8 bg-secondary-800/30 rounded-2xl shadow-2xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8 text-white">
        Account Details
      </h1>
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
        className="text-white p-4 sm:p-6 rounded-xl shadow-inner"
      >
        {activeTab === "personal" && (
          <div>
            <UserKycDetails />
          </div>
        )}

        {activeTab === "account" && <UserBankDetails />}

        {activeTab === "wallet" && (
          <div>
            <UserWalletDetails />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UserAccountDetails;
