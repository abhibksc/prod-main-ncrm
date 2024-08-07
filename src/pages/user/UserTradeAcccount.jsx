import React from "react";
import { CheckCircle, Edit } from "lucide-react";

const UserTradeAccount = () => {
  const headers = [
    "Account",
    "Main Password",
    "Investor Password",
    "Group",
    "Balance",
    "Equity",
    "Leverage",
    "Live Status",
    "Action",
  ];
  const accountData = {
    account: "9784512772435",
    mainPassword: "imZmy2EW@CFT6399",
    investorPassword: "jrwH2dYH@CFT2512",
    group: "VIP",
    balance: "57225",
    equity: "57225",
    leverage: "30",
    liveStatus: true,
  };

  return (
    <div className="max-w-7xl mx-auto p-6 bg-secondary-800 rounded-lg shadow-lg">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-secondary-600 text-white">
            {headers.map((header, index) => (
              <th key={index} className="p-3 text-left font-semibold">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-gray-200 hover:bg-secondary-700/60 transition-colors">
            <td className="p-3">{accountData.account}</td>
            <td className="p-3">{accountData.mainPassword}</td>
            <td className="p-3">{accountData.investorPassword}</td>
            <td className="p-3">{accountData.group}</td>
            <td className="p-3">{accountData.balance}</td>
            <td className="p-3">{accountData.equity}</td>
            <td className="p-3">{accountData.leverage}</td>
            <td className="p-3">
              <CheckCircle className="text-green-500" size={24} />
            </td>
            <td className="p-3">
              <button className="text-blue-600 hover:text-blue-800 transition-colors">
                <Edit size={20} />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default UserTradeAccount;
