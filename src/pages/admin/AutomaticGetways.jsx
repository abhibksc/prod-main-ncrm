import React, { useState } from "react";
import { Search, Edit } from "lucide-react";

const gatewaysData = [
  {
    id: 1,
    name: "Authorize.net",
    supportedCurrency: 11,
    enabledCurrency: 0,
    status: "Disabled",
  },
  {
    id: 2,
    name: "BTCPay",
    supportedCurrency: 2,
    enabledCurrency: 0,
    status: "Disabled",
  },
  {
    id: 3,
    name: "Blockchain",
    supportedCurrency: 1,
    enabledCurrency: 0,
    status: "Disabled",
  },
  {
    id: 4,
    name: "Cashmaal",
    supportedCurrency: 2,
    enabledCurrency: 0,
    status: "Disabled",
  },
  {
    id: 5,
    name: "Checkout",
    supportedCurrency: 10,
    enabledCurrency: 0,
    status: "Disabled",
  },
  {
    id: 6,
    name: "Coinbase Commerce",
    supportedCurrency: 166,
    enabledCurrency: 1,
    status: "Enabled",
  },
  {
    id: 7,
    name: "Coingate",
    supportedCurrency: 2,
    enabledCurrency: 0,
    status: "Disabled",
  },
  {
    id: 8,
    name: "CoinPayments",
    supportedCurrency: 88,
    enabledCurrency: 1,
    status: "Disabled",
  },
  {
    id: 9,
    name: "CoinPayments Fiat",
    supportedCurrency: 22,
    enabledCurrency: 0,
    status: "Disabled",
  },
  {
    id: 10,
    name: "Flutterwave",
    supportedCurrency: 25,
    enabledCurrency: 0,
    status: "Disabled",
  },
  {
    id: 11,
    name: "Instamojo",
    supportedCurrency: 1,
    enabledCurrency: 0,
    status: "Disabled",
  },
];

const AutomaticGateways = () => {
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

  return (
    <div className="container mx-auto px-10 py-5">
      <h1 className="text-2xl font-bold text-white ">Automatic Gateways</h1>
      <div className="flex justify-end mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2  border-primary-600 border-2 bg-neutral-800/60 rounded-lg"
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search
            className="absolute text-white/80 left-3 top-2.5 "
            size={20}
          />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-primary-700">
          <thead className="bg-primary-500 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Gateway</th>
              <th className="py-3 px-4 text-left">Supported Currency</th>
              <th className="py-3 px-4 text-left">Enabled Currency</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Action</th>
            </tr>
          </thead>
          <tbody className=" text-white">
            {gateways.map((gateway) => (
              <tr key={gateway.id} className="border-b hover:bg-primary-600/50">
                <td className="py-3 px-4">{gateway.name}</td>
                <td className="py-3 px-4">{gateway.supportedCurrency}</td>
                <td className="py-3 px-4">{gateway.enabledCurrency}</td>
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
                        ? "text-red-600 border border-red-600 hover:text-white hover:bg-red-500"
                        : "text-green-600 border border-green-600 hover:text-white hover:bg-green-700"
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

export default AutomaticGateways;
