import React, { useEffect, useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import axios from "axios";
import DynamicLoder from "@/components/Loader/DynamicLoder";

const UserTradeAccounts = ({ userData }) => {
  // console.log("challenge account -----", challengesData);
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
    <div className=" mx-auto mt-4 ">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-white">User Accounts</h2>
      </div>
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse min-w-[640px]">
          <thead>
            <tr className="bg-primary-500 whitespace-nowrap rounded text-white">
              <th className="p-2 sm:p-3 text-left font-semibold rounded-tl-lg">
                AC NO:
              </th>
              <th className="p-2 sm:p-3 text-center font-semibold">Type</th>
              <th className="p-2 sm:p-3 text-center font-semibold">Leverage</th>
              <th className="p-2 sm:p-3 text-center font-semibold">
                MasterPassword
              </th>
              <th className="p-2 sm:p-3 text-center font-semibold">
                InvestorPassword
              </th>
              <th className="p-2 sm:p-3 text-center font-semibold">Platform</th>
              <th className="p-2 sm:p-3 text-center font-semibold">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody>
            {userData?.accounts?.map((value, index) => (
              <tr
                key={index}
                className="border-b whitespace-nowrap border-secondary-700/50 hover:bg-secondary-700/40 transition-colors"
              >
                <td className="p-2 sm:p-3 text-sm sm:text-base">
                  {value?.accountNumber}
                </td>
                <td className="p-2 sm:p-3 text-sm sm:text-base text-center ">
                  {value?.accountType}
                </td>
                <td className="p-2 text-center sm:p-3 text-sm sm:text-base">
                  {value?.leverage}
                </td>
                <td className="p-2 text-center sm:p-3 text-sm sm:text-base">
                  {value?.masterPassword}
                </td>
                <td className="p-2 text-center sm:p-3 text-sm sm:text-base">
                  {value?.investorPassword}
                </td>
                <td className="p-2 text-center sm:p-3 text-sm sm:text-base">
                  {value?.platform || "N/A"}
                </td>
                <td className="py-3 text-center px-4">
                  <div>{formatDate(value?.createdAt)}</div>
                  <div className="text-sm text-gray-400">
                    {calculateTimeSinceJoined(value?.createdAt)}
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
