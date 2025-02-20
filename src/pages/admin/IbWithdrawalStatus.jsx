import React, { useEffect, useState } from "react";
import {
  ArrowLeftRight,
  CircleCheckBig,
  CircleGauge,
  CircleX,
  Loader,
  Search,
  WalletCardsIcon,
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

const IbWithdrawalStatus = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const { status } = useParams();
  const [depositData, setDepositData] = useState([]);
  const [selectedDeposit, setSelectedDeposit] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [actionType, setActionType] = useState("");
  const [loading, setLoading] = useState(false);
  const isAll = status === "all" ? true : false;
  const [currentPage, setCurrentPage] = useState(1);

  const fetchApiData = async () => {
    setLoading(true);
    try {
      const res = await backendApi.get(`/referral-withdrawals`);
      // console.log("res all withdrawals---", res.data.data);
      setDepositData(res.data.data.reverse());
      setLoading(false);
    } catch (error) {
      setLoading(false);

      console.log("Error while fetching all deposits--", error);
    }
  };

  let filterParamsData = depositData.filter((item) => item.status === status);
  if (status === "all") {
    filterParamsData = depositData.filter(
      (item) =>
        item.status === "pending" ||
        item.status === "rejected" ||
        item.status === "approved"
    );
  }
  console.log("filterParamsData---", filterParamsData);

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

  const handleActionClick = (deposit, action) => {
    setSelectedDeposit(deposit);
    setActionType(action);
    setIsDialogOpen(true);
  };

  // custom content -----------------

  // console.log("selected withdrawal####################", selectedDeposit);

  const currentDateTime = new Date();
  const formattedDateTime =
    currentDateTime.toLocaleDateString("en-GB") +
    ", " +
    currentDateTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // 12-hour format with AM/PM
    });

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
          <h1>IB Withdrawal Success</h1>
        </div>
        <div class="content">
          <p>Dear ${
            selectedDeposit?.userId?.firstName +
            " " +
            selectedDeposit?.userId?.lastName
          },</p>
  <p> Your withdrawal request has been successfully processed.</p>
        <div class="withdrawal-details">
          <p>IB ID: <span class="highlight">${
            selectedDeposit?.referralId
          }</span></p>
            <p>Withdrawal Amount: <span class="highlight">${
              selectedDeposit?.amount
            }</span></p>
      
            <p>Available Balance: <span class="highlight">${
              selectedDeposit?.totalBalance - selectedDeposit?.amount
            }</span></p>
           <p>Time Stamp: <span class="highlight">${formattedDateTime}</span></p>
          </div>

    <p>Thank you for choosing us.</p>
    <p>Happy trading!</p>

          <p>Best regards,<br>The ${
            import.meta.env.VITE_WEBSITE_NAME || "Forex"
          } Team</p>
          <hr>
     <div class="risk-warning">
      <strong>Risk Warning:</strong> Trading CFDs carries high risk and may result in losses beyond your initial investment. Trade only with money you can afford to lose and understand the risks.
      <br><br>
      our services are not for U.S. citizens or in jurisdictions where they violate local laws.
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
              import.meta.env.VITE_WEBSITE_NAME || "Forex"
            } traders. Please visit this page to know more about our Privacy Policy.</p>
            <p>&copy; 2024 ${
              import.meta.env.VITE_WEBSITE_NAME || "Forex"
            }. All Rights Reserved</p>
          </div>
        </div>
      </div>
    </body>
    </html>`;
  const handleConfirmAction = async (selectedDeposit) => {
    const toastId = toast.loading("Plese wait..");
    try {
      if (actionType === "approve") {
        const apiWithdrwalRes = await metaApi.get(
          `/MakeWithdrawBalance?Manager_Index=${
            import.meta.env.VITE_MANAGER_INDEX
          }&MT5Account=${selectedDeposit.referralId}&Amount=${
            selectedDeposit.amount
          }&Comment=ib-withdrawal`
        );
        const DBresWithdarwal = await backendApi.put(
          `/update-referral-withdrawal`,
          {
            id: selectedDeposit._id,
            status: "approved",
          }
        );

        const customMailRes = await backendApi.post(`/custom-mail`, {
          email: selectedDeposit.userId.email,
          content: customContent,
          subject: " IB Withdrawal Success",
        });
        toast.success("IB Withdrwal Approved", { id: toastId });

        // console.log("updated confirm data", res);
        // console.log("updated apiWithdrawalRes data", apiWithdrwalRes);

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
      } else if (actionType === "reject") {
        const res = await backendApi.put(`/update-referral-withdrawal`, {
          id: selectedDeposit._id,
          status: "rejected",
        });
        // console.log("updated rejection data", res);
        // toast.success("Withdrwal Rejected");

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
        toast.success("IB Withdrwal Rejected", { id: toastId });
      }
    } catch (error) {
      toast.error("Something went wrong", { id: toastId });
      console.error("Error updating IB withdrwal:", error);
    }
  };
  // total deposits ----------

  const TotalDeposits = depositData
    .reduce((total, item) => total + parseFloat(item.amount), 0)
    .toFixed(2);
  // console.log("total deposits", TotalDeposits);
  // total pending deposits ----------

  const TotalPendingDeposits = depositData
    .filter((item) => item.status === "pending")
    .reduce((total, item) => total + parseFloat(item.amount), 0)
    .toFixed(2);
  // console.log("total pending", TotalPendingDeposits);

  // total Successfull deposits ----------

  const TotalSuccessfullDeposits = depositData
    .filter((item) => item.status === "approved")
    .reduce((total, item) => total + parseFloat(item.amount), 0)
    .toFixed(2);
  // console.log("total successfull", TotalSuccessfullDeposits);

  // total rejected deposits ----------

  const TotalRejectedDeposits = depositData
    .filter((item) => item.status === "rejected")
    .reduce((total, item) => total + parseFloat(item.amount), 0)
    .toFixed(2);
  // console.log("Total rejected", TotalRejectedDeposits);

  // stats data------------

  const stats = [
    {
      icon: <ArrowLeftRight size={24} />,
      amount: TotalDeposits,
      label: "Total IB Withdrawals",
      bgColor: "bg-sky-800",
      link: "/admin/ib-withdrawal/all",
    },
    {
      icon: <ArrowLeftRight size={24} />,
      amount: TotalSuccessfullDeposits,
      label: "Successfull IB Withdrawals",
      bgColor: "bg-green-800",
      link: "/admin/ib-withdrawal/approved",
    },
    {
      icon: <ArrowLeftRight size={24} />,
      amount: TotalPendingDeposits,
      label: "Pending IB Withdrawals",
      bgColor: "bg-yellow-800",
      link: "/admin/ib-withdrawal/pending",
    },
    {
      icon: <ArrowLeftRight size={24} />,
      amount: TotalRejectedDeposits,
      label: "Rejected IB Withdrawals",
      bgColor: "bg-orange-800",
      link: "/admin/ib-withdrawal/rejected",
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
    <div className=" whitespace-nowrap mx-auto px-10 py-5">
      <h1 className="text-2xl font-bold mb-4 text-white first-letter:uppercase">
        {status} IB Withdrawals
      </h1>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
        <div className=" flex justify-between ">
          <form onSubmit={handleSearch} className="flex items-center">
            <input
              type="text"
              placeholder="User/Email/Account"
              className="border p-2 rounded-l text-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              type="submit"
              className="bg-primary-300 text-white p-2 rounded-r"
            >
              <Search size={25} />
            </button>
          </form>
        </div>
        <form
          onSubmit={handleDateRangeSearch}
          className="flex flex-col md:flex-row gap-1"
        >
          <input
            type="date"
            className="border p-2 text-gray-400 rounded-l"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange({ ...dateRange, start: e.target.value })
            }
          />
          <input
            type="date"
            className="border text-gray-400 p-2"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange({ ...dateRange, end: e.target.value })
            }
          />
          <button
            type="submit"
            className="bg-primary-300 flex text-white p-2 rounded-md md:rounded-r"
          >
            <Search size={20} className=" mx-auto" />
          </button>
        </form>
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
              <th className="py-2 px-4 text-left">IB ID</th>
              <th className="py-2 px-4 text-left">Last Balance</th>
              <th className="py-2 px-4 text-left">Withdrawal Amount</th>
              <th className="py-2 px-4 text-left">Method</th>
              <th className="py-2 px-4 text-left">Requested Date</th>
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
                      {item?.userId ? item?.userId?.email : "Not found!!"}
                    </div>
                  </td>
                  <td className="py-2 px-4">{item?.referralId}</td>
                  <td className="py-2 px-4 text-center">
                    {item?.totalBalance}
                  </td>
                  <td className="py-2 px-4 text-center">{item?.amount}</td>
                  <td className="py-2 px-4">{item?.method}</td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div>{formatDate(item?.createdAt)}</div>
                    <div className="text-sm text-gray-400">
                      {calculateTimeSinceJoined(item?.createdAt)}
                    </div>
                  </td>{" "}
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
              {actionType === "approve"
                ? "Approve Withdrawal"
                : "Reject Withdrawal"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedDeposit && (
                <div>
                  <div>
                    {/* <li className=" text-lg font-semibold mb-1">User Info</li> */}
                    <p>
                      User:{" "}
                      {selectedDeposit.userId?.firstName +
                        " " +
                        selectedDeposit.userId?.lastName}
                    </p>
                    <p>Email: {selectedDeposit.userId?.email}</p>
                    <p>Withdrwal Amount: ${selectedDeposit?.amount}</p>
                    <p>Account: {selectedDeposit?.mt5Account}</p>
                    <p>Date: {formatDate(selectedDeposit?.updatedAt)}</p>
                  </div>
                  <div>
                    <li className=" text-lg my-4 font-semibold mb-1">
                      Payment Info
                    </li>
                    {selectedDeposit.method === "Bank Transfer" ? (
                      <div>
                        <div className=" flex items-center gap-2 my-2">
                          <WalletCardsIcon size={20}></WalletCardsIcon>
                          <h1 className=" font-bold">
                            {selectedDeposit?.method}
                          </h1>
                        </div>{" "}
                        <div>
                          <p>
                            Bank Name -{" "}
                            <span className=" font-bold">
                              {selectedDeposit?.userId?.bankDetails?.bankName}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p>
                            Holder Name -{" "}
                            <span className=" font-bold">
                              {selectedDeposit?.userId?.bankDetails?.holderName}
                            </span>{" "}
                          </p>
                        </div>
                        <div>
                          <p>
                            Account Number -{" "}
                            <span className=" font-bold">
                              {
                                selectedDeposit?.userId?.bankDetails
                                  ?.accountNumber
                              }
                            </span>
                          </p>
                        </div>
                        <div>
                          <p>
                            IFSC Code -{" "}
                            <span className=" font-bold">
                              {selectedDeposit?.userId?.bankDetails?.ifscCode}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p>
                            Swift Code -{" "}
                            <span className=" font-bold">
                              {selectedDeposit?.userId?.bankDetails?.swiftCode}
                            </span>
                          </p>
                        </div>
                        <div>
                          <p>
                            UPI ID -{" "}
                            <span className=" font-bold">
                              {selectedDeposit?.userId?.bankDetails?.upiId}
                            </span>
                          </p>
                        </div>
                      </div>
                    ) : selectedDeposit?.method === "TRX" ? (
                      <div>
                        <div className=" flex gap-1">
                          <WalletCardsIcon size={20}></WalletCardsIcon>
                          <p>
                            TRX Address -
                            <span className=" font-bold">
                              {
                                selectedDeposit?.userId?.walletDetails
                                  ?.trxAddress
                              }
                            </span>
                          </p>
                        </div>
                      </div>
                    ) : selectedDeposit?.method === "Ethereum" ? (
                      <div className=" flex items-center gap-1">
                        <WalletCardsIcon size={20}></WalletCardsIcon>

                        <p>
                          Ethereum Address -{" "}
                          <span className=" font-bold">
                            {selectedDeposit?.userId?.walletDetails?.ethAddress}
                          </span>{" "}
                        </p>
                      </div>
                    ) : selectedDeposit?.method === "Thether" ? (
                      <div className=" flex items-center gap-1">
                        <WalletCardsIcon size={20}></WalletCardsIcon>{" "}
                        <p>
                          Thether Address -{" "}
                          <span className=" font-bold">
                            {
                              selectedDeposit?.userId?.walletDetails
                                ?.tetherAddress
                            }{" "}
                          </span>
                        </p>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                </div>
              )}
              <p className="mt-2">
                Are you sure you want to{" "}
                {actionType === "approve" ? "approve" : "reject"} this Withdraw?
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

export default IbWithdrawalStatus;
