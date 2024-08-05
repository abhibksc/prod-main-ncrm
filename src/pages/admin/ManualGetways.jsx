import React, { useState } from "react";
import { Search, Edit, Eye, Plus } from "lucide-react";

const gatewaysData = [
  { id: 1, name: "Tether (USDT Trc20)", status: "Disabled" },
  { id: 2, name: "Tether (USDT Trc20)", status: "Disabled" },
  { id: 3, name: "Bank Transfer", status: "Disabled" },
];

const ManualGateways = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [gateways, setGateways] = useState(gatewaysData);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    const filteredGateways = gatewaysData.filter((gateway) =>
      gateway.name.toLowerCase().includes(event.target.value.toLowerCase())
    );
    setGateways(filteredGateways);
  };

  const handleToggleStatus = (id) => {
    setGateways(
      gateways.map((gateway) => {
        if (gateway.id === id) {
          const newStatus =
            gateway.status === "Enabled" ? "Disabled" : "Enabled";
          return { ...gateway, status: newStatus };
        }
        return gateway;
      })
    );
  };

  const handleAddNew = () => {
    // Implement the logic to add a new gateway
    console.log("Add new gateway");
  };

  return (
    <div className="container mx-auto px-10 py-5">
      <h1 className="text-2xl font-bold mb-5 text-white">Manual Gateways</h1>
      <div className="flex justify-between mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2  border-primary-600 border-2 bg-neutral-800/60 rounded-lg"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search
            className="absolute left-3 text-white/60 top-2.5 "
            size={20}
          />
        </div>
        <button
          onClick={handleAddNew}
          className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center hover:bg-primary-600"
        >
          <Plus size={20} className="mr-2" />
          Add New
        </button>
      </div>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full">
          <thead className="bg-primary-500 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Gateway</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody className=" text-white bg-primary-700">
            {gateways.map((gateway) => (
              <tr key={gateway.id} className="border-b hover:bg-primary-600/60">
                <td className="py-3 px-4">{gateway.name}</td>
                <td className="py-3 px-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      gateway.status === "Enabled"
                        ? "bg-green-200 text-green-800"
                        : "bg-orange-200 text-orange-800"
                    }`}
                  >
                    {gateway.status}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button className="mr-2 text-indigo-600 hover:text-indigo-800">
                    <Edit size={18} />
                  </button>
                  <button
                    className={`px-3 py-1 rounded-md text-sm ${
                      gateway.status === "Enabled"
                        ? "text-red-600 border border-red-600 hover:bg-red-50"
                        : "text-green-600 border border-green-600 hover:bg-green-50"
                    }`}
                    onClick={() => handleToggleStatus(gateway.id)}
                  >
                    {gateway.status === "Enabled" ? "Disable" : "Enable"}
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

export default ManualGateways;
