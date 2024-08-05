import React from "react";
import { Search, Calendar, Filter } from "lucide-react";
import { useParams } from "react-router-dom";

const dummyData = [
  {
    id: 1,
    user: "john_doe",
    trx: "TRX123456",
    transacted: "2024-08-01",
    amount: "$1000",
    postBalance: "$5000",
  },
  {
    id: 2,
    user: "jane_smith",
    trx: "TRX789012",
    transacted: "2024-08-02",
    amount: "$1500",
    postBalance: "$7500",
  },
  {
    id: 3,
    user: "bob_johnson",
    trx: "TRX345678",
    transacted: "2024-08-03",
    amount: "$2000",
    postBalance: "$10000",
  },
  {
    id: 4,
    user: "alice_williams",
    trx: "TRX901234",
    transacted: "2024-08-04",
    amount: "$500",
    postBalance: "$2500",
  },
];

const ReportStatus = () => {
  const { status } = useParams();
  return (
    <div className="bg-gray-900 text-gray-100 px-10 py-5 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 first-letter:uppercase">
        {status} Logs
      </h2>

      <div className="flex items-center flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <label htmlFor="trx" className="block text-sm font-medium mb-1">
            TRX/Username
          </label>
          <div className="relative">
            <input
              id="trx"
              type="text"
              className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Search..."
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <div className="flex-1">
          <label htmlFor="date" className="block text-sm font-medium mb-1">
            Date
          </label>
          <div className="relative">
            <input
              id="date"
              type="text"
              className="w-full bg-gray-800 border border-gray-700 rounded-md py-2 px-4 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-600"
              placeholder="Start date - End date"
            />
            <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>
        <button className="bg-primary-400 hover:bg-primary-500 mt-5 text-white py-1 px-4 rounded-md h-10  flex justify-center items-center">
          <Filter className="h-5 w-5 mr-2" />
          Filter
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-primary-400 text-left">
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">TRX</th>
              <th className="py-3 px-4">Transacted</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Post Balance</th>
              <th className="py-3 px-4">Details</th>
            </tr>
          </thead>
          <tbody>
            {dummyData.map((row) => (
              <tr key={row.id} className="border-b border-gray-800">
                <td className="py-3 px-4">{row.user}</td>
                <td className="py-3 px-4">{row.trx}</td>
                <td className="py-3 px-4">{row.transacted}</td>
                <td className="py-3 px-4">{row.amount}</td>
                <td className="py-3 px-4">{row.postBalance}</td>
                <td className="py-3 px-4">
                  <button className="bg-primary-500 hover:bg-primary-600 text-white py-1 px-3 rounded-md text-sm">
                    View
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

export default ReportStatus;
