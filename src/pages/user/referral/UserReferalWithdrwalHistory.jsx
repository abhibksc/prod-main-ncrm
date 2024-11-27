import { useEffect, useState } from "react";
import { ArrowUpDown } from "lucide-react";

import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const UserReferalWithdrwalHistory = () => {
  const [challengesData, setChallengesData] = useState();
  const [loader, setLoader] = useState(false);
  const logggedUser = useSelector((store) => store.user.loggedUser);

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

  const fetchChallengesData = async () => {
    setLoader(true);
    try {
      const res = await axios.get(
        `${
          import.meta.env.VITE_BECKEND_END_POINT
        }/api/auth/referral-withdrawals`
      );

      const filderedData = res.data.data
        .reverse()
        .filter((value) => value.userId._id === logggedUser._id);

      // console.log("filderedData", filderedData);
      setChallengesData(filderedData);
      setLoader(false);
    } catch (error) {
      console.log("error in fetch user challenges", error);
      toast.error("Data fetching failed!!");
      setLoader(false);
    }
  };
  console.log(challengesData);

  useEffect(() => {
    fetchChallengesData();
  }, []);

  return (
    <div className=" mx-auto sm:p-6 bg-secondary-800/20 rounded-lg shadow-lg overflow-x-auto">
      <div className=" flex items-center gap-2 mb-6 text-3xl font-bold">
        <ArrowUpDown></ArrowUpDown>

        <h1 className=" ">Referral Withdrwal History</h1>
      </div>
      <table className="w-full border-collapse min-w-[640px]">
        <thead>
          <tr className="bg-secondary-700/80 rounded text-white">
            <th className="p-2 sm:p-3 text-left font-semibold rounded-tl-lg">
              Total Amount
            </th>
            <th className="p-2 sm:p-3 text-center font-semibold">
              Withdrawal Amount
            </th>
            <th className="p-2 sm:p-3 text-center font-semibold">Method</th>
            <th className="p-2 sm:p-3 text-center font-semibold">Updated At</th>
            <th className="p-2 sm:p-3 text-center font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {loader && (
            <tr>
              <td colSpan="9" className="p-4">
                <div className="flex justify-center items-center w-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary-400"></div>
                </div>
              </td>
            </tr>
          )}

          {challengesData?.map((value, index) => (
            <tr
              key={index}
              className="border-b border-secondary-700/50 hover:bg-secondary-700/30 transition-colors"
            >
              <td className="p-2 pl-4 sm:p-3 text-sm sm:text-base">
                ${value?.totalBalance}
              </td>
              <td className="p-2 sm:p-3 text-sm sm:text-base text-center ">
                ${value?.amount}
              </td>
              <td className="p-2 text-center sm:p-3 text-sm sm:text-base">
                {value?.method}
              </td>
              <td className="py-3 text-center px-4">
                <div>{formatDate(value?.updatedAt)}</div>
                <div className="text-sm text-gray-400">
                  {calculateTimeSinceJoined(value?.updatedAt)}
                </div>
              </td>
              <td className="text-center py-2 px-2">
                <div
                  className={`inline-block px-3 py-1 font-semibold rounded-full ${
                    value?.status === "pending"
                      ? "bg-yellow-500/20 text-yellow-500"
                      : value?.status === "approved"
                      ? "bg-green-500/10 text-green-500"
                      : value?.status === "rejected"
                      ? " bg-red-500/10  text-red-500"
                      : ""
                  } `}
                >
                  <p className="first-letter:capitalize">{value?.status}</p>
                </div>
              </td>{" "}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserReferalWithdrwalHistory;
