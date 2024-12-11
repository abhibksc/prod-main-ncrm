import React, { useEffect, useState } from "react";
import {
  ArrowLeftRight,
  CircleCheckBig,
  CircleX,
  Import,
  Loader,
  Search,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
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
import { useDispatch, useStore } from "react-redux";
import toast from "react-hot-toast";
import { backendApi, metaApi } from "@/utils/apiClients";
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

const StatCard = ({ icon, amount, label, bgColor, link }) => (
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
            <p className="text-2xl font-bold">{amount}</p>
            <p className="text-sm opacity-80">{label}</p>
          </div>
        </div>
      </div>
    </motion.div>
  </Link>
);

const DepositsStatus = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const { status } = useParams();
  const [depositData, setDepositData] = useState([]);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [loading, setLoading] = useState(false);
  const isAll = status === "all" ? true : false;
  const [apiMasterPassword, setApiMasterPassword] = useState("");
  const [apiInvestorPassword, setApiInvestorPassword] = useState("");
  const dispatch = useDispatch();
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const togglePreview = (item) => {
    setShowPreview(!showPreview);
    setSelectedDeposit(item);
  };
  const fetchApiData = async () => {
    setLoading(true);
    try {
      const res = await backendApi.get(`/deposits`);
      setDepositData(res.data.data.reverse());
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.log("Error while fetching all deposits--", error);
    }
  };

  let filterParamsData = depositData?.filter((item) => item.status === status);
  if (status === "all") {
    filterParamsData = depositData?.filter(
      (item) =>
        item.status === "pending" ||
        item.status === "rejected" ||
        item.status === "approved"
    );
  }

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

  const handleActionClick = (deposit, action) => {
    setSelectedDeposit(deposit);
    setActionType(action);
    setIsDialogOpen(true);
  };

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
            selectedDeposit?.userId.firstName +
            " " +
            selectedDeposit?.userId.lastName
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
            <p>Server Name: <span class="highlight">${
              import.meta.env.VITE_SERVER_NAME
            }</span></p>
          </div>
    
    <p>Thank you for choosing us.</p>
    <p>Happy trading!</p>
          <p>Best regards,<br>The ${
            import.meta.env.VITE_WEBSITE_NAME || "Forex Funding"
          } Team</p>

           <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f0f8ff; margin: 20px 0; border-radius: 15px;">
          <tr>
            <td align="center" style="padding: 20px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center" width="33%" style="padding: 0 10px;">
                    <a href="https://play.google.com/store/apps/details?id=net.metaquotes.metatrader5&pcampaignid=web_share" style="display: inline-block; text-decoration: none; color: #ffffff; background-color: #2d6a4f; padding: 15px 20px; border-radius: 8px; font-weight: bold; transition: background-color 0.3s;">
                      <img src="https://cdn-icons-png.flaticon.com/512/14/14415.png" alt="Android" width="24" height="24" style="vertical-align: middle; margin-right: 10px;">
                      <span style="vertical-align: middle;">Android</span>
                    </a>
                  </td>
                  <td align="center" width="33%" style="padding: 0 10px;">
                    <a href="https://apps.apple.com/us/app/metatrader-5/id413251709?platform=ipad" style="display: inline-block; text-decoration: none; color: #ffffff; background-color: #2d6a4f; padding: 15px 20px; border-radius: 8px; font-weight: bold; transition: background-color 0.3s;">
                      <img src="https://cdn3.iconfinder.com/data/icons/social-media-logos-glyph/2048/5315_-_Apple-512.png" alt="iOS" width="24" height="24" style="vertical-align: middle; margin-right: 10px;">
                      <span style="vertical-align: middle;">iOS</span>
                    </a>
                  </td>
                  <td align="center" width="33%" style="padding: 0 10px;">
                    <a href="https://download.mql5.com/cdn/web/metaquotes.ltd/mt5/mt5setup.exe?utm_source=www.metatrader5.com&utm_campaign=download" style="display: inline-block; text-decoration: none; color: #ffffff; background-color: #2d6a4f; padding: 15px 20px; border-radius: 8px; font-weight: bold; transition: background-color 0.3s;">
                      <img src="https://cdn-icons-png.flaticon.com/512/71/71753.png" alt="Windows" width="24" height="24" style="vertical-align: middle; margin-right: 10px;">
                      <span style="vertical-align: middle;">Windows</span>
                    </a>
                  </td>
                </tr>
              </table>
          <hr>
     <div class="risk-warning">
      <strong>Risk Warning:</strong> Trading CFDs carries high risk and may result in losses beyond your initial investment. Trade only with money you can afford to lose and understand the risks.  
      <br><br>
      Our services are not for U.S. citizens or in jurisdictions where they violate local laws.
    </div>
        
    
        </div>
         <div class="footer">
          <div class="footer-info">    
     <p>${import.meta.env.VITE_EMAIL_ADDRESS || "forextest@mail.com"}</p>
            <p>Website: <a href="https://${
              import.meta.env.VITE_EMAIL_WEBSITE
            }"> ${
    import.meta.env.VITE_EMAIL_WEBSITE
  } </a> | E-mail: <a href="mailto:${
    import.meta.env.VITE_EMAIL_EMAIL || "forextest@mail.com"
  }">${import.meta.env.VITE_EMAIL_EMAIL || "forextest@mail.com"}</a></p>
            <p>We sent out this message to all existing ${
              import.meta.env.VITE_WEBSITE_NAME || "Forex Funding"
            } traders. Please visit this page to know more about our Privacy Policy.</p>
            <p>&copy; 2024 ${
              import.meta.env.VITE_WEBSITE_NAME || "Forex Funding"
            }. All Rights Reserved</p>
          </div>
        </div>
      </div>
    </body>
    </html>`;

  console.log("selected deposit!!!!", selectedDeposit);

  // on confirm api handler  ------------------------------

  const handleConfirmAction = async (selectedDeposit) => {
    const toastId = toast.loading("Please wait..");
    // console.log("selected deposits--", selectedDeposit);
    try {
      if (actionType === "approve") {
        const depositApires = await metaApi.get(
          `/MakeDepositBalance?Manager_Index=${
            import.meta.env.VITE_MANAGER_INDEX
          }&MT5Account=${selectedDeposit.mt5Account}&Amount=${
            selectedDeposit.deposit
          }&Comment=TEST`
        );
        console.log("depositApires", depositApires);
        if (depositApires.data.Equity) {
          const updateDbDepositRes = await backendApi.put(`/update-deposit`, {
            _id: selectedDeposit._id,
            status: "approved",
          });

          // commission block ----

          //    if (
          //   selectedDeposit?.userId?.referralFromUserId &&
          //   selectedDeposit?.userId?.referalFromId
          // ) {

          //   const addCommisonMt5Api = await metaApi.get(
          //     `/MakeDepositBalance?Manager_Index=${
          //       import.meta.env.VITE_MANAGER_INDEX
          //     }&MT5Account=${selectedDeposit.userId.referralFromId}&Amount=${(
          //       Number(selectedDeposit.deposit) *
          //       (Number(import.meta.env.VITE_IB_COMMISSION) / 100)
          //     ).toFixed(2)}&Comment=commissionDeposit`
          //   );

          //   const addCommissionDB = await axios.post(
          //     `${
          //       import.meta.env.VITE_BECKEND_END_POINT
          //     }/api/auth/add-commission`,
          //     {
          //       mt5Account: selectedDeposit.mt5Account,
          //       referralId: selectedDeposit?.userId?.referalFromId,
          //       depositBalance: selectedDeposit.balance,
          //       accountSize: selectedDeposit.deposit,
          //       commission: (
          //         Number(selectedDeposit.deposit) *
          //         (Number(import.meta.env.VITE_IB_COMMISSION) / 100)
          //       ).toFixed(2),
          //       accountType: selectedDeposit.accountType,
          //       level: 1,
          //       referralFrom: selectedDeposit.userId.referralFromUserId,
          //       currentReferral: selectedDeposit.userId._id,
          //     }
          //   );
          //       toast.success(
          //         `$${addCommissionDB.data.savedData.commission} Commission added to referral account`,
          //         { duration: 5000 }
          //       );
          //       console.log(
          //         "common amount --",
          //         (
          //           Number(selectedDeposit.deposit) *
          //           (Number(import.meta.env.VITE_IB_COMMISSION) / 100)
          //         ).toFixed(2)
          //       );

          // }

          const customMailRes = await backendApi.post(`/custom-mail`, {
            email: selectedDeposit.userId.email,
            content: customContent,
            subject: "Deposit Added",
          });
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
        } else {
          toast.error("Failed, Please retry!!", { id: toastId });
          setIsDialogOpen(false);
        }
      } else if (actionType === "reject") {
        const res = await backendApi.put(`/update-deposit`, {
          _id: selectedDeposit._id,
          status: "rejected",
        });

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
    }
  };
  // total deposits ----------

  const TotalDeposits = depositData.reduce(
    (total, item) => total + Number(item.deposit),
    0
  );
  // total pending deposits ----------

  const TotalPendingDeposits = depositData
    .filter((item) => item.status === "pending")
    .reduce((total, item) => total + Number(item.deposit), 0);
  // console.log("total pending", TotalPendingDeposits);

  // total Successfull deposits ----------

  const TotalSuccessfullDeposits = depositData
    .filter((item) => item.status === "approved")
    .reduce((total, item) => total + Number(item.deposit), 0);
  // console.log("total successfull", TotalSuccessfullDeposits);

  // total rejected deposits ----------

  const TotalRejectedDeposits = depositData
    .filter((item) => item.status === "rejected")
    .reduce((total, item) => total + Number(item.deposit), 0);
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

  const handleSearch = (e) => {
    e.preventDefault();
  };

  // search filtered data -----------------

  const getFilteredData = () => {
    let filtered = filterParamsData;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter((item) => {
        const userName = item.userId?.name?.toLowerCase() || "";
        const userEmail = item.userId?.email?.toLowerCase() || "";
        const account = item.mt5Account?.toLowerCase() || "";

        return (
          userName.includes(searchLower) ||
          userEmail.includes(searchLower) ||
          account.includes(searchLower)
        );
      });
    }

    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999); // Set to end of day

      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    return filtered;
  };

  const handleDateRangeSearch = (e) => {
    e.preventDefault();
    // The filtering is now handled in getFilteredData()
    // This function can be used to trigger a re-render if needed
    setDepositData([...depositData]);
  };
  // pagination -------------------
  const filteredData = getFilteredData();
  const usersPerPage = 10; // Adjust as needed
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredData.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredData.length / usersPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  // use effect -----------------

  useEffect(() => {
    fetchApiData();
  }, [status]);

  return (
    <div className="container mx-auto px-5">
      <div>
        <h1 className="text-2xl flex-col font-bold mb-4 text-white first-letter:uppercase">
          {status} Deposits
        </h1>
        <div className="w-full space-y-4 p-4">
          {/* User search form */}
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row w-full gap-2"
          >
            <input
              type="text"
              placeholder="User/Email/Account"
              className="flex-1 border outline-none text-gray-700 p-2 rounded sm:rounded-l sm:rounded-r-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="w-full sm:w-auto px-10 bg-primary-300 hover:bg-primary-400 text-white p-2 rounded sm:rounded-r sm:rounded-l-none transition-colors"
            >
              <Search size={20} className="mx-auto" />
            </button>
          </form>

          {/* Date range search form */}
          <form
            onSubmit={handleDateRangeSearch}
            className="flex flex-col sm:flex-row w-full gap-2"
          >
            <div className="flex-1 flex flex-col md:flex-row gap-2">
              <input
                type="date"
                className="w-full md:w-1/2 border text-gray-500 outline-none p-2 rounded sm:rounded-l sm:rounded-r-none"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
              />
              <input
                type="date"
                className="w-full md:w-1/2 text-gray-500 border outline-none p-2 rounded sm:rounded-none"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-10 bg-primary-300 hover:bg-primary-400 text-white p-2  rounded sm:rounded-r sm:rounded-l-none transition-colors"
            >
              <Search size={20} className="mx-auto" />
            </button>
          </form>
        </div>
      </div>

      <div className="overflow-x-auto">
        {isAll && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {stats.map((stat, index) => (
              <StatCard key={index} {...stat} />
            ))}
          </motion.div>
        )}
        <table className="min-w-full bg-primary-700">
          <thead className="bg-primary-400 text-white">
            <tr>
              <th className="py-2 px-4 text-left">User | Email</th>
              <th className="py-2 px-4 text-left">Account</th>
              <th className="py-2 px-4 text-left">Plan</th>
              <th className="py-2 px-4 text-left">Deposit</th>
              <th className="py-2 px-4 text-left">Requested Date</th>
              <th className="py-2 px-4 text-left">Proof</th>
              <th className="py-2 px-4 text-left">Status</th>
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
              currentUsers?.map((item) => (
                <tr key={item._id} className="border-b">
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
                  <td className="py-2 px-4">{item?.mt5Account}</td>
                  <td className="py-2 px-4">
                    <span className="bg-primary-400/20 whitespace-nowrap text-white px-2 py-1 rounded-full text-sm">
                      {item?.accountType}
                    </span>
                  </td>
                  <td className="py-2 px-4">${item?.deposit}</td>
                  <td className="py-3 whitespace-nowrap px-4">
                    <div>{formatDate(item?.createdAt)}</div>
                    <div className="text-sm text-gray-400">
                      {calculateTimeSinceJoined(item?.createdAt)}
                    </div>
                  </td>
                  <td className="py-2 px-4">
                    <button
                      className=" text-blue-500 hover:text-blue-600 transition-all"
                      onClick={() => togglePreview(item)}
                    >
                      view
                    </button>
                    {showPreview && (
                      <div className="fixed inset-0 bg-black/20 bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-primary-800 p-4  rounded-lg w-[30%] overflow-auto">
                          <img
                            src={
                              import.meta.env.VITE_BACKEND_BASE_URL +
                              "/" +
                              selectedDeposit?.depositSS
                            }
                            alt="Preview"
                            className=" w-full rounded-md h-auto"
                          />
                          <button
                            onClick={togglePreview}
                            className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="py-2 px-4">
                    <span className="bg-gray-200 first-letter:capitalize text-gray-800 px-2 py-1 rounded-full text-sm">
                      {item.status.charAt(0).toUpperCase() +
                        item.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-2 px-4">
                    {item.status === "pending" && (
                      <div className="flex items-center gap-5">
                        <button
                          className="text-green-400 hover:text-green-600 hover:scale-110 transition-all"
                          onClick={() => handleActionClick(item, "approve")}
                        >
                          <CircleCheckBig />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 hover:scale-110 transition-all"
                          onClick={() => handleActionClick(item, "reject")}
                        >
                          <CircleX />
                        </button>
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
        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-500 text-gray-900 cursor-not-allowed"
                : "bg-primary-500 text-white"
            }`}
          >
            Previous
          </button>
          <span className="text-white">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages
                ? "bg-gray-500 text-gray-900 cursor-not-allowed"
                : "bg-primary-500 text-white"
            }`}
          >
            Next
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
                <div>
                  <p>
                    User:{" "}
                    {selectedDeposit.userId?.firstName +
                      " " +
                      selectedDeposit.userId?.lastName}
                  </p>
                  <p>Email: {selectedDeposit.userId?.email}</p>
                  <p>Deposit Amount: ${selectedDeposit.deposit}</p>
                  <p>Account: {selectedDeposit.mt5Account}</p>
                  <p>Date: {formatDate(selectedDeposit.updatedAt)}</p>
                </div>
              )}
              <p className="mt-2">
                Are you sure you want to{" "}
                {actionType === "approve" ? "approve" : "reject"} this deposit?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleConfirmAction(selectedDeposit)}
            >
              Confirm {actionType === "approve" ? "Approval" : "Rejection"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DepositsStatus;
