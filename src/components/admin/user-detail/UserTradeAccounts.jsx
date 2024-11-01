import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";

const UserTradeAccounts = ({ challengesData }) => {
  console.log("challenge account -----", challengesData);
  // format date ---------------------

  function formatDate(isoDateString) {
    const date = new Date(isoDateString);

    const formattedDate = date.toLocaleDateString("en-GB", {
      year: "numeric",
      day: "2-digit",
      month: "2-digit",
    });

    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // 12-hour format with AM/PM
    });

    return `${formattedDate}, ${formattedTime}`;
  }
  // since joined ---------------

  function calculateTimeSinceJoined(isoDateString) {
    const joinDate = new Date(isoDateString);
    const today = new Date();

    // Calculate the difference in time (in milliseconds)
    const timeDifference = today - joinDate;

    // Calculate different time units
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );

    // Build the time string
    let timeString = [];

    if (days > 0) {
      timeString.push(`${days} day${days !== 1 ? "s" : ""}`);
    }
    if (hours > 0) {
      timeString.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
    }
    if (minutes > 0) {
      timeString.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
    }

    // Handle case when less than a minute
    if (timeString.length === 0) {
      return "less than a minute ago";
    }

    return timeString.join(", ") + " ago";
  }
  // console.log("challenges data --", challengesData);
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
              <th className="py-3 px-6 text-left">Account Size</th>
              <th className="py-3 px-6 text-left">Balance</th>
              <th className="py-3 px-6 text-left">Leverage</th>
              <th className="py-3 px-6 text-left">Phase</th>
              <th className="py-3 px-6 text-left">Dropdown status</th>
              <th className="py-3 px-6 text-left">Updated At</th>
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
                <td className="py-3 px-6 text-left">{account?.accountSize}</td>
                <td className="py-3 px-6 text-left">{account?.balance}</td>
                {/* <td className="py-3 px-6 text-left">{account?.balance}</td> */}
                <td className="py-3 px-6 text-left">{account?.leverage}</td>
                <td className="py-3 px-6 text-left">{account?.phase}</td>
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {account?.reason}
                </td>

                <td className="py-3 px-4">
                  <div>{formatDate(account?.updatedAt)}</div>
                  <div className="text-sm text-gray-400">
                    {calculateTimeSinceJoined(account?.updatedAt)}
                  </div>
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
