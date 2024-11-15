import React, { useState, useEffect } from "react";
import { Edit2, Check, X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

const AccountGroup = ({ refresh, setRefresh }) => {
  const [apiGroups, setApiGroups] = useState([]);
  const [customGroups, setCustomGroups] = useState({});
  const [editingId, setEditingId] = useState(null);

  const fetchApiGroups = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_API_END_POINT}/api/web//GetGroups?Manager_Index=${
        import.meta.env.VITE_MANAGER_INDEX
      }`
    );
    return res.data.lstGroups;
  };

  const handleEdit = (id) => {
    setEditingId(id);
  };

  const handleSave = async (group) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/add-custom-group`,
        {
          apiGroup: group,
          customGroup: customGroups[group] || "",
        }
      );
      toast.success("Group added successfully");
      setRefresh(!refresh);
      setEditingId(null);
    } catch (error) {
      console.log("error in add custom group", error);
      toast.error("Failed to add group");
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
      const initialCustomGroups = groups.reduce((acc, group) => {
        acc[group] = "";
        return acc;
      }, {});
      setCustomGroups(initialCustomGroups);
    };
    loadApiGroups();
  }, [refresh]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      <h2 className="text-white text-2xl sm:text-3xl font-bold mb-4">
        Add group
      </h2>

      {/* Card for mobile view */}
      <div className="block sm:hidden space-y-4">
        {apiGroups?.map((group, index) => (
          <div
            key={index}
            className="bg-primary-700 rounded-lg p-4 space-y-3 border border-gray-600"
          >
            <div className="flex justify-between items-center">
              <span className="text-white font-medium">#{index + 1}</span>
              {editingId === group ? (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleSave(group)}
                    className="p-1.5 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    <Check size={16} />
                  </button>
                  <button
                    onClick={() => handleCancel(group)}
                    className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleEdit(group)}
                  className="p-1.5 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
                >
                  <Edit2 size={16} />
                </button>
              )}
            </div>
            <div className="space-y-2">
              <div>
                <label className="text-gray-300 text-sm">API Group</label>
                <div className="text-white">{group}</div>
              </div>
              <div>
                <label className="text-gray-300 text-sm">Custom Group</label>
                {editingId === group ? (
                  <input
                    type="text"
                    value={customGroups[group] || ""}
                    onChange={(e) => handleChange(group, e.target.value)}
                    className="w-full mt-1 text-black p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                ) : (
                  <div className="text-white">{customGroups[group] || "-"}</div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table for tablet and desktop view */}
      <div className="hidden sm:block overflow-x-auto bg-primary-700 rounded-lg shadow">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-500">
            <thead>
              <tr className="bg-primary-400 text-white">
                <th
                  scope="col"
                  className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Sr. No.
                </th>
                <th
                  scope="col"
                  className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider"
                >
                  API Group
                </th>
                <th
                  scope="col"
                  className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider"
                >
                  Custom Group
                </th>
                <th
                  scope="col"
                  className="py-3 px-4 text-center text-xs font-medium uppercase tracking-wider"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-500">
              {apiGroups?.map((group, index) => (
                <tr
                  key={index}
                  className="text-white hover:bg-primary-800/40 transition-colors"
                >
                  <td className="py-3 px-4 text-sm whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="py-3 px-4 text-sm">{group}</td>
                  <td className="py-3 px-4 text-sm">
                    {editingId === group ? (
                      <input
                        type="text"
                        value={customGroups[group] || ""}
                        onChange={(e) => handleChange(group, e.target.value)}
                        className="w-full text-black p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      customGroups[group] || "-"
                    )}
                  </td>
                  <td className="py-3 px-4 text-sm text-center">
                    {editingId === group ? (
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => handleSave(group)}
                          className="p-1.5 bg-green-500 text-white rounded-full hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => handleCancel(group)}
                          className="p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(group)}
                        className="p-1.5 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
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
    </div>
  );
};

export default AccountGroup;
