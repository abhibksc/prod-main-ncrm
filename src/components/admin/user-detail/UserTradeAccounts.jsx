import React from "react";
import { Pencil, Trash2 } from "lucide-react";

const dummyData = [
  {
    id: 1,
    account: "9784512772333",
    mainPassword: "5e7uBMPx",
    investorPassword: "ZYhBgvb4",
    group: "VIP",
    balance: 100000,
    phase: 1,
    initialDeposit: 100000,
    equity: 100000,
    leverage: 30,
  },
  {
    id: 2,
    account: "9784512772399",
    mainPassword: "crxv8UwO",
    investorPassword: "IrQGP6EW",
    group: "VIP",
    balance: 100000,
    phase: 1,
    initialDeposit: 100000,
    equity: 100000,
    leverage: 30,
  },
  {
    id: 2,
    account: "9784512772399",
    mainPassword: "crxv8UwO",
    investorPassword: "IrQGP6EW",
    group: "VIP",
    balance: 100000,
    phase: 1,
    initialDeposit: 100000,
    equity: 100000,
    leverage: 30,
  },
  {
    id: 2,
    account: "9784512772399",
    mainPassword: "crxv8UwO",
    investorPassword: "IrQGP6EW",
    group: "VIP",
    balance: 100000,
    phase: 1,
    initialDeposit: 100000,
    equity: 100000,
    leverage: 30,
  },
  {
    id: 2,
    account: "9784512772399",
    mainPassword: "crxv8UwO",
    investorPassword: "IrQGP6EW",
    group: "VIP",
    balance: 100000,
    phase: 1,
    initialDeposit: 100000,
    equity: 100000,
    leverage: 30,
  },
  {
    id: 2,
    account: "9784512772399",
    mainPassword: "crxv8UwO",
    investorPassword: "IrQGP6EW",
    group: "VIP",
    balance: 100000,
    phase: 1,
    initialDeposit: 100000,
    equity: 100000,
    leverage: 30,
  },
];

const UserTradeAccounts = () => {
  return (
    <div className="container mx-auto p-6 ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Trade Accounts</h2>\
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="min-w-full bg-primary-700 rounded-lg text-white">
          <thead className=" rounded-lg">
            <tr className="bg-primary-500 uppercase text-sm ">
              <th className="py-3 px-6 text-left">Sr</th>
              <th className="py-3 px-6 text-left">Account</th>
              <th className="py-3 px-6 text-left">Main Password</th>
              <th className="py-3 px-6 text-left">Investor Password</th>
              <th className="py-3 px-6 text-left">Group</th>
              <th className="py-3 px-6 text-left">Balance</th>
              <th className="py-3 px-6 text-left">Phase</th>
              <th className="py-3 px-6 text-left">Initial Deposit</th>
              <th className="py-3 px-6 text-left">Equity</th>
              <th className="py-3 px-6 text-left">Leverage</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className=" text-sm">
            {dummyData.map((account) => (
              <tr
                key={account.id}
                className="border-b border-gray-200 hover:bg-primary-600/80"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {account.id}
                </td>
                <td className="py-3 px-6 text-left">{account.account}</td>
                <td className="py-3 px-6 text-left">{account.mainPassword}</td>
                <td className="py-3 px-6 text-left">
                  {account.investorPassword}
                </td>
                <td className="py-3 px-6 text-left">{account.group}</td>
                <td className="py-3 px-6 text-left">{account.balance}</td>
                <td className="py-3 px-6 text-left">{account.phase}</td>
                <td className="py-3 px-6 text-left">
                  {account.initialDeposit}
                </td>
                <td className="py-3 px-6 text-left">{account.equity}</td>
                <td className="py-3 px-6 text-left">{account.leverage}</td>
                <td className="py-3 px-6 text-left">
                  <div className="flex items-center">
                    <button className="text-red-500 hover:text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTradeAccounts;
