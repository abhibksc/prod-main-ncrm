import React, { useState } from "react";
import { ArrowLeftRight, CreditCard, Search, Wallet } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const dummyData = [
  {
    id: 1,
    gateway: "Perfect Money",
    transaction: "AX1WHKZ5T6KH",
    initiated: "2024-07-31 09:45 AM",
    user: "John Doe",
    userHandle: "@jdoe123",
    amount: 95.0,
    conversion: "1 USD = 1.00 USD",
    type: "Wallet",
    status: "Initiated",
  },
  {
    id: 2,
    gateway: "PayPal",
    transaction: "BY2FGLS7U8PL",
    initiated: "2024-07-30 11:15 AM",
    user: "Jane Smith",
    userHandle: "@jsmith456",
    amount: 120.5,
    conversion: "1 USD = 1.00 USD",
    type: "Card",
    status: "Completed",
  },
  {
    id: 3,
    gateway: "Skrill",
    transaction: "CZ3HGKS9W9ZM",
    initiated: "2024-07-29 03:30 PM",
    user: "Mike Johnson",
    userHandle: "@mjohnson789",
    amount: 150.0,
    conversion: "1 USD = 1.00 USD",
    type: "Bank",
    status: "Failed",
  },
  {
    id: 4,
    gateway: "Neteller",
    transaction: "DX4IKJS0X0QK",
    initiated: "2024-07-28 08:00 AM",
    user: "Emily Davis",
    userHandle: "@edavis101",
    amount: 200.0,
    conversion: "1 USD = 1.00 USD",
    type: "Wallet",
    status: "Initiated",
  },
  {
    id: 5,
    gateway: "Stripe",
    transaction: "EY5JLMS1Y1TR",
    initiated: "2024-07-27 06:45 PM",
    user: "Chris Brown",
    userHandle: "@cbrown202",
    amount: 175.0,
    conversion: "1 USD = 1.00 USD",
    type: "Card",
    status: "Pending",
  },
  {
    id: 6,
    gateway: "Payoneer",
    transaction: "FZ6KMNS2Z2VH",
    initiated: "2024-07-26 02:30 PM",
    user: "Olivia Wilson",
    userHandle: "@owilson303",
    amount: 110.0,
    conversion: "1 USD = 1.00 USD",
    type: "Bank",
    status: "Completed",
  },
  {
    id: 7,
    gateway: "Bitcoin",
    transaction: "GZ7LNPT3A3WI",
    initiated: "2024-07-25 10:00 AM",
    user: "Liam Martinez",
    userHandle: "@lmartinez404",
    amount: 300.0,
    conversion: "1 USD = 1.00 USD",
    type: "Crypto",
    status: "Initiated",
  },
  {
    id: 8,
    gateway: "Ethereum",
    transaction: "HZ8MOPT4B4XJ",
    initiated: "2024-07-24 01:15 PM",
    user: "Sophia Anderson",
    userHandle: "@sanderson505",
    amount: 250.0,
    conversion: "1 USD = 1.00 USD",
    type: "Crypto",
    status: "Completed",
  },
  {
    id: 9,
    gateway: "Litecoin",
    transaction: "IZ9NOPU5C5YK",
    initiated: "2024-07-23 04:45 PM",
    user: "Noah Thomas",
    userHandle: "@nthomas606",
    amount: 180.0,
    conversion: "1 USD = 1.00 USD",
    type: "Crypto",
    status: "Pending",
  },
  {
    id: 10,
    gateway: "Ripple",
    transaction: "JZ0OPVU6D6ZL",
    initiated: "2024-07-22 07:30 AM",
    user: "Ava White",
    userHandle: "@awhite707",
    amount: 220.0,
    conversion: "1 USD = 1.00 USD",
    type: "Crypto",
    status: "Failed",
  },
  {
    id: 11,
    gateway: "Bank Transfer",
    transaction: "KZ1PQWV7E7ZM",
    initiated: "2024-07-21 09:45 AM",
    user: "James Taylor",
    userHandle: "@jtaylor808",
    amount: 140.0,
    conversion: "1 USD = 1.00 USD",
    type: "Bank",
    status: "Initiated",
  },
  {
    id: 12,
    gateway: "Western Union",
    transaction: "LZ2QRWX8F8ZN",
    initiated: "2024-07-20 11:00 AM",
    user: "Mia Lee",
    userHandle: "@mlee909",
    amount: 170.0,
    conversion: "1 USD = 1.00 USD",
    type: "Cash",
    status: "Completed",
  },
  {
    id: 13,
    gateway: "MoneyGram",
    transaction: "MZ3RSXY9G9ZO",
    initiated: "2024-07-19 03:15 PM",
    user: "Ethan Harris",
    userHandle: "@eharris010",
    amount: 130.0,
    conversion: "1 USD = 1.00 USD",
    type: "Cash",
    status: "Pending",
  },
  {
    id: 14,
    gateway: "Perfect Money",
    transaction: "NZ4STYZ0H0ZP",
    initiated: "2024-07-18 05:45 PM",
    user: "Charlotte Clark",
    userHandle: "@cclark111",
    amount: 90.0,
    conversion: "1 USD = 1.00 USD",
    type: "Wallet",
    status: "Failed",
  },
  {
    id: 15,
    gateway: "PayPal",
    transaction: "OZ5TUZ11I1ZQ",
    initiated: "2024-07-17 08:00 AM",
    user: "Benjamin Lewis",
    userHandle: "@blewis212",
    amount: 160.0,
    conversion: "1 USD = 1.00 USD",
    type: "Card",
    status: "Completed",
  },
  {
    id: 16,
    gateway: "Skrill",
    transaction: "PZ6UVZ22J2ZR",
    initiated: "2024-07-16 10:30 AM",
    user: "Amelia Walker",
    userHandle: "@awalker313",
    amount: 115.0,
    conversion: "1 USD = 1.00 USD",
    type: "Bank",
    status: "Initiated",
  },
];

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

const stats = [
  {
    icon: <ArrowLeftRight size={24} />,
    amount: "$100.00",
    label: "Successfull Deposits",
    bgColor: "bg-green-800",
    link: "successfull",
  },
  {
    icon: <ArrowLeftRight size={24} />,
    amount: "$1,000.00",
    label: "Pending Deposits",
    bgColor: "bg-yellow-800",
    link: "/admin/deposit/pending",
  },
  {
    icon: <ArrowLeftRight size={24} />,
    amount: "$0.00",
    label: "Rejected Deposits",
    bgColor: "bg-orange-800",
    link: "/admin/deposit/rejected",
  },
  {
    icon: <ArrowLeftRight size={24} />,
    amount: "4",
    label: "Initiated Deposits",
    bgColor: "bg-blue-800",
    link: "/admin/deposit/initiated",
  },
];

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

  const isAll = status === "all" ? true : false;

  // console.log("isAll", isAll);

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
  };

  const handleDateRangeSearch = (e) => {
    e.preventDefault();
    // Implement date range search functionality here
  };

  return (
    <div className="container mx-auto px-10 py-5">
      <h1 className="text-2xl font-bold mb-4  text-white first-letter:uppercase">
        {status} Deposits
      </h1>

      <div className="flex justify-between mb-4">
        <form onSubmit={handleSearch} className="flex">
          <input
            type="text"
            placeholder="Search..."
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
              <th className="py-2 px-4 text-left">Gateway | Transaction</th>
              <th className="py-2 px-4 text-left">Initiated</th>
              <th className="py-2 px-4 text-left">User</th>
              <th className="py-2 px-4 text-left">Amount</th>
              <th className="py-2 px-4 text-left">Conversion</th>
              <th className="py-2 px-4 text-left">Type</th>
              <th className="py-2 px-4 text-left">Status</th>
              <th className="py-2 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody className=" text-white">
            {dummyData.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-2 px-4">
                  <div className="text-blue-400 font-semibold">
                    {item.gateway}
                  </div>
                  <div className=" text-white text-sm">{item.transaction}</div>
                </td>
                <td className="py-2 px-4">{item.initiated}</td>
                <td className="py-2 px-4">
                  <div>{item.user}</div>
                  <div className="text-blue-400 text-sm">{item.userHandle}</div>
                </td>
                <td className="py-2 px-4">${item.amount.toFixed(2)} USD</td>
                <td className="py-2 px-4">{item.conversion}</td>
                <td className="py-2 px-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                    {item.type}
                  </span>
                </td>
                <td className="py-2 px-4">
                  <span className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm">
                    {item.status}
                  </span>
                </td>
                <td className="py-2 px-4">
                  <button className="text-blue-400 hover:underline">
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepositsStatus;
