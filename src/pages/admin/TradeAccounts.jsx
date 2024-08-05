import React from "react";
import { Edit, Download } from "lucide-react";

const tradeAccounts = [
  {
    accountNumber: "9784512772806",
    user: "Ashar Sajjad",
    initialDeposit: "100000 USD",
    fundedPlan: "FUNDED (LIVE)",
    equity: "0 USD",
    phase: 1,
    dailyLossLimit: "3000 USD",
    maxLossLimit: "6000 USD",
    status: "Inactive",
    tags: "Tags",
  },
  {
    accountNumber: "9784512772805",
    user: "Ashar Sajjad",
    initialDeposit: "100000 USD",
    fundedPlan: "FUNDED (LIVE)",
    equity: "0 USD",
    phase: 1,
    dailyLossLimit: "3000 USD",
    maxLossLimit: "6000 USD",
    status: "Inactive",
    tags: "Tags",
  },
  {
    accountNumber: "9784512772435",
    user: "Awais Sharif",
    initialDeposit: "50000 USD",
    fundedPlan: "ONE STEP EVALUATION",
    equity: "0 USD",
    phase: 1,
    dailyLossLimit: "1500 USD",
    maxLossLimit: "3000 USD",
    status: "Passed",
    tags: "Tags",
  },
  // Add more sample data here...
];

const TradeAccounts = () => {
  return (
    <div className="container mx-auto p-10">
      <h1 className="text-2xl font-bold mb-4 text-white">Trade Account List</h1>
      <div className="mb-4">
        <button className="bg-green-500 text-white px-4 py-2 rounded mr-2 transition duration-300 hover:bg-green-600">
          Phase 1
        </button>
        <button className="bg-teal-500 text-white px-4 py-2 rounded mr-2 transition duration-300 hover:bg-teal-600">
          Phase 2
        </button>
        <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2 transition duration-300 hover:bg-blue-600">
          Live
        </button>
        <button className="bg-blue-600 text-white px-4 py-2 rounded mr-2 transition duration-300 hover:bg-blue-700">
          Active
        </button>
        <button className="bg-red-500 text-white px-4 py-2 rounded mr-2 transition duration-300 hover:bg-red-700">
          Breached
        </button>
        <button className="bg-green-600 text-white px-4 py-2 rounded mr-2 transition duration-300 hover:bg-green-700">
          Passed
        </button>
        <button className="border border-green-500 text-green-500 px-4 py-2 rounded float-right transition duration-300 hover:bg-green-500 hover:text-white">
          Clear Filter
        </button>
      </div>
      <table className="w-full rounded shadow-md">
        <thead className="bg-primary-400 rounded text-white">
          <tr>
            <th className="py-2 px-4 whitespace-nowrap text-left">Account #</th>
            <th className="py-2 px-4 whitespace-nowrap text-left">User</th>
            <th className="py-2 px-4 whitespace-nowrap text-left">
              Initial Deposit
            </th>
            <th className="py-2 px-4 whitespace-nowrap text-left">
              Funded Plan
            </th>
            <th className="py-2 px-4 whitespace-nowrap text-left">Equity</th>
            <th className="py-2 px-4 whitespace-nowrap text-left">Phase</th>
            <th className="py-2 px-4 whitespace-nowrap text-left">
              Daily Loss Limit
            </th>
            <th className="py-2 px-4 whitespace-nowrap text-left">
              Max Loss Limit
            </th>
            <th className="py-2 px-4 whitespace-nowrap text-left">Status</th>
            <th className="py-2 px-4 whitespace-nowrap text-left">Tags</th>
            <th className="py-2 px-4 whitespace-nowrap text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-white rounded-lg">
          {tradeAccounts.map((account, index) => (
            <tr
              key={index}
              className={
                index % 2 === 0 ? "bg-primary-700" : "bg-primary-700/40"
              }
            >
              <td className="py-2 px-4">{account.accountNumber}</td>
              <td className="py-2 px-4">{account.user}</td>
              <td className="py-2 px-4">{account.initialDeposit}</td>
              <td className="py-2 px-4">{account.fundedPlan}</td>
              <td className="py-2 px-4">{account.equity}</td>
              <td className="py-2 px-4">{account.phase}</td>
              <td className="py-2 px-4">{account.dailyLossLimit}</td>
              <td className="py-2 px-4">{account.maxLossLimit}</td>
              <td className="py-2 px-4">
                <span
                  className={`px-2 py-1 rounded ${
                    account.status === "Inactive"
                      ? "bg-red-100 text-red-800"
                      : account.status === "Passed"
                      ? "bg-green-100 text-green-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {account.status}
                </span>
              </td>
              <td className="py-2 px-4">{account.tags}</td>
              <td className="py-2 px-4 mt-4 flex space-x-2">
                <button className="text-white hover:text-primary-100 transition duration-300 hover:scale-110">
                  <Edit size={18} />
                </button>
                <button className="text-white hover:text-primary-100 transition duration-300 hover:scale-110">
                  <Download size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TradeAccounts;
