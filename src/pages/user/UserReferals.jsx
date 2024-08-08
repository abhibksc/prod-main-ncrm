import React, { useState } from "react";
import { Copy, Check, ChevronDown, Smile } from "lucide-react";

const UserReferal = () => {
  const [activeTab, setActiveTab] = useState("referrals");
  const [level, setLevel] = useState("Level 1");
  const [isCopied, setIsCopied] = useState(false);

  const referralLink = "https://portal.fundedltd.com?ref=rdDU6k";

  const TabButton = ({ label, isActive, onClick }) => (
    <button
      className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
        isActive
          ? "bg-secondary-600 text-white shadow-lg"
          : "text-white hover:bg-secondary-700"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset the icon and text after 2 seconds
    });
  };

  const ReferralsView = () => (
    <div className="space-y-6 rounded-xl">
      <div className="bg-secondary-800 p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
        <h3 className="font-semibold text-lg mb-4">Referral Link</h3>
        <div className="flex items-center bg-gray-100 p-3 rounded-lg">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="flex-grow bg-transparent outline-none text-gray-700"
          />
          <button
            onClick={copyToClipboard}
            className="ml-4 bg-secondary-600 text-white px-4 py-2 rounded-lg hover:bg-secondary-700 transition-colors duration-300 flex items-center"
          >
            {isCopied ? <Check size={20} /> : <Copy size={20} />}
            {isCopied && <span className="ml-2">Copied</span>}
          </button>
        </div>
        <p className="text-sm text-yellow-500 font-semibold mt-3 flex items-center">
          <Smile className="mr-2" size={18} />
          Share this link to invite your friends and earn commissions.
        </p>
      </div>
      <div className="bg-secondary-700/80 p-4 rounded-xl shadow-lg flex items-center justify-center transition-all duration-300 hover:shadow-xl">
        <span className="text-lg">ⓘ Data not found</span>
      </div>
    </div>
  );

  const CommissionView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Total Commission: 0</h2>
      <div className="bg-secondary-800 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <h3 className="font-semibold text-lg p-6 border-b">
          Commission Details
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-700 text-white">
              <tr>
                <th className="p-4 text-left">Client</th>
                <th className="p-4 text-left">Amount</th>
                <th className="p-4 text-left">Type</th>
                <th className="p-4 text-left">Transferred At</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-gray-400 text-center">
                <td colSpan="4" className="p-4">
                  No commission data available
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-8 rounded-xl bg-secondary-800/60">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 space-y-4 sm:space-y-0">
        <div className="space-x-4">
          <TabButton
            label="Referrals"
            isActive={activeTab === "referrals"}
            onClick={() => setActiveTab("referrals")}
          />
          <TabButton
            label="Commission"
            isActive={activeTab === "commission"}
            onClick={() => setActiveTab("commission")}
          />
        </div>
        <div className="relative">
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="appearance-none bg-secondary-600 rounded-lg py-3 pl-4 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all duration-300"
          >
            <option className="">Level 1</option>
            <option>Level 2</option>
            <option>Level 3</option>
          </select>
          <ChevronDown
            className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none"
            size={20}
          />
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-8">Affiliate Portal</h1>
      {activeTab === "referrals" ? <ReferralsView /> : <CommissionView />}
    </div>
  );
};

export default UserReferal;
