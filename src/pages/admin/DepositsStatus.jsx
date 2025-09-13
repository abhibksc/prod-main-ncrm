import { useEffect, useState, useCallback } from "react";
import {
  ArrowLeftRight,
  CircleCheckBig,
  CircleX,
  Download,
  FileText,
  Image,
  Loader,
  Search,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
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
import toast from "react-hot-toast";
import { backendApi, metaApi } from "@/utils/apiClients";
import {
  CFcalculateTimeSinceJoined,
  CFformatDate,
} from "@/utils/CustomFunctions";
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};
const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const StatCard = ({ icon, amount, label, bgColor, link, allLoading }) => (
  <Link to={`${link}`} className="">
    <motion.div
      variants={cardVariants}
      className={`p-4  rounded-lg shadow-lg transition-all duration-300 hover:shadow-md ${bgColor} hover:px-5 text-white`}
      style={{
        backgroundImage:
          "url('https://png.pngtree.com/background/20230109/original/pngtree-white-abstract-carbon-fiber-texture-background-picture-image_1996167.jpg')", // More visible pattern
        overlay: "auto",
        backgroundBlendMode: "overlay",
        backgroundSize: "cover",
      }}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {icon}
          <div className="ml-3">
            {allLoading ? (
              <p className="">Loading..</p>
            ) : (
              <p className="text-2xl font-bold">{amount}</p>
            )}

            <p className="text-sm opacity-80">{label}</p>
          </div>
        </div>
      </div>
    </motion.div>
  </Link>
);

const DepositsStatus = () => {
  const { status } = useParams();
  const [depositData, setDepositData] = useState([]);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [loading, setLoading] = useState(false);
  const isAll = status === "all" ? true : false;
  const [showPreview, setShowPreview] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [allDepositData, setAllDepositData] = useState([]);
  const [allLoading, setAllLoading] = useState(true);
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [pagination, setPagination] = useState({});
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [showCustomLimit, setShowCustomLimit] = useState(false);
  const [customLimit, setCustomLimit] = useState("");

  const togglePreview = (item) => {
    setShowPreview(!showPreview);
    setSelectedDeposit(item);
  };
  // fetch data------------------
  const fetchApiData = useCallback(async () => {
    try {
      let finalRes;

      if (status === "all") {
        const res = await backendApi.get(
          `/deposits?page=${currentPage}&limit=${itemsPerPage}&search=${debouncedSearch}&status=`
        );
        finalRes = res.data;
      } else if (status === "pending") {
        const res = await backendApi.get(
          `/deposits?page=${currentPage}&limit=${itemsPerPage}&search=${debouncedSearch}&status=pending`
        );
        finalRes = res.data;
      } else if (status === "approved") {
        const res = await backendApi.get(
          `/deposits?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}&status=approved`
        );
        finalRes = res.data;
      } else if (status === "rejected") {
        const res = await backendApi.get(
          `/deposits?page=${currentPage}&limit=${itemsPerPage}&search=${searchQuery}&status=rejected`
        );
        finalRes = res.data;
      }
      setDepositData(finalRes.data);
      setPagination(finalRes.pagination);
      setLoading(false);
    } catch (error) {
      toast.error("Something went wrong");
      console.log("Error fetching deposits:", error);
      setLoading(false);
    }
  }, [status, currentPage, itemsPerPage, debouncedSearch, searchQuery]);

  // fetch all data ----------------

  const fetchAllData = async () => {
    try {
      // for all data -----
      const allRes = await backendApi.get(`/deposits`);
      setAllDepositData(allRes.data.data);
    } catch (error) {
      console.log("failed to fetch all data");
    } finally {
      setAllLoading(false);
    }
  };
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleActionClick = (deposit, action) => {
    setSelectedDeposit(deposit);
    setActionType(action);
    setIsDialogOpen(true);
  };

  // console.log("selected deposit!!!!", selectedDeposit);

  // on confirm api handler  ------------------------------
  const customContent = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Withdrawal Request Confirmation - Arena Trade</title>
      <style>
        body, html {
          margin: 0;
          padding: 0;
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 5px;
          background-color: #ffffff;
        }
        .header {
          background-color: #19422df2;
          color: #ffffff;
          padding: 20px 15px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 22px;
          letter-spacing: 1px;
        }
        .content {
          padding: 10px 20px;
        }
        .cta-button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #2d6a4f;
          color: #FFFFFF;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          margin: 10px 0;
        }
        .footer {
          background-color: #19422df2;
          color: #ffffff;
          text-align: center;
          padding: 5px 10px;
          font-size: 12px;
          border-radius: 0 0 10px 10px;
        }
        .footer-info {
          margin-top: 6px;
        }
        .footer-info a {
          color: #B6D0E2;
          text-decoration: none;
        }
        
       
        .withdrawal-details {
          background-color: #f8f8f8;
          border-left: 4px solid #2d6a4f;
          padding: 15px;
          margin: 20px 0;
        }
        .withdrawal-details p {
          margin: 5px 0;
        }
        .highlight {
          font-weight: bold;
          color: #0a2342;
        }
        .risk-warning {
          color: #C70039;
          padding: 5px;
          font-size: 12px;
          line-height: 1.4;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Deposit Approved</h1>
        </div>
        <div class="content">
          <p>Dear ${
            selectedDeposit?.userId?.firstName +
            " " +
            selectedDeposit?.userId?.lastName
          },</p>
  <p>We are pleased to inform you that your deposit has been successfully credited to your MT5 account</p>
         <div class="withdrawal-details">

          <p>Account No: <span class="highlight">${
            selectedDeposit?.mt5Account
          }</span></p>
            <p>Account Type: <span class="highlight">${
              selectedDeposit?.accountType
            }</span></p>
            <p>Deposit Balance: <span class="highlight">$${
              selectedDeposit?.deposit
            }</span></p>
          </div>
    
    <p>Thank you for choosing us.</p>
    <p>Happy trading!</p>
          <p>Best regards,<br>The ${
            import.meta.env.VITE_WEBSITE_NAME || "Forex"
          } Team</p>
          <hr>
        
    
        </div>
         <div class="footer">
       <div class="footer-info">
                  <p>Website: <a href="https://${
                    import.meta.env.VITE_EMAIL_WEBSITE
                  }"> ${
    import.meta.env.VITE_EMAIL_WEBSITE
  } </a> | E-mail: <a href="mailto:${import.meta.env.VITE_EMAIL_EMAIL || ""}">${
    import.meta.env.VITE_EMAIL_EMAIL || ""
  }</a></p>
                  <p>© 2025 ${
                    import.meta.env.VITE_WEBSITE_NAME || ""
                  }. All Rights Reserved</p>
                </div>
        </div>
      </div>
    </body>
    </html>`;

  const handleConfirmAction = async (selectedDeposit) => {
    if (isActionLoading) return;

    const toastId = toast.loading("Please wait..");
    setIsActionLoading(true);

    try {
      if (actionType === "approve") {
        // const depositApires = await metaApi.get(
        //   `/MakeDepositBalance?Manager_Index=${
        //     import.meta.env.VITE_MANAGER_INDEX
        //   }&MT5Account=${selectedDeposit.mt5Account}&Amount=${
        //     selectedDeposit.deposit
        //   }&Comment=deposit`
        // );

        const updateDbDepositRes = await backendApi.put(`/update-deposit`, {
          _id: selectedDeposit._id,
          status: "approved",
          server: true,
          email: selectedDeposit?.userId?.email,
          accountId: selectedDeposit?.mt5Account,
        });
        setIsDialogOpen(false);

        try {
          const customMailRes = await backendApi.post(`/custom-mail`, {
            email: selectedDeposit.userId.email,
            content: customContent,
            subject: "Deposit Added",
          });
        } catch (error) {
          console.error("error while mailing", error);
        }
        const updatedDepositData = depositData.map((deposit) =>
          deposit._id === selectedDeposit._id
            ? {
                ...deposit,
                status: "approved",
              }
            : deposit
        );
        setDepositData(updatedDepositData);
        setIsDialogOpen(false);
        toast.success("Deposit Added", { id: toastId });
        // if (depositApires.data) {
        // } else {
        //   toast.error("Failed, Please retry!!", { id: toastId });
        //   setIsDialogOpen(false);
        // }
      } else if (actionType === "reject") {
        const res = await backendApi.put(`/update-deposit`, {
          _id: selectedDeposit._id,
          status: "rejected",
        });
        setIsDialogOpen(false);

        const updatedDepositData = depositData.map((deposit) =>
          deposit._id === selectedDeposit._id
            ? {
                ...deposit,
                status: "rejected",
              }
            : deposit
        );
        setDepositData(updatedDepositData);
        setIsDialogOpen(false);
        setSelectedDeposit("");
        toast.success("Deposit Rejected", { id: toastId });
      }
    } catch (error) {
      console.error("Error updating deposit status:", error);
      toast.error("Something went wrong", { id: toastId });

      // log-error -----------
      const statusCode = error?.response?.status || error?.status;
      const errorMessage = error?.response?.data?.message || error?.message;
      const errorUrl =
        error?.request?.__URL__ || error?.config?.url || error?.config?.baseURL;

      // console.log("statusCode", statusCode);
      // console.log("errorMessage", errorMessage);
      // console.log("errorUrl", errorUrl);
      try {
        const logError = await backendApi.post(`/log-error`, {
          email: selectedDeposit?.userId?.email,
          accountId: selectedDeposit?.mt5Account,
          url: errorUrl,
          errorCode: statusCode,
          errorMessage: errorMessage,
        });
      } catch (error) {
        console.log("failed to log error", error);
      }
    } finally {
      setIsActionLoading(false); // NEW: Reset action loading to false
    }
  };
  // total deposits ----------

  const TotalDeposits = allDepositData
    .reduce((total, item) => total + Number(item.deposit), 0)
    .toFixed(2);

  // Total pending deposits
  const TotalPendingDeposits = allDepositData
    .filter((item) => item.status === "pending")
    .reduce((total, item) => total + Number(item.deposit), 0)
    .toFixed(2);

  // Total successful deposits
  const TotalSuccessfullDeposits = allDepositData
    .filter((item) => item.status === "approved")
    .reduce((total, item) => total + Number(item.deposit), 0)
    .toFixed(2);

  // Total rejected deposits
  const TotalRejectedDeposits = allDepositData
    .filter((item) => item.status === "rejected")
    .reduce((total, item) => total + Number(item.deposit), 0)
    .toFixed(2);

  // console.log("Total rejected", TotalRejectedDeposits);

  // stats data------------

  const stats = [
    {
      icon: <ArrowLeftRight size={24} />,
      amount: TotalDeposits,
      label: "Total Deposits",
      bgColor: "bg-sky-800",
      link: "/admin/deposit/all",
    },
    {
      icon: <ArrowLeftRight size={24} />,
      amount: TotalSuccessfullDeposits,
      label: "Successfull Deposits",
      bgColor: "bg-green-800",
      link: "/admin/deposit/approved",
    },
    {
      icon: <ArrowLeftRight size={24} />,
      amount: TotalPendingDeposits,
      label: "Pending Deposits",
      bgColor: "bg-yellow-800",
      link: "/admin/deposit/pending",
    },
    {
      icon: <ArrowLeftRight size={24} />,
      amount: TotalRejectedDeposits,
      label: "Rejected Deposits",
      bgColor: "bg-orange-800",
      link: "/admin/deposit/rejected",
    },
  ];

  // pagination -------------------

  const totalPages = pagination?.totalPages;
  const handleNextPage = () => {
    if (currentPage < pagination?.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // Handle limit change
  const handleLimitChange = (value) => {
    if (value === "custom") {
      setShowCustomLimit(true);
    } else {
      setShowCustomLimit(false);
      setCustomLimit("");
      setItemsPerPage(parseInt(value));
      setCurrentPage(1); // Reset to first page when changing limit
    }
  };

  const handleCustomLimitSubmit = () => {
    const limit = parseInt(customLimit);
    if (limit > 0 && limit <= 1000) {
      setItemsPerPage(limit);
      setCurrentPage(1);
      setShowCustomLimit(false);
      setCustomLimit("");
    } else {
      toast.error("Please enter a valid number between 1 and 1000");
    }
  };

  // page reset ------

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, status, itemsPerPage]);

  // debouncing searching ------------
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500); // 500ms debounce time

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // use effect for data fetching -----------------

  useEffect(() => {
    fetchApiData();
  }, [fetchApiData]);

  // use effect for all data -----------------

  useEffect(() => {
    if (status == "all") {
      fetchAllData();
    }
  }, [status]);

  // Download functions
  const prepareDownloadData = async () => {
    try {
      let downloadData;

      // Fetch all data for download based on current status and search
      if (status === "all") {
        const res = await backendApi.get(
          `/deposits?page=1&limit=10000&search=${debouncedSearch}&status=`
        );
        downloadData = res.data.data;
      } else if (status === "pending") {
        const res = await backendApi.get(
          `/deposits?page=1&limit=10000&search=${debouncedSearch}&status=pending`
        );
        downloadData = res.data.data;
      } else if (status === "approved") {
        const res = await backendApi.get(
          `/deposits?page=1&limit=10000&search=${debouncedSearch}&status=approved`
        );
        downloadData = res.data.data;
      } else if (status === "rejected") {
        const res = await backendApi.get(
          `/deposits?page=1&limit=10000&search=${debouncedSearch}&status=rejected`
        );
        downloadData = res.data.data;
      }

      return downloadData.map((item, index) => ({
        "S.No": index + 1,
        "User Name":
          `${item?.userId?.firstName || ""} ${
            item?.userId?.lastName || ""
          }`.trim() || "Not found",
        Email: item?.userId?.email || "Not found",
        Phone: item?.userId?.phone || "",
        "MT5 Account": item?.mt5Account || "N/A",
        "Account Type": item?.accountType || "",
        "Deposit Amount": item?.deposit || 0,
        "Transaction ID": item?.transactionId || "",
        Status:
          item?.status?.charAt(0).toUpperCase() + item?.status?.slice(1) || "",
        "Request Date": CFformatDate(item?.createdAt),
        "Updated Date": CFformatDate(item?.updatedAt),
      }));
    } catch (error) {
      console.error("Error fetching download data:", error);
      throw error;
    }
  };

  const downloadExcel = async () => {
    setIsDownloading(true);
    try {
      const data = await prepareDownloadData();
      const ws = XLSX.utils.json_to_sheet(data);

      // Set column widths
      const colWidths = [
        { wch: 8 }, // S.No
        { wch: 20 }, // User Name
        { wch: 25 }, // Email
        { wch: 15 }, // Phone
        { wch: 15 }, // MT5 Account
        { wch: 15 }, // Account Type
        { wch: 15 }, // Deposit Amount
        { wch: 20 }, // Transaction ID
        { wch: 12 }, // Status
        { wch: 18 }, // Request Date
        { wch: 18 }, // Updated Date
      ];
      ws["!cols"] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Deposits");

      const fileName = `Deposits_${status}_${
        new Date().toISOString().split("T")[0]
      }.xlsx`;
      XLSX.writeFile(wb, fileName);

      toast.success(
        `Excel file downloaded successfully! (${data.length} records)`
      );
    } catch (error) {
      toast.error("Failed to download Excel file");
      console.error("Excel download error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadCSV = async () => {
    setIsDownloading(true);
    try {
      const data = await prepareDownloadData();
      const ws = XLSX.utils.json_to_sheet(data);
      const csv = XLSX.utils.sheet_to_csv(ws);

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `Deposits_${status}_${new Date().toISOString().split("T")[0]}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(
        `CSV file downloaded successfully! (${data.length} records)`
      );
    } catch (error) {
      toast.error("Failed to download CSV file");
      console.error("CSV download error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  const downloadPDF = async () => {
    setIsDownloading(true);
    try {
      const allData = await prepareDownloadData();
      const doc = new jsPDF("l", "mm", "a4"); // landscape orientation

      // Add title
      doc.setFontSize(16);
      doc.setFont(undefined, "bold");
      doc.text(`Deposits Report - ${status.toUpperCase()}`, 20, 20);

      // Add generation date
      doc.setFontSize(10);
      doc.setFont(undefined, "normal");
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 30);
      doc.text(`Total Records: ${allData.length}`, 20, 35);

      // Prepare table data
      const tableData = allData.map((item, index) => [
        index + 1,
        item["User Name"],
        item["Email"],
        item["MT5 Account"],
        item["Account Type"],
        item["Deposit Amount"],
        item["Status"],
        item["Request Date"],
      ]);

      // Add table
      doc.autoTable({
        head: [
          [
            "S.No",
            "User Name",
            "Email",
            "MT5 Account",
            "AC Type",
            "Amount",
            "Status",
            "Date",
          ],
        ],
        body: tableData,
        startY: 45,
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
          3: { cellWidth: 25 }, // MT5 Account
          4: { cellWidth: 25 }, // AC Type
          5: { cellWidth: 25 }, // Amount
          6: { cellWidth: 20 }, // Status
          7: { cellWidth: 30 }, // Date
        },
      });

      // Add summary if available
      if (isAll && !allLoading) {
        const finalY = doc.lastAutoTable.finalY + 20;
        doc.setFontSize(12);
        doc.setFont(undefined, "bold");
        doc.text("Summary:", 20, finalY);

        doc.setFontSize(10);
        doc.setFont(undefined, "normal");
        doc.text(`Total Deposits: $${TotalDeposits}`, 20, finalY + 10);
        doc.text(`Approved: $${TotalSuccessfullDeposits}`, 20, finalY + 20);
        doc.text(`Pending: $${TotalPendingDeposits}`, 20, finalY + 30);
        doc.text(`Rejected: $${TotalRejectedDeposits}`, 20, finalY + 40);
      }

      const fileName = `Deposits_${status}_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      doc.save(fileName);

      toast.success(
        `PDF file downloaded successfully! (${allData.length} records)`
      );
    } catch (error) {
      toast.error("Failed to download PDF file");
      console.error("PDF download error:", error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="mx-auto mt-5 px-5">
      <div className=" w-full flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl flex-col font-bold mb-4 text-white first-letter:uppercase">
          {status} Deposits
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-4 w-full lg:w-auto">
          {/* Download Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={downloadExcel}
              disabled={isDownloading || loading}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 text-sm"
            >
              {isDownloading ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                <FileText size={16} />
              )}
              {isDownloading ? "Downloading..." : "Excel"}
            </button>

            <button
              onClick={downloadCSV}
              disabled={isDownloading || loading}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 text-sm"
            >
              {isDownloading ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              {isDownloading ? "Downloading..." : "CSV"}
            </button>

            <button
              onClick={downloadPDF}
              disabled={isDownloading || loading}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 text-sm"
            >
              {isDownloading ? (
                <Loader size={16} className="animate-spin" />
              ) : (
                <FileText size={16} />
              )}
              {isDownloading ? "Downloading..." : "PDF"}
            </button>
          </div>

          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Name / Email / Ac No"
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
      </div>

      <div className="overflow-x-auto relative">
        {isAll && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className=" hidden md:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => (
              <StatCard allLoading={allLoading} key={index} {...stat} />
            ))}
          </motion.div>
        )}
        {/* Added max-height container for scrolling */}
        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
          <table className="min-w-full bg-primary-700">
            {/* Made header sticky */}
            <thead className="bg-primary-400 text-white sticky top-0 z-10">
              <tr>
                <th className="py-2 px-4 text-left">User | Email</th>

                <th className="py-2 px-4 text-left">MT5 AC</th>
                <th className="py-2 px-4 text-left">AC Type</th>
                <th className="py-2 px-4 text-left">Deposit</th>
                {status === "rejected" || status === "approved" ? (
                  <th className="py-2 px-4 text-left">Updated At</th>
                ) : (
                  <th className="py-2 px-4 text-left">Requested At</th>
                )}
                <th className="py-2 px-4 text-left">Proof</th>
                <th className="py-2 px-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody className="text-white">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-4">
                    <div className="text-white flex justify-center items-center gap-4">
                      <p>Loading...</p>
                      <Loader className="animate-spin" />
                    </div>
                  </td>
                </tr>
              ) : (
                depositData?.map((item) => (
                  <tr key={item._id} className="border-b border-gray-600/40">
                    <td className="py-2 px-4">
                      <div className="font-semibold">
                        {item?.userId?.firstName
                          ? item?.userId?.firstName
                          : "Not found!!"}
                      </div>
                      <div className="text-white/70 text-sm">
                        {item?.userId?.email
                          ? item?.userId?.email
                          : "Not found!!"}
                      </div>
                    </td>
                    <td className="py-2 px-4">{item?.mt5Account || "N/A"}</td>

                    <td className="py-2 px-4">
                      <span className="bg-primary-400/20 whitespace-nowrap text-white px-2 py-1 rounded-full text-sm">
                        {item?.accountType}
                      </span>
                    </td>
                    <td className="py-2 px-4">${item?.deposit}</td>
                    {status === "rejected" || status === "approved" ? (
                      <td className="py-3 whitespace-nowrap px-4">
                        <div>{CFformatDate(item?.updatedAt)}</div>
                        <div className="text-sm text-gray-400">
                          {CFcalculateTimeSinceJoined(item?.updatedAt)}
                        </div>
                      </td>
                    ) : (
                      <td className="py-3 whitespace-nowrap px-4">
                        <div>{CFformatDate(item?.createdAt)}</div>
                        <div className="text-sm text-gray-400">
                          {CFcalculateTimeSinceJoined(item?.createdAt)}
                        </div>
                      </td>
                    )}
                    <td className="py-2 px-4">
                      <button
                        className="flex items-center justify-center gap-1 text-blue-400 hover:text-blue-500 transition-all"
                        onClick={() => togglePreview(item)}
                      >
                        <Image></Image> view
                      </button>
                    </td>
                    <td className="py-2 px-4">
                      {item.status === "pending" && (
                        <div>
                          {isActionLoading ? (
                            "Please wait.."
                          ) : (
                            <div className="flex items-center gap-5">
                              <button
                                className="text-green-400 hover:text-green-600 hover:scale-110 transition-all"
                                onClick={() =>
                                  handleActionClick(item, "approve")
                                }
                              >
                                <CircleCheckBig />
                              </button>
                              <button
                                className="text-red-500 hover:text-red-700 hover:scale-110 transition-all"
                                onClick={() =>
                                  handleActionClick(item, "reject")
                                }
                              >
                                <CircleX />
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                      {item.status === "approved" && (
                        <p className="text-green-400">Approved</p>
                      )}
                      {item.status === "rejected" && (
                        <p className="text-red-500">Rejected</p>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex flex-col items-center space-y-4">
        {/* Pagination Info */}
        <p className="text-gray-300 text-sm">
          <span className="font-semibold text-white">
            {" "}
            {pagination?.totalDeposits}
          </span>{" "}
          total records
        </p>

        {/* Limit Selector */}
        <div className="flex items-center gap-3">
          <span className="text-gray-300 text-sm">Show:</span>
          <div className="relative">
            <select
              value={showCustomLimit ? "custom" : itemsPerPage.toString()}
              onChange={(e) => handleLimitChange(e.target.value)}
              className="bg-primary-600 border border-primary-500 text-white text-sm rounded-lg px-3 py-1 focus:outline-none focus:border-primary-400 appearance-none pr-8"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="50">50</option>
              <option value="100">100</option>
              <option value="custom">Custom</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
          {showCustomLimit && (
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={customLimit}
                onChange={(e) => setCustomLimit(e.target.value)}
                placeholder="1-1000"
                min="1"
                max="1000"
                className="bg-primary-600 border border-primary-500 text-white text-sm rounded-lg px-3 py-1 w-20 focus:outline-none focus:border-primary-400"
              />
              <button
                onClick={handleCustomLimitSubmit}
                className="bg-primary-500 hover:bg-primary-600 text-white text-sm px-3 py-1 rounded-lg transition-all"
              >
                Set
              </button>
              <button
                onClick={() => {
                  setShowCustomLimit(false);
                  setCustomLimit("");
                }}
                className="text-gray-400 hover:text-white text-sm"
              >
                ×
              </button>
            </div>
          )}
          <span className="text-gray-300 text-sm">per page</span>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-5 py-2 rounded-xl transition-all ${
              currentPage === 1
                ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                : "bg-primary-500 hover:bg-primary-600 text-white shadow-md"
            }`}
          >
            ← Previous
          </button>

          <span className="text-gray-300 text-sm">
            Page <span className="font-semibold text-white">{currentPage}</span>{" "}
            of
            <span className="font-semibold text-white"> {totalPages}</span>
          </span>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-5 py-2 rounded-xl transition-all ${
              currentPage === totalPages
                ? "bg-gray-700/40 text-gray-400 cursor-not-allowed"
                : "bg-primary-500 hover:bg-primary-600 text-white shadow-md"
            }`}
          >
            Next →
          </button>
        </div>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {actionType === "approve" ? "Approve Deposit" : "Reject Deposit"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedDeposit && (
                <div className="space-y-4 text-gray-300">
                  <div className="p-4 bg-gradient-to-r from-primary-800 to-primary-900 rounded-lg shadow-lg">
                    <p className="text-lg font-bold text-white">
                      User Information
                    </p>
                    <p>
                      <span className="font-medium">Name:</span>{" "}
                      {selectedDeposit.userId?.firstName +
                        " " +
                        selectedDeposit.userId?.lastName}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span>{" "}
                      {selectedDeposit.userId?.email}
                    </p>
                    <p>
                      <span className="font-medium">Phone:</span>{" "}
                      {selectedDeposit.userId?.phone}
                    </p>
                  </div>

                  <div className="p-4 bg-gradient-to-r from-primary-800 to-primary-900 rounded-lg shadow-lg">
                    <p className="text-lg font-bold text-white">
                      Deposit Details
                    </p>
                    <p>
                      <span className="font-medium">Deposit Amount:</span>{" "}
                      <span className="text-green-500 font-semibold">
                        ${selectedDeposit.deposit}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">AC Number:</span>{" "}
                      <span className="text-gray-200 font-semibold">
                        {selectedDeposit?.mt5Account}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">AC Type:</span>{" "}
                      <span className="text-gray-200 font-semibold">
                        {selectedDeposit.accountType}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Transaction ID:</span>{" "}
                      <span className="text-gray-200 font-semibold">
                        {selectedDeposit?.transactionId}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {CFformatDate(selectedDeposit.updatedAt)}
                    </p>
                  </div>

                  <p className="mt-4 text-sm">
                    Are you sure you want to{" "}
                    <span
                      className={`font-semibold ${
                        actionType === "approve"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {actionType === "approve" ? "approve" : "reject"}
                    </span>{" "}
                    this deposit?
                  </p>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              disabled={isActionLoading} // NEW: Disable confirm button while loading
              onClick={() => handleConfirmAction(selectedDeposit)}
            >
              {isActionLoading
                ? "Processing..."
                : `Confirm ${
                    actionType === "approve" ? "Approval" : "Rejection"
                  }`}{" "}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* for image ----- */}
      <AlertDialog open={showPreview} onOpenChange={setShowPreview}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Proof Of Deposit</AlertDialogTitle>
            <AlertDialogDescription>
              <img
                src={
                  import.meta.env.VITE_BACKEND_BASE_URL +
                  "/" +
                  selectedDeposit?.depositSS
                }
                alt="Preview"
                className=" my-6 w-full rounded-md h-auto"
              />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowPreview(false)}>
              Close
            </AlertDialogCancel>
            <AlertDialogAction>
              <a
                target="_blank"
                href={
                  import.meta.env.VITE_BACKEND_BASE_URL +
                  "/" +
                  selectedDeposit?.depositSS
                }
              >
                {" "}
                View Full Image
              </a>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DepositsStatus;
