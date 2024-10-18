import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";

const UserTradeAccounts = ({ challengesData }) => {
  return (
    <div className="container mx-auto mt-4 ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">Trade Accounts</h2>\
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="min-w-full bg-primary-700 rounded-lg text-white">
          <thead className=" rounded-lg">
            <tr className="bg-primary-500 uppercase text-sm ">
              <th className="py-3 px-6 text-left">Account No</th>
              <th className="py-3 px-6 text-left">Account Type</th>
              <th className="py-3 px-6 text-left">Deposit</th>
              <th className="py-3 px-6 text-left">Account Size</th>
              {/* <th className="py-3 px-6 text-left">Balance</th> */}
              <th className="py-3 px-6 text-left">Leverage</th>
              <th className="py-3 px-6 text-left">Phase</th>
              <th className="py-3 px-6 text-left">Dropdown status</th>
              <th className="py-3 px-6 text-left">Status</th>
            </tr>
          </thead>
          <tbody className=" text-sm">
            {challengesData?.map((account) => (
              <tr
                key={account.id}
                className="border-b border-gray-200 hover:bg-primary-600/80"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {account?.mt5Account}
                </td>
                <td className="py-3 px-6 text-left">{account?.type}</td>
                <td className="py-3 px-6 text-left">{account?.deposit}</td>
                <td className="py-3 px-6 text-left">{account?.accountSize}</td>
                {/* <td className="py-3 px-6 text-left">{account?.balance}</td> */}
                <td className="py-3 px-6 text-left">{account?.leverage}</td>
                <td className="py-3 px-6 text-left">{account?.phase}</td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {account?.reason}
                </td>
                <td className="py-3 px-6 text-left">{account?.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTradeAccounts;
