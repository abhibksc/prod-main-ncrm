import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";

export default function CustomGroupList({ refresh, setRefresh }) {
  const [customGroups, setCustomGroups] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/get-custom-groups`
      );
      setCustomGroups(res.data.data);
    } catch (error) {
      console.log("error in custom list group", error);
      toast.error("Failed to fetch groups");
    }
  };

  const deleteHandler = async (id) => {
    try {
      await axios.delete(
        `${
          import.meta.env.VITE_BECKEND_END_POINT
        }/api/auth/delete-custom-group?id=${id}`
      );
      setRefresh(!refresh);
      toast.success("Group deleted successfully");
    } catch (error) {
      console.log("error in custom list group", error);
      toast.error("Failed to delete group");
    }
  };

  useEffect(() => {
    fetchData();
  }, [refresh]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
      {/* Mobile View - Card Layout */}
      <h1 className=" py-4 text-xl  font-semibold">Existing Groups</h1>
      <div className="block sm:hidden space-y-4">
        {customGroups?.map((value, index) => (
          <div
            key={index}
            className="bg-primary-700 rounded-lg p-4 text-white space-y-3 border border-gray-500"
          >
            <div className="flex justify-between items-center">
              <span className="font-medium">#{index + 1}</span>
            </div>
            <div className="space-y-2">
              <div>
                <label className="text-gray-300 text-sm">API Group</label>
                <div className="font-medium">{value?.apiGroup}</div>
              </div>
              <div>
                <label className="text-gray-300 text-sm">Custom Group</label>
                <div className="font-medium">{value?.customGroup}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tablet/Desktop View - Table Layout */}
      <div className="hidden sm:block overflow-x-auto bg-primary-700 rounded-lg shadow">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-500">
            <thead>
              <tr className="bg-primary-400 text-white">
                <th
                  scope="col"
                  className="py-3 px-4 text-center text-xs font-medium uppercase tracking-wider"
                >
                  Sr. No.
                </th>
                <th
                  scope="col"
                  className="py-3 px-4 text-center text-xs font-medium uppercase tracking-wider"
                >
                  API Group
                </th>
                <th
                  scope="col"
                  className="py-3 px-4 text-center text-xs font-medium uppercase tracking-wider"
                >
                  Custom Group
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-500">
              {customGroups?.map((value, index) => (
                <tr
                  key={index}
                  className="text-white hover:bg-primary-800/40 transition-colors"
                >
                  <td className="py-3 px-4 text-sm text-center whitespace-nowrap">
                    {index + 1}
                  </td>
                  <td className="py-3 px-4 text-sm text-center">
                    {value?.apiGroup}
                  </td>
                  <td className="py-3 px-4 text-sm text-center">
                    {value?.customGroup}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {customGroups?.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          No custom groups found
        </div>
      )}
    </div>
  );
}
