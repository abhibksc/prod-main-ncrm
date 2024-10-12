import React, { useEffect, useState } from "react";
import {
  ArrowLeftRight,
  CircleCheckBig,
  CircleX,
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
import {
  setCurrentAccount,
  setDepositBalance,
  setMasterPassword,
} from "@/redux/user/userSlice";
import toast from "react-hot-toast";
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

  const formData = useStore((store) => store.user.userFormData);
  const randomNumber = Math.floor(1000000 + Math.random() * 9000000).toString();

  const fetchApiData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/deposits`
      );
      // console.log("res all deposits---", res.data.data);
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
          <h1>Challenge Created</h1>
        </div>
        <div class="content">
          <p>Dear ${selectedDeposit?.name},</p>
  <p>We are pleased to inform you that your initial deposit has been successfully credited to your account</p>
         <div class="withdrawal-details">

          <p>Account No: <span class="highlight">${
            selectedDeposit?.mt5Account
          }</span></p>
            <p>Challenge Type: <span class="highlight">${
              selectedDeposit?.accountType
            }</span></p>
            <p>Account Size: <span class="highlight">$ ${
              selectedDeposit?.balance
            }</span></p>
            <p>Deposit Balance: <span class="highlight">$ ${
              selectedDeposit?.deposit
            }</span></p>
            <p>Phase: <span class="highlight">${1}</span></p>
            <p>Status: <span class="highlight">${"Active"}</span></p>
            <p>Master Password: <span class="highlight">${
              apiMasterPassword || "000"
            }</span></p>
            <p>Investor Password: <span class="highlight">${
              apiInvestorPassword || "000"
            }</span></p>
            <p>Server Name: <span class="highlight">${"General"}</span></p>
          </div>
    
    <p>Thank you for choosing us.</p>
    <p>Happy trading!</p>
          
          <p>Best regards,<br>The Arena Trade Team</p>

           <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f0f8ff; margin: 20px 0; border-radius: 15px;">
          <tr>
            <td align="center" style="padding: 20px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center" width="33%" style="padding: 0 10px;">
                    <a href="#" style="display: inline-block; text-decoration: none; color: #ffffff; background-color: #2d6a4f; padding: 15px 20px; border-radius: 8px; font-weight: bold; transition: background-color 0.3s;">
                      <img src="https://cdn-icons-png.flaticon.com/512/14/14415.png" alt="Android" width="24" height="24" style="vertical-align: middle; margin-right: 10px;">
                      <span style="vertical-align: middle;">Android</span>
                    </a>
                  </td>
                  <td align="center" width="33%" style="padding: 0 10px;">
                    <a href="#" style="display: inline-block; text-decoration: none; color: #ffffff; background-color: #2d6a4f; padding: 15px 20px; border-radius: 8px; font-weight: bold; transition: background-color 0.3s;">
                      <img src="https://cdn3.iconfinder.com/data/icons/social-media-logos-glyph/2048/5315_-_Apple-512.png" alt="iOS" width="24" height="24" style="vertical-align: middle; margin-right: 10px;">
                      <span style="vertical-align: middle;">iOS</span>
                    </a>
                  </td>
                  <td align="center" width="33%" style="padding: 0 10px;">
                    <a href="#" style="display: inline-block; text-decoration: none; color: #ffffff; background-color: #2d6a4f; padding: 15px 20px; border-radius: 8px; font-weight: bold; transition: background-color 0.3s;">
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
      Arena Trade’s services are not for U.S. citizens or in jurisdictions where they violate local laws.
    </div>
        
    
        </div>
        <div class="footer">
          <div class="footer-info">    
            <p>35-37, Ludgate Hill, London Post Box: EC4M7JN United Kingdom | P.O. Box 151</p>
            <p>Website: <a href="http://www.capitalstreetfx.com">www.capitalstreetfx.com</a> | E-mail: <a href="mailto:support@capitalstreetfx.com">support@capitalstreetfx.com</a></p>
            <p>WHATSAPP US: +760-7500-0197 | SKYPE US: dfhhgffdfdgfgx.support</p>
            <p>We sent out this message to all existing Alena Traders. Please visit this page to know more about our Privacy Policy.</p>
            <p>&copy; 2024 Arena Trade 2012-2021. All Rights Reserved</p>
          </div>
        </div>
      </div>
    </body>
    </html>`;

  console.log("selected deposit!!!!", selectedDeposit);

  const handleConfirmAction = async (selectedDeposit) => {
    const toastId = toast.loading("Plese wait..");
    // console.log("selected deposits--", selectedDeposit);
    try {
      if (actionType === "approve") {
        const addUserApi = await axios.post(
          `${import.meta.env.VITE_API_END_POINT}/api/web/Adduser`,

          {
            Manager_Index: selectedDeposit.managerIndex,
            MT5Account: selectedDeposit.mt5Account,
            Name: selectedDeposit.name,
            Country: selectedDeposit.country,
            Leverage: selectedDeposit.leverage,
            Group_Name: selectedDeposit.groupName,
          }
        );

        const depositApires = await axios.get(
          `${
            import.meta.env.VITE_API_END_POINT
          }/api/web/MakeDepositBalance?Manager_Index=${
            selectedDeposit.managerIndex
          }&MT5Account=${selectedDeposit.mt5Account}&Amount=${
            selectedDeposit.balance
          }&Comment=TEST`
        );

        const updateDepositRes = await axios.put(
          `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/update-deposit`,
          {
            _id: selectedDeposit._id,
            status: "approved",
          }
        );

        const updateChallengeDB = await axios.put(
          `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/update-challenge`,
          {
            mt5Account: selectedDeposit.mt5Account,
            status: "active",
            balance: selectedDeposit.balance,
          }
        );
        const updateLoggedUser = await axios.put(
          `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/update-user`,
          {
            id: selectedDeposit.userId,
            accountSize: selectedDeposit.balance,
            depositBalance: selectedDeposit.deposit,
            phase: 1,
            masterPassword: addUserApi.data.Master_Pwd,
            investorPassword: addUserApi.data.Investor_Pwd,
            mt5Account: selectedDeposit.mt5Account,
            accountType: selectedDeposit.accountType,
            leverage: selectedDeposit.leverage,
          }
        );

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
        setApiMasterPassword(addUserApi.data.Master_Pwd);
        setApiInvestorPassword(addUserApi.data.Investor_Pwd);
        toast.success("Account created", { id: toastId });

        console.log(" add user api---", addUserApi.data);

        const customMailRes = await axios.post(
          `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/custom-mail`,
          {
            email: selectedDeposit.email,
            content: customContent,
            subject: "Challenge Added",
          }
        );
      } else if (actionType === "reject") {
        const res = await axios.put(
          `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/update-deposit`,
          {
            _id: selectedDeposit._id,
            status: "rejected",
          }
        );
        console.log("updated rejection data", res);

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
        toast.success("Account rejected", { id: toastId });
      }
    } catch (error) {
      console.error("Error updating deposit status:", error);
      toast.error("Something went wrong", { id: toastId });
    }
  };
  // total deposits ----------

  const TotalDeposits = depositData.reduce(
    (total, item) => total + parseFloat(item.deposit),
    0
  );
  // console.log("total deposits", TotalDeposits);
  // total pending deposits ----------

  const TotalPendingDeposits = depositData
    .filter((item) => item.status === "pending")
    .reduce((total, item) => total + parseFloat(item.deposit), 0);
  // console.log("total pending", TotalPendingDeposits);

  // total Successfull deposits ----------

  const TotalSuccessfullDeposits = depositData
    .filter((item) => item.status === "approved")
    .reduce((total, item) => total + parseFloat(item.deposit), 0);
  // console.log("total successfull", TotalSuccessfullDeposits);

  // total rejected deposits ----------

  const TotalRejectedDeposits = depositData
    .filter((item) => item.status === "rejected")
    .reduce((total, item) => total + parseFloat(item.deposit), 0);
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

  // use effect -----------------

  useEffect(() => {
    fetchApiData();
  }, [status]);
  const filteredData = getFilteredData();

  return (
    <div className="container mx-auto px-10 py-5">
      <h1 className="text-2xl font-bold mb-4 text-white first-letter:uppercase">
        {status} Deposits
      </h1>

      <div className="flex justify-between mb-4">
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            placeholder="User/Email/Account"
            className="border p-2 rounded-l"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="bg-primary-300 text-white p-2 rounded-r"
          >
            <Search size={20} />
          </button>
        </form>
        <form onSubmit={handleDateRangeSearch} className="flex">
          <input
            type="date"
            className="border p-2 rounded-l"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange({ ...dateRange, start: e.target.value })
            }
          />
          <input
            type="date"
            className="border p-2"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange({ ...dateRange, end: e.target.value })
            }
          />
          <button
            type="submit"
            className="bg-primary-300 text-white p-2 rounded-r"
          >
            <Search size={20} />
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
              <th className="py-2 px-4 text-left">Account</th>
              <th className="py-2 px-4 text-left">Plan</th>
              <th className="py-2 px-4 text-left">Deposit</th>
              <th className="py-2 px-4 text-left">Ac Size</th>
              <th className="py-2 px-4 text-left">Balance</th>
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
              filteredData?.map((item) => (
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
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                      {"Silver"}
                    </span>
                  </td>
                  <td className="py-2 px-4">{item?.deposit}</td>
                  <td className="py-2 px-4">5000</td>
                  <td className="py-2 px-4">{item?.balance}</td>
                  <td className="py-2 px-4">{formatDate(item?.createdAt)}</td>
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
                  <p>User: {selectedDeposit.userId?.name}</p>
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
