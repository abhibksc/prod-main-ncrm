import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { backendApi } from "@/utils/apiClients";
import { Search } from "lucide-react";
import {
  CFcalculateTimeSinceJoined,
  CFformatDate,
} from "@/utils/CustomFunctions";

// Debounce hook
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const Transfers = () => {
  const [loadedData, setLoadedData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [loader, setLoader] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const debouncedSearch = useDebounce(searchQuery, 500);

  const fetchData = async () => {
    setLoader(true);
    try {
      const res = await backendApi.get(
        `/get-transfers?page=${currentPage}&limit=${itemsPerPage}&search=${debouncedSearch}`
      );
      setLoadedData(res.data.data);
      setPaginationData(res.data.pagination || {});
    } catch (error) {
      console.log("error in fetch transfers", error);
      toast.error("Data fetching failed!");
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1); // reset to page 1 on new search
  }, [debouncedSearch]);

  useEffect(() => {
    fetchData();
  }, [currentPage, debouncedSearch]);

  const getPageNumbers = () => {
    const totalPages = paginationData.totalPages || 1;
    const pageNumbers = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pageNumbers.push(i);
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pageNumbers.push(i);
      } else {
        pageNumbers.push(1, "...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++)
          pageNumbers.push(i);
        pageNumbers.push("...", totalPages);
      }
    }

    return pageNumbers;
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="m-5 p-5 sm:px-6 bg-primary-700/40 text-white rounded-xl shadow-2xl">
      <div className="py-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h2 className="text-xl md:text-3xl font-bold">Funds Transfers</h2>
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search by mail/name"
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 bg-primary-600 border border-primary-500 rounded-lg focus:outline-none focus:border-primary-400 text-white placeholder-gray-300"
            />
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300"
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
              <tr className="bg-primary-600 text-white">
                <th className="p-3 text-left font-semibold rounded-tl-lg">
                  Name/Email
                </th>
                <th className="p-3 text-center font-semibold">Type</th>
                <th className="p-3 text-center font-semibold">From AC</th>
                <th className="p-3 text-center font-semibold">To AC</th>
                <th className="p-3 text-center font-semibold">Amount</th>
                <th className="p-3 text-center font-semibold">Timestamp</th>
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
                loadedData?.map((value, index) => (
                  <tr
                    key={index}
                    className="border-b border-primary-500/50 hover:bg-primary-600/50 transition-colors"
                  >
                    <td className="p-3 text-sm">
                      <div>
                        <p>
                          {value?.userData?.firstName || "Unknown"}{" "}
                          {value?.userData?.lastName || ""}
                        </p>
                        <p className="text-gray-300/80">
                          {value?.userData?.email || "N/A"}
                        </p>
                      </div>
                    </td>
                    <td className="p-3 text-sm text-center capitalize">
                      {value?.type}
                    </td>
                    <td className="p-3 text-sm text-center">
                      {value?.fromAccount}
                    </td>
                    <td className="p-3 text-sm text-center">
                      {value?.toAccount}
                    </td>
                    <td className="p-3 text-sm text-center">{value?.amount}</td>
                    <td className="py-3 text-center whitespace-nowrap px-4">
                      <div>{CFformatDate(value?.updatedAt)}</div>
                      <div className="text-sm text-gray-400">
                        {CFcalculateTimeSinceJoined(value?.updatedAt)}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loader && loadedData?.length > 0 && (
          <div className="flex flex-wrap justify-between items-center mt-6 pb-4">
            <div className="text-sm text-primary-300 mb-2 sm:mb-0">
              Showing page {paginationData.currentPage} of{" "}
              {paginationData.totalPages} — Total:{" "}
              {paginationData.totalTransfers}
            </div>
            <div className="flex flex-wrap items-center space-x-2">
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
                  setCurrentPage((prev) =>
                    Math.min(prev + 1, paginationData.totalPages || 1)
                  )
                }
                disabled={currentPage === paginationData.totalPages}
                className="px-3 py-1 rounded-lg bg-primary-600 hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {!loader && loadedData?.length === 0 && (
          <div className="text-center py-8 text-primary-300">
            No results found for "{searchQuery}"
          </div>
        )}
      </div>
    </div>
  );
};

export default Transfers;
