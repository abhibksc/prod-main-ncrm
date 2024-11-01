import React, { useEffect, useState } from "react";
import { CheckCircle, Edit, Info, Search } from "lucide-react";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

const AccountChallenges = () => {
  const [challengesData, setChallengesData] = useState([]);
  const [selectedChallenge, setSelectedChallenge] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchChallengesData = async () => {
    setLoader(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/get-challenges`
      );
      setChallengesData(res.data.data.reverse());
      setLoader(false);
    } catch (error) {
      console.log("error in fetch user challenges", error);
      toast.error("Data fetching failed!");
      setLoader(false);
    }
  };

  useEffect(() => {
    fetchChallengesData();
  }, []);

  // Reset to first page when search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Enhanced search function
  const filteredData = challengesData?.filter((item) => {
    if (!searchQuery.trim()) return true;

    const searchLower = searchQuery.toLowerCase().trim();

    // List of all searchable fields
    const searchableFields = [
      // User fields
      item?.userId?.firstName,
      item?.userId?.email,
      // Account fields
      item?.mt5Account,
      item?.type,
      item?.accountSize?.toString(),
      item?.leverage?.toString(),
      item?.phase,
      item?.reason,
      item?.status,
    ];

    // Search through all fields
    return searchableFields.some((field) =>
      field?.toLowerCase()?.includes(searchLower)
    );
  });

  // Calculate pagination
  const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData?.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };

  // Handle search input change with debounce
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="m-5 px-10 bg-primary-700 text-white rounded-xl shadow-2xl">
      <div className="py-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-3xl font-bold">Account Challenges</h2>
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search by name, email, account no"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 bg-primary-600 border border-primary-500 rounded-lg focus:outline-none focus:border-primary-400 text-white placeholder-primary-300"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-300"
              size={18}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-300 hover:text-white"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[640px]">
            <thead>
              <tr className="bg-primary-600 rounded text-white">
                <th className="p-3 text-left font-semibold rounded-tl-lg">
                  Name/Email
                </th>
                <th className="p-3 text-left font-semibold">Account No</th>
                <th className="p-3 text-center font-semibold">Account Type</th>
                <th className="p-3 text-center font-semibold">Account Size</th>
                <th className="p-3 text-center font-semibold rounded-tr-lg">
                  Leverage
                </th>
                <th className="p-3 text-center font-semibold">Phase</th>
                <th className="p-3 text-center font-semibold">
                  Dropdown Status
                </th>
                <th className="p-3 text-center font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {loader ? (
                <tr>
                  <td colSpan="9" className="p-4">
                    <div className="flex justify-center items-center w-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-300"></div>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedData?.map((value, index) => (
                  <tr
                    key={index}
                    className="border-b border-primary-200 hover:bg-primary-600/50 transition-colors"
                  >
                    <td className="p-3 text-sm">
                      <div>
                        <p>{value?.userId?.firstName}</p>
                        <p className="text-gray-300">{value?.userId?.email}</p>
                      </div>
                    </td>
                    <td className="p-3 text-sm">{value?.mt5Account}</td>
                    <td className="p-3 text-sm text-center">{value?.type}</td>
                    <td className="p-3 text-sm text-center">
                      {value?.accountSize}
                    </td>
                    <td className="p-3 text-sm text-center">
                      {value?.leverage}
                    </td>
                    <td className="p-3 text-sm text-center">{value?.phase}</td>
                    <td className="p-3 text-sm text-center capitalize">
                      {value?.reason}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          value?.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {value?.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loader && filteredData?.length > 0 && (
          <div className="flex justify-between items-center mt-6 pb-4">
            <div className="text-sm text-primary-300">
              Showing {startIndex + 1} to{" "}
              {Math.min(startIndex + itemsPerPage, filteredData.length)} of{" "}
              {filteredData.length} entries
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-lg bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {getPageNumbers().map((pageNum, idx) => (
                <button
                  key={idx}
                  onClick={() => pageNum !== "..." && setCurrentPage(pageNum)}
                  className={`px-3 py-1 rounded-lg transition-colors ${
                    pageNum === currentPage
                      ? "bg-primary-400 text-white"
                      : pageNum === "..."
                      ? "cursor-default"
                      : "bg-primary-600 hover:bg-primary-500"
                  }`}
                >
                  {pageNum}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-lg bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* No results message */}
        {!loader && filteredData?.length === 0 && (
          <div className="text-center py-8 text-primary-300">
            No results found for "{searchQuery}"
          </div>
        )}
      </div>

      {/* Modal Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-primary-700 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Challenge Details</h3>
            {selectedChallenge && (
              <div className="space-y-2">
                <p>
                  <span className="font-semibold">MT5 Account:</span>{" "}
                  {selectedChallenge.mt5Account}
                </p>
                <p>
                  <span className="font-semibold">Leverage:</span>{" "}
                  {selectedChallenge.leverage}
                </p>
                <p>
                  <span className="font-semibold">Master Password:</span>{" "}
                  {selectedChallenge.masterPassword}
                </p>
                <p>
                  <span className="font-semibold">Investor Password:</span>{" "}
                  {selectedChallenge.masterPassword}
                </p>
              </div>
            )}
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setIsDialogOpen(false)}
                className="px-4 py-2 bg-primary-600 hover:bg-primary-500 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountChallenges;
