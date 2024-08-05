import React, { useState, useEffect } from "react";
import { Filter } from "lucide-react";

const dummyData = [
  {
    user: "tt",
    userHandle: "@vXCDJhm",
    trx: "20GAQB7ZT212",
    transacted: "2024-08-02 11:09 AM",
    timeAgo: "2 days ago",
    amount: -100.0,
    postBalance: 100.0,
    details: "test",
  },
  {
    user: "tt",
    userHandle: "@vXCDJhm",
    trx: "G5BJSFVRD41K",
    transacted: "2024-08-02 11:07 AM",
    timeAgo: "2 days ago",
    amount: 200.0,
    postBalance: 200.0,
    details: "test",
  },
  // Add more dummy data here...
];

const TransactionReport = () => {
  const [filters, setFilters] = useState({
    trxUsername: "",
    type: "All",
    remark: "Any",
    startDate: "",
    endDate: "",
  });

  const [filteredData, setFilteredData] = useState(dummyData);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilter = (e) => {
    e.preventDefault();
    // Implement filtering logic here
    const filtered = dummyData.filter((item) => {
      const itemDate = new Date(item.transacted);
      const startDate = filters.startDate ? new Date(filters.startDate) : null;
      const endDate = filters.endDate ? new Date(filters.endDate) : null;

      return (
        (!filters.trxUsername ||
          item.trx.includes(filters.trxUsername) ||
          item.user.includes(filters.trxUsername)) &&
        (filters.type === "All" || item.type === filters.type) &&
        (filters.remark === "Any" || item.details.includes(filters.remark)) &&
        (!startDate || itemDate >= startDate) &&
        (!endDate || itemDate <= endDate)
      );
    });

    setFilteredData(filtered);
  };

  useEffect(() => {
    setFilteredData(dummyData);
  }, []);

  return (
    <div className="bg-primary-800 text-white px-10 py-5 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Transaction Logs</h1>

      <form
        onSubmit={handleFilter}
        className="mb-6 grid grid-cols-1 md:grid-cols-6 gap-4"
      >
        <input
          type="text"
          name="trxUsername"
          placeholder="TRX/Username"
          className="bg-gray-800 text-gray-100 p-2 rounded"
          value={filters.trxUsername}
          onChange={handleFilterChange}
        />
        <select
          name="type"
          className="bg-gray-800 text-gray-100 p-2 rounded"
          value={filters.type}
          onChange={handleFilterChange}
        >
          <option value="All">All</option>
          {/* Add more options as needed */}
        </select>
        <select
          name="remark"
          className="bg-gray-800 text-gray-100 p-2 rounded"
          value={filters.remark}
          onChange={handleFilterChange}
        >
          <option value="Any">Any</option>
          {/* Add more options as needed */}
        </select>
        <input
          type="date"
          name="startDate"
          placeholder="Start date"
          className="bg-gray-800 text-gray-100 p-2 rounded"
          value={filters.startDate}
          onChange={handleFilterChange}
        />
        <input
          type="date"
          name="endDate"
          placeholder="End date"
          className="bg-gray-800 text-gray-100 p-2 rounded"
          value={filters.endDate}
          onChange={handleFilterChange}
        />
        <button
          type="submit"
          className="bg-primary-400 text-white p-2 rounded flex items-center justify-center"
        >
          <Filter size={20} className="mr-2" /> Filter
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-primary-400 text-white">
            <tr>
              <th className="py-3 px-4 text-left">User</th>
              <th className="py-3 px-4 text-left">TRX</th>
              <th className="py-3 px-4 text-left">Transacted</th>
              <th className="py-3 px-4 text-right">Amount</th>
              <th className="py-3 px-4 text-right">Post Balance</th>
              <th className="py-3 px-4 text-left">Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item, index) => (
              <tr key={index} className="border-t border-gray-700">
                <td className="py-3 px-4">
                  <div>{item.user}</div>
                  <div className="text-blue-400 text-sm">{item.userHandle}</div>
                </td>
                <td className="py-3 px-4">{item.trx}</td>
                <td className="py-3 px-4">
                  <div>{item.transacted}</div>
                  <div className="text-gray-400 text-sm">{item.timeAgo}</div>
                </td>
                <td
                  className={`py-3 px-4 text-right ${
                    item.amount >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {item.amount >= 0 ? "+" : ""}
                  {item.amount.toFixed(2)} USD
                </td>
                <td className="py-3 px-4 text-right">
                  {item.postBalance.toFixed(2)} USD
                </td>
                <td className="py-3 px-4 text-gray-300">{item.details}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionReport;
