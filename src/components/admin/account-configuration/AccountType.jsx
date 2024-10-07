import React, { useState, useEffect } from "react";
import { PlusCircle, Trash, Trash2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const AccountTypes = () => {
  const [accountTypes, setAccountTypes] = useState([]);
  const [existingData, setExistingData] = useState([]);
  const [newAccountType, setNewAccountType] = useState({
    accountType: "",
    leverage: [{ label: "", value: "" }],
    accountSize: [{ deposit: "", balance: "" }],
  });

  const fetchAccountTypes = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_END_POINT}/api/auth/get-custom-groups`
      );
      //   console.log("res account types--", res.data.data);

      setAccountTypes(res.data.data);
    } catch (error) {
      console.log("Error fetching account types", error);
    }
  };
  const fetchExistingData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_END_POINT}/api/auth/get-account-types`
      );

      setExistingData(res.data.data);
      //   console.log("existing data res", res.data);
    } catch (error) {
      console.log("Error fetching existing ac types data", error);
    }
  };

  const handleInputChange = (e, index, field, subfield) => {
    const { name, value } = e.target;
    setNewAccountType((prev) => {
      const updated = { ...prev };
      if (field) {
        updated[field][index][subfield] = value;
      } else {
        updated[name] = value;
      }
      return updated;
    });
  };

  const addField = (field) => {
    setNewAccountType((prev) => ({
      ...prev,
      [field]: [
        ...prev[field],
        field === "leverage"
          ? { label: "", value: "" }
          : { deposit: "", balance: "" },
      ],
    }));
  };

  const removeField = (field, index) => {
    setNewAccountType((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/add-account-type`,
        {
          accountType: newAccountType.accountType,
          leverage: newAccountType.leverage,
          accountSize: newAccountType.accountSize,
        }
      );
      //   console.log("add account type---", res.data);

      if (res.data.status) {
        setNewAccountType({
          accountType: "",
          leverage: [{ label: "", value: "" }],
          accountSize: [{ deposit: "", balance: "" }],
        });
        toast.success("Account type Added");
        fetchExistingData();
      }
    } catch (error) {
      console.error("Error adding account type:", error);
    }
  };
  const deleteHandler = async (id) => {
    try {
      const res = await axios.delete(
        `${
          import.meta.env.VITE_BECKEND_END_POINT
        }/api/auth/delete-account-type?id=${id}`
      );
      toast.success("Account type deleted");
      fetchExistingData();
    } catch (error) {
      console.log("error in deleting account type", error);
    }
  };
  useEffect(() => {
    fetchAccountTypes();
    fetchExistingData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-white">
        Configure Account Type
      </h1>

      <div className="bg-primary-700 text-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add New Account Type</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-2 font-medium">Account Type</label>
            <select
              name="accountType"
              value={newAccountType.accountType}
              onChange={(e) => handleInputChange(e)}
              required
              className="w-full px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an account type</option>
              {accountTypes?.map((type) => (
                <option key={type._id} value={type?.customGroup}>
                  {type?.customGroup}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">Leverage</label>
            {newAccountType.leverage.map((lev, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Label (e.g. 1:100)"
                  value={lev.label}
                  onChange={(e) =>
                    handleInputChange(e, index, "leverage", "label")
                  }
                  required
                  className="flex-1  text-black px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Value"
                  value={lev.value}
                  onChange={(e) =>
                    handleInputChange(e, index, "leverage", "value")
                  }
                  required
                  className="flex-1 px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeField("leverage", index)}
                  className="px-2 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addField("leverage")}
              className="mt-2 flex items-center text-black px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Add Leverage
            </button>
          </div>

          <div>
            <label className="block mb-2 font-medium">Account Size</label>
            {newAccountType.accountSize.map((size, index) => (
              <div key={index} className="flex space-x-2 mb-2">
                <input
                  type="text"
                  placeholder="Deposit (payable)"
                  value={size.deposit}
                  onChange={(e) =>
                    handleInputChange(e, index, "accountSize", "deposit")
                  }
                  required
                  className="flex-1 px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                  type="text"
                  placeholder="Balance"
                  value={size.balance}
                  onChange={(e) =>
                    handleInputChange(e, index, "accountSize", "balance")
                  }
                  required
                  className="flex-1 px-3 text-black py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => removeField("accountSize", index)}
                  className="px-2 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addField("accountSize")}
              className="mt-2 flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <PlusCircle className="h-5 w-5 mr-2" /> Add Account Size
            </button>
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            Add Account Type
          </button>
        </form>
      </div>

      <div className="bg-primary-700 text-white shadow-md rounded-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Existing Account Types</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary-400">
                <th className="px-4 py-2 text-left">Account Type</th>
                <th className="px-4 py-2 text-left">Leverage</th>
                <th className="px-4 py-2 text-left">Account Size</th>
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {existingData?.map((type) => (
                <tr key={type._id} className="border-t">
                  <td className="px-4 py-2">{type?.accountType}</td>
                  <td className="px-4 py-2">
                    {type?.leverage?.map((leverage) => (
                      <div
                        key={leverage._id}
                        className=" border-b-2 border-primary-600"
                      >
                        <p>Lebel - {leverage?.label}</p>
                        <p>Value - {leverage?.value}</p>
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-2">
                    {type?.accountSize?.map((size) => (
                      <div
                        key={size._id}
                        className=" border-b-2 border-primary-600"
                      >
                        <p>Deposit - {size?.deposit}</p>
                        <p>Balance - {size?.balance}</p>
                      </div>
                    ))}
                  </td>
                  <td className="px-4 py-2 ">
                    <div className=" flex justify-center items-center text-red-500 hover:text-red-900 hover:scale-110 transition-all">
                      <button onClick={() => deleteHandler(type._id)}>
                        <Trash2></Trash2>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountTypes;
