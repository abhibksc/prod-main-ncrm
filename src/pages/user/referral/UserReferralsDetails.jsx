// Enhanced version of UserReferralsDetails.jsx
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Info,
  Loader2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useSelector } from "react-redux";
import DynamicLoder from "@/components/Loader/DynamicLoder";
import { backendApi } from "@/utils/apiClients";
import { Link } from "react-router-dom";
import ModernHeading from "@/lib/ModernHeading";
import { useGetInfoByAccounts } from "@/hooks/user/UseGetInfoByAccounts";

const ITEMS_PER_PAGE = 10;

const UserReferralsDetails = () => {
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const [commissionsData, setCommissionsData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedEmails, setExpandedEmails] = useState({});
  const [currentPage, setCurrentPage] = useState(1);

  const allAccounts = commissionsData.map((v) => Number(v.accountNumber));
  useGetInfoByAccounts(allAccounts, "ib");
  const { ibAccountsData } = useSelector((store) => store.user);

  const fetchCommissions = async () => {
    setIsLoading(true);
    try {
      const res = await backendApi.get(
        `/user-zone-ibs/${loggedUser?.referralAccount}`
      );
      setCommissionsData(res.data.data.reverse());
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCommissions();
  }, []);

  const toggleDropdown = (email) => {
    setExpandedEmails((prev) => ({ ...prev, [email]: !prev[email] }));
  };

  const filteredData = commissionsData.filter(
    (item) =>
      item.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedData = filteredData.reduce((acc, item) => {
    const key = item.email;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});

  const paginatedEmails = Object.keys(groupedData).slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const totalPages = Math.ceil(
    Object.keys(groupedData).length / ITEMS_PER_PAGE
  );

  return (
    <div className="mx-auto sm:p-6 md:bg-secondary-800/20 rounded-lg md:shadow-lg overflow-x-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.history.back()}
            className="flex items-center mt-2 gap-2 rounded-xl border-b px-5 py-1 hover:px-6 border-secondary-500 text-secondary-500  transition-all"
          >
            <ArrowLeft size={20} /> Back
          </button>
          <div className="text-3xl font-bold">
            <ModernHeading text="IB Users" />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-3 py-1 rounded-md border border-secondary-700/70 bg-secondary-900 text-gray-200"
          />
          <button
            onClick={fetchCommissions}
            className="flex items-center gap-2 px-4 py-2 text-gray-200 rounded-lg hover:text-secondary-500/80 transition-all"
            disabled={isLoading}
          >
            <RefreshCw
              className={`w-5 h-5 ${isLoading ? "animate-spin" : ""}`}
            />
            {isLoading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <DynamicLoder />
        </div>
      ) : (
        <table className="w-full border-collapse min-w-[640px]">
          <thead>
            <tr className="bg-secondary-500-20">
              <th className="p-3 text-left">Name/Email</th>
              <th className="p-3 text-center">Country</th>
              <th className="p-3 text-center">AC NO</th>
              <th className="p-3 text-center">Live Equity</th>
              <th className="p-3 text-center">Level</th>
              <th className="p-3 text-center">Total Volume</th>
              <th className="p-3 text-center">Total Earned</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedEmails.length === 0 && (
              <tr className="text-red-500">
                <td colSpan="8" className="text-center py-6">
                  <div className="flex items-center justify-center gap-2">
                    <Info /> No data found
                  </div>
                </td>
              </tr>
            )}
            {paginatedEmails.map((email) => {
              const users = groupedData[email];
              const isExpanded = expandedEmails[email];
              return (
                <>
                  <tr
                    key={email}
                    className="border-b border-secondary-800 bg-secondary-700/10 hover:bg-secondary-500-10"
                  >
                    <td
                      className="pl-6 py-3 cursor-pointer"
                      onClick={() => toggleDropdown(email)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p>{users[0]?.name}</p>
                          <p className="text-gray-400">{email}</p>
                        </div>
                        {users.length > 1 &&
                          (isExpanded ? <ChevronUp /> : <ChevronDown />)}
                      </div>
                    </td>
                    <td className="text-center">{users[0]?.country || "-"}</td>
                    <td className="text-center">{users[0]?.accountNumber}</td>
                    <td className="text-green-400 text-center">
                      {+users[0]?.accountNumber <= 0
                        ? "--"
                        : ibAccountsData?.find(
                            (item) =>
                              item.MT5Account === +users[0]?.accountNumber
                          )?.Equity ?? (
                            <Loader2 className="animate-spin mx-auto" />
                          )}
                    </td>
                    <td className="text-center">{users[0]?.level}</td>
                    <td className="text-center">
                      {users[0]?.totalLot?.toFixed(4) || "0"}
                    </td>
                    <td className="text-center">
                      {users[0]?.totalCommission?.toFixed(4) || "0"}
                    </td>
                    <td className="text-center">
                      <Link
                        to={`/user/referral-close-trades/${users[0]?.accountNumber}?level=${users[0]?.level}`}
                      >
                        <ArrowRight className="text-blue-500 hover:text-blue-600 hover:scale-105 transition-all" />
                      </Link>
                    </td>
                  </tr>
                  {isExpanded &&
                    users.slice(1).map((user) => (
                      <tr
                        key={user._id}
                        className="border-b border-secondary-800 hover:bg-secondary-500-10"
                      >
                        <td className="pl-12 py-2">
                          <p>{user.name}</p>
                          <p className="text-gray-400">{user.email}</p>
                        </td>
                        <td className="text-center">{user.country || "-"}</td>
                        <td className="text-center">{user.accountNumber}</td>
                        <td className="text-green-400 text-center">
                          {+user.accountNumber <= 0
                            ? "--"
                            : ibAccountsData?.find(
                                (item) =>
                                  item.MT5Account === +user.accountNumber
                              )?.Equity ?? (
                                <Loader2 className="animate-spin mx-auto" />
                              )}
                        </td>
                        <td className="text-center">{user.level}</td>
                        <td className="text-center">
                          {user.totalLot?.toFixed(4) || "0"}
                        </td>
                        <td className="text-center">
                          {user.totalCommission?.toFixed(4) || "0"}
                        </td>
                        <td className="text-center">
                          <Link
                            to={`/user/referral-close-trades/${user.accountNumber}?level=${user.level}`}
                          >
                            <ArrowRight className="text-blue-500 hover:text-blue-600 hover:scale-105 transition-all" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                </>
              );
            })}
          </tbody>
        </table>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 py-4">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-1 border border-secondary-700 rounded text-secondary-400 disabled:opacity-30"
          >
            Prev
          </button>
          <span className="text-gray-300">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
            className="px-4 py-1 border border-secondary-700 rounded text-secondary-400 disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default UserReferralsDetails;
