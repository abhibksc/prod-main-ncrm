import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpDown, Info, Loader, RefreshCw } from "lucide-react"; // Import refresh icon
import axios from "axios";
import { useSelector } from "react-redux";
import DynamicLoder from "@/components/Loader/DynamicLoder";
import { backendApi } from "@/utils/apiClients";
import { Link } from "react-router-dom";

const UserReferralsDetails = () => {
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const [commissionsData, setCommissionsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Loader state

  // fetch all commissions data------------
  const fetchCommissions = async () => {
    setIsLoading(true); // Start loading
    try {
      const res = await backendApi.get(
        `/user-zone-ibs/${loggedUser?.referralAccount}`
      );
      const commissions = res.data.data.reverse();
      // .filter((value) => value?.referralId === loggedUser.referalId);
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
              <th className="p-3 sm:p-4 text-left text-sm sm:text-base rounded-tl-md ">
                Country
              </th>
              <th className="p-3 sm:p-4 whitespace-nowrap text-center text-sm sm:text-base">
                AC NO
              </th>
              <th className="p-3 whitespace-nowrap sm:p-4 text-center text-sm sm:text-base">
                Level
              </th>
              <th className="p-3 whitespace-nowrap sm:p-4 text-center text-sm sm:text-base">
                Total Volume
              </th>
              <th className="p-3 whitespace-nowrap sm:p-4 text-center text-sm sm:text-base">
                Total Earned
              </th>
              <th className="p-3 whitespace-nowrap sm:p-4 text-center text-sm sm:text-base">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {commissionsData.length === 0 && (
              <tr className="text-red-500 border-b border-secondary-800 hover:bg-secondary-500/10 ">
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
                    <p> {value?.name} </p>
                    <p className="text-gray-400">{value?.email}</p>
                  </div>
                </td>
                <td className="text-sm text-center sm:text-base">
                  <div className=" flex  justify-center items-center">
                    {value?.country || "-"}
                  </div>
                </td>
                <td className="text-sm text-center sm:text-base">
                  {value?.accountNumber}
                </td>
                <td className="text-center text-sm sm:text-base">
                  {value?.level}
                </td>
                <td className="text-center text-sm sm:text-base">
                  {value?.totalLot?.toFixed(2) || "0"}
                </td>
                <td className="text-center text-sm sm:text-base">
                  {value?.totalCommission?.toFixed(2) || "0"}
                </td>
                <td className=" text-sm sm:text-base">
                  <Link
                    to={`/user/referral-close-trades/${value?.accountNumber}`}
                  >
                    <div className="flex justify-center text-blue-500 hover:text-blue-600 hover:scale-105 items-center transition-all">
                      <ArrowRight></ArrowRight>
                    </div>
                  </Link>
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
