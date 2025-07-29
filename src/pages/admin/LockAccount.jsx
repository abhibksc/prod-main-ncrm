import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { backendApi } from "@/utils/apiClients";
import {
  Download,
  FileText,
  Search,
  Lock,
  Calendar,
  DollarSign,
  Edit,
  Plus,
  Trash2,
} from "lucide-react";
import {
  CFcalculateTimeSinceJoined,
  CFformatDate,
} from "@/utils/CustomFunctions";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

const LockAccount = () => {
  const [loadedData, setLoadedData] = useState([]);
  const [paginationData, setPaginationData] = useState({});
  const [loader, setLoader] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const debouncedSearch = useDebounce(searchQuery, 500);
  const [isDownloading, setIsDownloading] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isEditLoading, setIsEditLoading] = useState(false);
  const [editFormData, setEditFormData] = useState({
    accountNumber: "",
    active: true,
    isLocked: true,
    amount: "",
    comment: "",
  });
  const [isNewLockDialogOpen, setIsNewLockDialogOpen] = useState(false);
  const [isNewLockLoading, setIsNewLockLoading] = useState(false);
  const [newLockFormData, setNewLockFormData] = useState({
    accountNumber: "",
    active: true,
    isLocked: true,
    amount: "",
    comment: "",
  });
  //   fetch data ---------

  const fetchData = async () => {
    setLoader(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: itemsPerPage.toString(),
      });

      if (debouncedSearch) {
        params.append("search", debouncedSearch);
      }

      if (statusFilter) {
        params.append("status", statusFilter);
      }

      const { data } = await backendApi.get(`/lock-accounts?${params}`);
      //   console.log("res", data);

      setLoadedData(data.users || []);
      setPaginationData({
        currentPage: data.currentPage || 1,
        totalPages: data.totalPages || 1,
        totalAccounts: data.totalUsers || 0,
        totalLocks: data.totalLocks || 0,
      });
      setLoader(false);
    } catch (error) {
      console.log("error in fetch locked accounts", error);
      toast.error("Data fetching failed!");
      setLoader(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [currentPage, debouncedSearch, statusFilter]);

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
    const flatData = [];
    loadedData.forEach((user, userIndex) => {
      user.accounts.forEach((account, accountIndex) => {
        flatData.push({
          "S.No": flatData.length + 1,
          "User Name": `${user.firstName || "Unknown"} ${
            user.lastName || ""
          }`.trim(),
          Email: user.email || "N/A",
          "Account Number": account.accountNumber || "",
          "Account Type": account.accountType || "",
          Platform: account.platform || "",
          "Locked Amount": account.lockInfo.amount || 0,
          "Lock Status": account.lockInfo.active ? "Active" : "Expired",
          "Locked On": CFformatDate(account.lockInfo.lockedOn),
          "Locked Till": CFformatDate(account.lockInfo.lockedTill),
          Comment: account.lockInfo.comment || "",
        });
      });
    });
    return flatData;
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
        { wch: 15 }, // Account Number
        { wch: 15 }, // Account Type
        { wch: 12 }, // Platform
        { wch: 15 }, // Locked Amount
        { wch: 12 }, // Lock Status
        { wch: 18 }, // Locked On
        { wch: 18 }, // Locked Till
        { wch: 30 }, // Comment
      ];
      ws["!cols"] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Locked Accounts");

      const fileName = `Locked_Accounts_${
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
        `Locked_Accounts_${new Date().toISOString().split("T")[0]}.csv`
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
      doc.text("Locked Accounts Report", 20, 20);

      // Add generation date
      doc.setFontSize(10);
      doc.setFont(undefined, "normal");
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);

      // Prepare table data
      const tableData = prepareDownloadData().map((item) => [
        item["S.No"],
        item["User Name"],
        item["Email"],
        item["Account Number"],
        item["Account Type"],
        item["Locked Amount"],
        item["Lock Status"],
        item["Locked On"],
        item["Comment"],
      ]);

      // Add table
      doc.autoTable({
        head: [
          [
            "S.No",
            "User Name",
            "Email",
            "Account No",
            "Type",
            "Amount",
            "Status",
            "Locked On",
            "Comment",
          ],
        ],
        body: tableData,
        startY: 40,
        styles: {
          fontSize: 8,
          cellPadding: 2,
        },
        headStyles: {
          fillColor: [220, 53, 69],
          textColor: 255,
          fontStyle: "bold",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        columnStyles: {
          0: { cellWidth: 15 }, // S.No
          1: { cellWidth: 30 }, // User Name
          2: { cellWidth: 40 }, // Email
          3: { cellWidth: 25 }, // Account No
          4: { cellWidth: 20 }, // Type
          5: { cellWidth: 20 }, // Amount
          6: { cellWidth: 20 }, // Status
          7: { cellWidth: 25 }, // Locked On
          8: { cellWidth: 50 }, // Comment
        },
      });

      const fileName = `Locked_Accounts_${
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

  const isAccountExpired = (lockedTill) => {
    return new Date(lockedTill) < new Date();
  };

  const handleEditClick = (user, account) => {
    setSelectedAccount({ user, account });
    setEditFormData({
      accountNumber: account.accountNumber,
      active: account.lockInfo.active,
      isLocked: account.lockInfo.isLocked,
      amount: account.lockInfo.amount,
      comment: account.lockInfo.comment,
    });
    setIsEditDialogOpen(true);
  };
  //   edit  form change ----------

  const handleEditFormChange = (field, value) => {
    setEditFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
  //   edit  handler ----------

  const handleEditSubmit = async () => {
    if (isEditLoading) return;

    const toastId = toast.loading("Updating account lock...");
    setIsEditLoading(true);

    try {
      await backendApi.post("/lock-account", editFormData);
      setIsEditDialogOpen(false);
      toast.success("Account lock updated successfully!", { id: toastId });
      fetchData();
    } catch (error) {
      console.error("Error updating account lock:", error);
      toast.error("Failed to update account lock", { id: toastId });
    } finally {
      setIsEditLoading(false);
    }
  };
  //   delete handler ----------
  const handleDeleteLock = async () => {
    if (isEditLoading) return;

    // Browser confirmation dialog
    const confirmed = window.confirm(
      "Are you sure you want to deactivate this account lock? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    const toastId = toast.loading("Deactivating account lock...");
    setIsEditLoading(true);

    try {
      const deleteData = {
        ...editFormData,
        active: false,
        isLocked: false,
      };
      await backendApi.post("/lock-account", deleteData);

      setIsEditDialogOpen(false);
      toast.success("Account lock deactivated successfully!", { id: toastId });
      fetchData();
    } catch (error) {
      console.error("Error deactivating account lock:", error);
      toast.error("Failed to deactivate account lock", { id: toastId });
    } finally {
      setIsEditLoading(false);
    }
  };

  const handleNewLockClick = () => {
    setNewLockFormData({
      accountNumber: "",
      active: true,
      isLocked: true,
      amount: "",
      comment: "",
    });
    setIsNewLockDialogOpen(true);
  };

  const handleNewLockFormChange = (field, value) => {
    setNewLockFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleNewLockSubmit = async () => {
    if (isNewLockLoading) return;

    if (!newLockFormData.accountNumber || !newLockFormData.amount) {
      toast.error("Please fill in account number and amount");
      return;
    }

    const toastId = toast.loading("Creating new account lock...");
    setIsNewLockLoading(true);

    try {
      const response = await backendApi.post("/lock-account", newLockFormData);

      // Refresh data after creating new lock
      await fetchData();

      setIsNewLockDialogOpen(false);
      toast.success("New account lock created successfully!", { id: toastId });
    } catch (error) {
      console.error("Error creating new account lock:", error);
      toast.error(
        ` ${
          error?.response?.data?.message ||
          error?.message ||
          "Failed to create new account lock"
        } `,
        { id: toastId }
      );
    } finally {
      setIsNewLockLoading(false);
    }
  };

  return (
    <div className="m-5 p-5 sm:px-6 bg-primary-700/40 text-white rounded-xl shadow-2xl">
      <div className="py-6">
        <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4 flex-wrap w-full">
          <div className="flex items-center gap-4">
            <h2 className="text-xl md:text-3xl font-bold flex items-center gap-2">
              <Lock size={28} className="text-red-400" />
              Locked Accounts
            </h2>
            <button
              onClick={handleNewLockClick}
              className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-all duration-200 text-sm"
            >
              <Plus size={16} />
              Lock New Account
            </button>
          </div>

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
                  placeholder="Search by Name, Email, or Account Number"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="w-full pl-10 pr-4 py-2 bg-primary-600 border border-primary-500 rounded-lg focus:outline-none focus:border-primary-400 text-white placeholder-gray-400"
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

              {/* ⬇️ Status Filter */}
              {/* <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-primary-600 border border-primary-500 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary-400"
              >
                <option value="">All Status</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
              </select> */}
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-primary-600 text-white">
                <th className="p-3 text-left font-semibold rounded-tl-lg">
                  User Details
                </th>
                <th className="p-3 text-center font-semibold">Account Info</th>
                <th className="p-3 text-center font-semibold">Lock Amount</th>
                <th className="p-3 text-center font-semibold">Lock Status</th>
                {/* <th className="p-3 text-center font-semibold">Lock Period</th> */}
                <th className="p-3 text-center font-semibold">Timestamp</th>
                <th className="p-3 text-center font-semibold rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loader ? (
                <tr>
                  <td colSpan="7" className="p-4">
                    <div className="flex justify-center items-center w-full">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-300"></div>
                    </div>
                  </td>
                </tr>
              ) : (
                loadedData?.map((user, userIndex) =>
                  user.accounts.map((account, accountIndex) => (
                    <tr
                      key={`${user._id}-${account._id}`}
                      className="border-b border-primary-500/50 hover:bg-primary-600/50 transition-colors"
                    >
                      <td className="p-3 text-sm">
                        <div>
                          <p className="font-medium">
                            {user.firstName || "Unknown"} {user.lastName || ""}
                          </p>
                          <p className="text-gray-300/80 text-xs">
                            {user.email || "N/A"}
                          </p>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-center">
                        <div>
                          <p className="font-medium">{account.accountNumber}</p>
                          <p className="text-gray-300/80 text-xs">
                            {account.accountType}
                          </p>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-center">
                        <div className="flex items-center justify-center gap-1">
                          <DollarSign size={14} className="text-red-400" />
                          <span className="font-medium">
                            {account.lockInfo.amount}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            account.lockInfo.isLocked
                              ? "bg-red-500/20 text-red-300"
                              : "bg-green-500/20 text-green-300"
                          }`}
                        >
                          {account.lockInfo.isLocked
                            ? "🔒 Locked"
                            : "🔓 Unlocked"}
                        </span>
                      </td>
                      {/* <td className="p-3 text-sm text-center">
                        <div className="flex flex-col items-center gap-1">
                          <div className="flex items-center gap-1 text-xs">
                            <Calendar size={12} />
                            <span>
                              From: {CFformatDate(account.lockInfo.lockedOn)}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-gray-300">
                            <Calendar size={12} />
                            <span>
                              Till: {CFformatDate(account.lockInfo.lockedTill)}
                            </span>
                          </div>
                        </div>
                      </td> */}
                      <td className="p-3 text-sm text-center max-w-xs">
                        <div>{CFformatDate(account?.lockInfo?.lockedOn)}</div>
                        <div className="text-sm text-gray-400">
                          {CFcalculateTimeSinceJoined(
                            account?.lockInfo?.lockedOn
                          )}
                        </div>
                      </td>
                      <td className="p-3 text-sm text-center">
                        <button
                          onClick={() => handleEditClick(user, account)}
                          className="flex items-center justify-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 text-xs"
                        >
                          <Edit size={14} />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                )
              )}
            </tbody>
          </table>
        </div>

        {!loader && loadedData?.length > 0 && (
          <div className="flex flex-wrap justify-between items-center mt-6 pb-4">
            <div className="text-sm text-primary-300 mb-2 sm:mb-0">
              Showing page {paginationData.currentPage} of{" "}
              {paginationData.totalPages} — Total Users:{" "}
              {paginationData.totalAccounts} | Total Locks:{" "}
              {paginationData.totalLocks}
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
            {searchQuery
              ? `No locked accounts found for "${searchQuery}"`
              : "No locked accounts found"}
          </div>
        )}

        {/* Edit Dialog */}
        <AlertDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>Edit Account Lock</AlertDialogTitle>
              <AlertDialogDescription>
                {selectedAccount && (
                  <div className="space-y-4 text-gray-300">
                    <div className="p-4 bg-gradient-to-r from-primary-800 to-primary-900 rounded-lg shadow-lg">
                      <p className="text-lg font-bold text-white mb-2">
                        Account Information
                      </p>
                      <p>
                        <span className="font-medium">User:</span>{" "}
                        {selectedAccount.user.firstName}{" "}
                        {selectedAccount.user.lastName}
                      </p>
                      <p>
                        <span className="font-medium">Email:</span>{" "}
                        {selectedAccount.user.email}
                      </p>
                      <p>
                        <span className="font-medium">Account Number:</span>{" "}
                        {selectedAccount.account.accountNumber}
                      </p>
                      <p>
                        <span className="font-medium">Account Type:</span>{" "}
                        {selectedAccount.account.accountType}
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Lock Amount
                        </label>
                        <input
                          type="number"
                          value={editFormData.amount}
                          onChange={(e) =>
                            handleEditFormChange(
                              "amount",
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-full px-3 py-2 bg-black/50 border border-primary-800 rounded-lg focus:outline-none focus:border-primary-400 text-white"
                          placeholder="Lock Amount"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">
                          Comment
                        </label>
                        <textarea
                          value={editFormData.comment}
                          onChange={(e) =>
                            handleEditFormChange("comment", e.target.value)
                          }
                          className="w-full px-3 py-2  bg-black/50 border border-primary-800 rounded-lg focus:outline-none focus:border-primary-400 text-white resize-none"
                          placeholder="Comment"
                          rows="3"
                        />
                      </div>

                      <div className="flex items-center gap-4">
                        <label className="flex items-center gap-2 text-white">
                          <input
                            type="checkbox"
                            checked={editFormData.isLocked}
                            onChange={(e) =>
                              handleEditFormChange("isLocked", e.target.checked)
                            }
                            className="w-4 h-4 text-blue-600 bg-primary-600 border-primary-500 rounded focus:ring-blue-500"
                          />
                          Lock
                        </label>
                      </div>
                    </div>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <div className=" flex flex-col md:flex-row gap-4 justify-center items-center">
                <AlertDialogCancel onClick={() => setIsEditDialogOpen(false)}>
                  Cancel
                </AlertDialogCancel>

                <AlertDialogAction
                  disabled={isEditLoading}
                  onClick={handleEditSubmit}
                >
                  {isEditLoading ? "Updating..." : "Update Lock"}
                </AlertDialogAction>

                <button
                  disabled={isEditLoading}
                  onClick={handleDeleteLock}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 text-sm flex items-center gap-2"
                >
                  <Trash2 size={14} />
                  {isEditLoading ? "Processing..." : "Delete Lock"}
                </button>
              </div>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* New Lock Dialog */}
        <AlertDialog
          open={isNewLockDialogOpen}
          onOpenChange={setIsNewLockDialogOpen}
        >
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>Lock New Account</AlertDialogTitle>
              <AlertDialogDescription>
                <div className="space-y-4 text-gray-300">
                  <div className="p-4 bg-gradient-to-r from-primary-800 to-primary-900 rounded-lg shadow-lg">
                    <p className="text-lg font-bold text-white mb-2">
                      Create New Account Lock
                    </p>
                    <p className="text-sm text-gray-300">
                      Enter the account details to create a new lock
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Account Number *
                      </label>
                      <input
                        type="text"
                        value={newLockFormData.accountNumber}
                        onChange={(e) =>
                          handleNewLockFormChange(
                            "accountNumber",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 bg-black/50 border border-primary-800 rounded-lg focus:outline-none focus:border-primary-400 text-white"
                        placeholder="Enter account number"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Lock Amount *
                      </label>
                      <input
                        type="number"
                        value={newLockFormData.amount}
                        onChange={(e) =>
                          handleNewLockFormChange(
                            "amount",
                            parseFloat(e.target.value) || 0
                          )
                        }
                        className="w-full px-3 py-2 bg-black/50 border border-primary-800 rounded-lg focus:outline-none focus:border-primary-400 text-white"
                        placeholder="Enter lock amount"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white mb-2">
                        Comment
                      </label>
                      <textarea
                        value={newLockFormData.comment}
                        onChange={(e) =>
                          handleNewLockFormChange("comment", e.target.value)
                        }
                        className="w-full px-3 py-2 bg-black/50 border border-primary-800 rounded-lg focus:outline-none focus:border-primary-400 text-white resize-none"
                        placeholder="Enter comment (optional)"
                        rows="3"
                      />
                    </div>

                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-white">
                        <input
                          type="checkbox"
                          checked={newLockFormData.isLocked}
                          onChange={(e) =>
                            handleNewLockFormChange(
                              "isLocked",
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 text-blue-600 bg-primary-600 border-primary-500 rounded focus:ring-blue-500"
                        />
                        Is Locked
                      </label>
                    </div>
                  </div>
                </div>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsNewLockDialogOpen(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                disabled={isNewLockLoading}
                onClick={handleNewLockSubmit}
              >
                {isNewLockLoading ? "Creating..." : "Create Lock"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default LockAccount;
