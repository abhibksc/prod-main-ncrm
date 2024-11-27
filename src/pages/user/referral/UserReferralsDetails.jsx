import { useEffect, useState } from "react";
import { ArrowUpDown, Info, Loader, RefreshCw } from "lucide-react"; // Import refresh icon
import axios from "axios";
import { useSelector } from "react-redux";
import DynamicLoder from "@/components/Loader/DynamicLoder";

const UserReferralsDetails = () => {
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const [commissionsData, setCommissionsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loader state

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
      hour12: true,
    });
    return `${formattedDate}, ${formattedTime}`;
  }

  // since joined ---------------
  function calculateTimeSinceJoined(isoDateString) {
    const joinDate = new Date(isoDateString);
    const today = new Date();
    const timeDifference = today - joinDate;
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );
    let timeString = [];
    if (days > 0) timeString.push(`${days} day${days !== 1 ? "s" : ""}`);
    if (hours > 0) timeString.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
    if (minutes > 0)
      timeString.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
    if (timeString.length === 0) return "less than a minute ago";
    return timeString.join(", ") + " ago";
  }

  // fetch all commissions data------------
  const fetchCommissions = async () => {
    setIsLoading(true); // Start loading
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/get-commissions`
      );
      const commissions = res.data.data
        .reverse()
        .filter((value) => value?.referralId === loggedUser.referalId);
      setCommissionsData(commissions);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, []);

  return (
    <div className="mx-auto sm:p-6 bg-secondary-800/20 rounded-lg shadow-lg overflow-x-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-3xl font-bold">
          <ArrowUpDown />
          <h1>Referral Details</h1>
        </div>
        {/* Refresh Button */}
        <button
          onClick={fetchCommissions}
          className="flex items-center gap-2 px-4 py-2 text-gray-200 rounded-lg hover:text-secondary-500/80 transition-all"
          disabled={isLoading} // Disable button while loading
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {isLoading ? ( // Render loader when loading
        <div className="flex items-center justify-center py-10">
          <DynamicLoder></DynamicLoder>
        </div>
      ) : (
        <table className="w-full border-collapse min-w-[640px]">
          <thead className="rounded-md overflow-hidden">
            <tr className="bg-secondary-500/20">
              <th className="p-3 sm:p-4 text-left text-sm sm:text-base rounded-tl-md ">
                Name/Email
              </th>
              <th className="p-3 sm:p-4 whitespace-nowrap text-center text-sm sm:text-base">
                AC NO
              </th>
              <th className="p-3 whitespace-nowrap  sm:p-4 text-center text-sm sm:text-base">
                AC Type
              </th>
              <th className="p-3 whitespace-nowrap sm:p-4 text-center text-sm sm:text-base">
                Country
              </th>
              <th className="p-3 whitespace-nowrap sm:p-4 text-center text-sm sm:text-base">
                Deposit
              </th>
              <th className="p-3 whitespace-nowrap sm:p-4 text-center text-sm sm:text-base">
                Account Size
              </th>
              <th className="p-3 whitespace-nowrap sm:p-4 text-center text-sm sm:text-base">
                Commission
              </th>
              <th className="p-3 whitespace-nowrap sm:p-4 text-center text-sm sm:text-base rounded-tr-md">
                Time Stamp
              </th>
            </tr>
          </thead>
          <tbody>
            {commissionsData.length === 0 && (
              <tr className="text-red-500 border-b border-secondary-800 hover:bg-secondary-500/10">
                <td className="text-center align-middle py-6" colSpan="8">
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2">
                    <Info />
                    <p>No data found</p>
                  </div>
                </td>
              </tr>
            )}
            {commissionsData?.map((value) => (
              <tr
                key={value._id}
                className="text-gray-200 border-b border-secondary-800 hover:bg-secondary-500/10"
              >
                <td className="pl-6 py-3 text-sm sm:text-base">
                  <div>
                    <p> {value?.currentReferral?.firstName} </p>
                    <p className="text-gray-400">
                      {value?.currentReferral?.email}
                    </p>
                  </div>
                </td>
                <td className="text-sm text-center sm:text-base">
                  {value?.mt5Account}
                </td>
                <td className="text-center text-sm sm:text-base">
                  {value?.accountType}
                </td>
                <td className="text-center text-sm sm:text-base">
                  {value?.currentReferral?.country || "null"}
                </td>
                <td className="text-center text-sm sm:text-base">
                  ${value?.accountSize}
                </td>
                <td className="text-center text-sm sm:text-base">
                  ${value?.depositBalance}
                </td>
                <td className="text-center text-sm sm:text-base">
                  ${value?.commission}
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
      )}
    </div>
  );
};

export default UserReferralsDetails;
