import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { backendApi } from "@/utils/apiClients";
import { Download, FileText, Search } from "lucide-react";
import {
  CFcalculateTimeSinceJoined,
  CFformatDate,
} from "@/utils/CustomFunctions";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";

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
  const [typeFilter, setTypeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [isDownloading, setIsDownloading] = useState(false);

  const fetchData = async () => {
    setLoader(true);
    try {
      const res = await backendApi.get(
        `/get-transfers?page=${currentPage}&limit=${itemsPerPage}&search=${debouncedSearch}&type=${typeFilter}`
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
    setCurrentPage(1);
  }, [debouncedSearch, typeFilter]);

  useEffect(() => {
    fetchData();
  }, [currentPage, debouncedSearch, typeFilter]);

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

  // Download functions
  const prepareDownloadData = () => {
    return loadedData.map((item, index) => ({
      "S.No": index + 1,
      "User Name": `${item?.userData?.firstName || "Unknown"} ${
        item?.userData?.lastName || ""
      }`.trim(),
      Email: item?.userData?.email || "N/A",
      "Transfer Type":
        item?.type?.charAt(0).toUpperCase() + item?.type?.slice(1) || "",
      "From Account": item?.fromAccount || "",
      "To Account": item?.toAccount || "",
      Amount: item?.amount || 0,
      "Transfer Date": CFformatDate(item?.updatedAt),
    }));
  };

  const downloadExcel = () => {
    setIsDownloading(true);
    try {
      const data = prepareDownloadData();
      const ws = XLSX.utils.json_to_sheet(data);

      // Set column widths
      const colWidths = [
        { wch: 8 }, // S.No
        { wch: 20 }, // User Name
        { wch: 25 }, // Email
        { wch: 15 }, // Transfer Type
        { wch: 15 }, // From Account
        { wch: 15 }, // To Account
        { wch: 15 }, // Amount
        { wch: 18 }, // Transfer Date
      ];
      ws["!cols"] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Transfers");

      const fileName = `Transfers_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      XLSX.writeFile(wb, fileName);

      toast.success("Excel file downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download Excel file");
      console.error("Excel download error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadCSV = () => {
    setIsDownloading(true);
    try {
      const data = prepareDownloadData();
      const ws = XLSX.utils.json_to_sheet(data);
      const csv = XLSX.utils.sheet_to_csv(ws);

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `Transfers_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("CSV file downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download CSV file");
      console.error("CSV download error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadPDF = () => {
    setIsDownloading(true);
    try {
      const doc = new jsPDF("l", "mm", "a4"); // landscape orientation

      // Add title
      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text("Funds Transfers Report", 20, 20);

      // Add generation date
      doc.setFontSize(10);
      doc.setFont(undefined, "normal");
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);

      // Prepare table data
      const tableData = loadedData.map((item, index) => [
        index + 1,
        `${item?.userData?.firstName || "Unknown"} ${
          item?.userData?.lastName || ""
        }`.trim(),
        item?.userData?.email || "N/A",
        item?.type?.charAt(0).toUpperCase() + item?.type?.slice(1) || "",
        item?.fromAccount || "",
        item?.toAccount || "",
        item?.amount || 0,
        CFformatDate(item?.updatedAt),
      ]);

      // Add table
      doc.autoTable({
        head: [
          [
            "S.No",
            "User Name",
            "Email",
            "Type",
            "From AC",
            "To AC",
            "Amount",
            "Date",
          ],
        ],
        body: tableData,
        startY: 40,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [41, 128, 185],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        columnStyles: {
          0: { cellWidth: 15 }, // S.No
          1: { cellWidth: 35 }, // User Name
          2: { cellWidth: 45 }, // Email
          3: { cellWidth: 20 }, // Type
          4: { cellWidth: 25 }, // From AC
          5: { cellWidth: 25 }, // To AC
          6: { cellWidth: 25 }, // Amount
          7: { cellWidth: 30 }, // Date
        },
      });

      // Add summary
      const finalY = doc.lastAutoTable.finalY + 20;
      doc.setFontSize(12);
      doc.setFont(undefined, "bold");
      doc.text("Summary:", 20, finalY);

      doc.setFontSize(10);
      doc.setFont(undefined, "normal");
      doc.text(
        `Total Transfers: ${
          paginationData.totalTransfers || loadedData.length
        }`,
        20,
        finalY + 10
      );

      const totalAmount = loadedData.reduce(
        (sum, item) => sum + (parseFloat(item.amount) || 0),
        0
      );
      doc.text(`Total Amount: $${totalAmount.toFixed(2)}`, 20, finalY + 20);

      const fileName = `Transfers_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      doc.save(fileName);

      toast.success("PDF file downloaded successfully!");
    } catch (error) {
      toast.error("Failed to download PDF file");
      console.error("PDF download error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="m-5 p-5 sm:px-6 bg-primary-700/40 text-white rounded-xl shadow-2xl">
      <div className="py-6">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4 flex-wrap w-full">
          <h2 className="text-xl md:text-3xl font-bold">Funds Transfers</h2>

          <div className="flex flex-col md:flex-row gap-4 w-full lg:w-auto">
            {/* Download Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={downloadExcel}
                disabled={isDownloading || loader || loadedData.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 text-sm"
              >
                <FileText size={16} />
                Excel
              </button>

              <button
                onClick={downloadCSV}
                disabled={isDownloading || loader || loadedData.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 text-sm"
              >
                <Download size={16} />
                CSV
              </button>

              <button
                onClick={downloadPDF}
                disabled={isDownloading || loader || loadedData.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 text-sm"
              >
                <FileText size={16} />
                PDF
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
              {/* 🔍 Search Box */}
              <div className="relative w-full sm:w-64">
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

              {/* ⬇️ Type Filter */}
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-primary-600 border border-primary-500 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-400"
              >
                <option value="">All Types</option>
                <option value="internal">Internal</option>
                <option value="p2p">P2P</option>
              </select>
            </div>
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
