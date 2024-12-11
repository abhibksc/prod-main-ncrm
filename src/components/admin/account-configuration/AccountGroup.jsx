import React, { useState, useEffect } from "react";
import { Edit2, Check, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { backendApi, metaApi } from "@/utils/apiClients";

const AccountGroup = ({ refresh, setRefresh }) => {
  const [apiGroups, setApiGroups] = useState([]);
  const [customGroups, setCustomGroups] = useState({});
  const [editingId, setEditingId] = useState(null);

  const fetchApiGroups = async () => {
    const res = await metaApi.get(
      `/GetGroups?Manager_Index=${import.meta.env.VITE_MANAGER_INDEX}`
    );
    return res.data.lstGroups;
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSave = async (group) => {
    try {
      const res = await backendApi.post(`/add-custom-group`, {
        apiGroup: group,
        customGroup: customGroups[group] || "",
      });
      toast.success("Group added successfully");
      setRefresh(!refresh);
      //   console.log("add custom group res", res.data);
      setEditingId(null);
    } catch (error) {
      console.log("error in add custom group", error);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleChange = (group, value) => {
    setCustomGroups((prev) => ({ ...prev, [group]: value }));
  };

  useEffect(() => {
    const loadApiGroups = async () => {
      const groups = await fetchApiGroups();
      setApiGroups(groups);
      // Initialize custom groups with default values
      const initialCustomGroups = groups.reduce((acc, group) => {
        acc[group] = "";
        return acc;
      }, {});
      setCustomGroups(initialCustomGroups);
    };
    loadApiGroups();
  }, [refresh]);

  return (
    <div className=" w-full mx-auto p-6">
      <h2 className="text-white text-3xl font-bold mb-4">Add group</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-primary-400 text-white uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Sr. No.</th>
              <th className="py-3 px-6 text-left">API Group</th>
              <th className="py-3 px-6 text-left">Custom Group</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="text-white bg-primary-700 text-sm">
            {apiGroups?.map((group, index) => (
              <tr
                key={index}
                className="border-b border-gray-500 hover:bg-primary-800/40"
              >
                <td className="py-3 px-6 text-left whitespace-nowrap">
                  {index + 1}
                </td>
                <td className="py-3 px-6 text-left">{group}</td>
                <td className="py-3 px-6 text-left">
                  {editingId === group ? (
                    <input
                      type="text"
                      value={customGroups[group] || ""}
                      onChange={(e) => handleChange(group, e.target.value)}
                      className="w-full text-black p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    customGroups[group] || ""
                  )}
                </td>
                <td className="py-3 px-6 text-center">
                  {editingId === group ? (
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleSave(group)}
                        className="p-1 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        <Check size={16} />
                      </button>
                      <button
                        onClick={() => handleCancel(group)}
                        className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit(group)}
                      className="p-1 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                    >
                      <Edit2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AccountGroup;
