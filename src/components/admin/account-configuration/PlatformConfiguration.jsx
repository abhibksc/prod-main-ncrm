import React, { useEffect, useState } from "react";
import { Trash2, Plus, Pencil } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import toast from "react-hot-toast";

export default function PlatformConfiguration() {
  const [platformData, setPlatformData] = useState([]);
  const [newField, setNewField] = useState({ name: "", value: "" });

  const addField = async () => {
    const toastId = toast.loading("Please wait...");
    if (newField.name && newField.value) {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/add-platform`,
          {
            value: newField.value,
            name: newField.name,
            status: "active",
          }
        );
        if (res.data.status) {
          setPlatformData([
            ...platformData,
            {
              id: platformData.length + 1,
              ...newField,
              active: false,
            },
          ]);
          toast.success("Platform added", { id: toastId });
          getAllPlatforms();
        }
        if (!res.data.status) {
          toast.error("Value already exist", { id: toastId });
        }
        console.log("add platform res --", res);
      } catch (error) {
        toast.error("Something went wrong", { id: toastId });
        console.log("error in add platform", error);
      }
      setNewField({ name: "", value: "" });
    }
  };

  const toggleActive = async (id, currentStatus) => {
    const toastId = toast.loading("Updating status...");
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    console.log("current status--", currentStatus);
    console.log("new status--", newStatus);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/update-platform`,
        {
          id: id,
          status: newStatus,
        }
      );
      console.log("res updatedd--", res.data);

      if (res.data.status) {
        setPlatformData(
          platformData.map((platform) =>
            platform._id === id ? { ...platform, status: newStatus } : platform
          )
        );
        toast.success("Platform status updated", { id: toastId });
      } else {
        toast.error(res.data.msg || "Failed to update platform status", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error("Error in toggleActive:", error);
      toast.error("Something went wrong while updating status", {
        id: toastId,
      });
    }
  };

  const deletePlatform = async (id) => {
    const toastId = toast.loading("Please wait...");
    try {
      const res = await axios.delete(
        `${
          import.meta.env.VITE_BECKEND_END_POINT
        }/api/auth/delete-platform/?id=${id}`
      );
      console.log("test delete--", res.data);
      if (res.data.status) {
        setPlatformData(platformData.filter((platform) => platform._id !== id));
        toast.success("Platform deleted successfully", { id: toastId });
      } else {
        toast.error(res.data.msg || "Failed to delete test platform", {
          id: toastId,
        });
      }
    } catch (error) {
      console.log("error in deleteTest", error);
      toast.error("Something went wrong", { id: toastId });
    }
  };

  const getAllPlatforms = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/get-platforms`
      );
      setPlatformData(res.data.data);
      console.log("getAllPlatforms", res.data);
    } catch (error) {
      console.log("error in getAllPlatform", error);
    }
  };
  const isAddButtonDisabled = !newField.name || !newField.value;

  useEffect(() => {
    getAllPlatforms();
  }, []);

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold mb-6 text-white">List of Platforms</h2>
      <div className="mt-6 bg-primary-700 text-white rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Add New Field</h3>
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Name"
            value={newField.name}
            onChange={(e) => setNewField({ ...newField, name: e.target.value })}
            className="flex-1 px-4 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Value"
            value={newField.value}
            onChange={(e) =>
              setNewField({ ...newField, value: e.target.value })
            }
            className="flex-1 px-4 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addField}
            disabled={isAddButtonDisabled}
            className={`px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              isAddButtonDisabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>

      <div className=" my-4">
        <div className="bg-primary-800 rounded-lg shadow-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-primary-400 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  S.No.
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  STATUS
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-primary-700 divide-y text-white divide-gray-400">
              {platformData?.map((platform, index) => (
                <tr key={platform.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium  text-white">
                    {index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm ">
                    {platform.value}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm ">
                    {platform.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm ">
                    <Switch
                      checked={platform.status === "active" ? true : false}
                      onCheckedChange={() =>
                        toggleActive(platform._id, platform.status)
                      }
                    />
                  </td>
                  <td className="px-6 gap-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className=" flex  justify-center ml-6">
                      <button
                        onClick={() => deletePlatform(platform?._id)}
                        className="text-red-600 hover:text-red-900 hover:scale-110 transition-all"
                      >
                        <Trash2 size={20} />
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
}
