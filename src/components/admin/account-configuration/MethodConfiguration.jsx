import React, { useEffect, useState } from "react";
import { Trash2, Plus, Eye, Upload, X, XCircle } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import axios from "axios";
import toast from "react-hot-toast";

export default function MethodConfiguration() {
  const [arrayData, setArrayData] = useState([]);
  const [newField, setNewField] = useState({
    name: "",
    details: "",
    image: null,
    status: "active",
  });
  const [showImagePopup, setShowImagePopup] = useState(false);
  const [popupImageUrl, setPopupImageUrl] = useState("");

  const addField = async () => {
    const toastId = toast.loading("Please wait...");
    if (newField.name && newField.details) {
      try {
        const formData = new FormData();
        formData.append("name", newField.name);
        formData.append("details", newField.details);
        formData.append("status", newField.status);
        formData.append("image", newField.image);

        const res = await axios.post(
          `${
            import.meta.env.VITE_BECKEND_END_POINT
          }/api/auth/add-payment-method`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (res.data.status) {
          setArrayData([...arrayData, res.data.data]);
          toast.success("Method added", { id: toastId });
          setNewField({ name: "", details: "", image: null, status: "active" });
        } else {
          toast.error(res.data.msg || "Failed to add method", { id: toastId });
        }
      } catch (error) {
        toast.error("Something went wrong", { id: toastId });
        console.log("error in add payment method", error);
      }
    } else {
      toast.error("Please fill all fields and upload an image", {
        id: toastId,
      });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewField({ ...newField, image: file });
    }
  };

  const toggleActive = async (id, currentStatus) => {
    const toastId = toast.loading("Updating status...");
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const res = await axios.put(
        `${
          import.meta.env.VITE_BECKEND_END_POINT
        }/api/auth/update-payment-method`,
        {
          id: id,
          status: newStatus,
        }
      );

      if (res.data.status) {
        setArrayData(
          arrayData.map((platform) =>
            platform._id === id ? { ...platform, status: newStatus } : platform
          )
        );
        toast.success("Status updated", { id: toastId });
      } else {
        toast.error(res.data.msg || "Failed to update Method status", {
          id: toastId,
        });
      }
    } catch (error) {
      console.error("Error in payment method toggleActive:", error);
      toast.error("Something went wrong !!", { id: toastId });
    }
  };

  const deletePlatform = async (id) => {
    const toastId = toast.loading("Please wait...");
    try {
      const res = await axios.delete(
        `${
          import.meta.env.VITE_BECKEND_END_POINT
        }/api/auth/delete-payment-method/?id=${id}`
      );

      if (res.data.status) {
        setArrayData(arrayData.filter((platform) => platform._id !== id));
        toast.success("Method deleted successfully", { id: toastId });
      } else {
        toast.error(res.data.msg || "Failed to delete method", {
          id: toastId,
        });
      }
    } catch (error) {
      console.log("error in delete method", error);
      toast.error("Something went wrong", { id: toastId });
    }
  };

  const getAllPlatforms = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/get-payment-methods`
      );
      setArrayData(res.data.data);
    } catch (error) {
      console.log("error in getAllPlatform", error);
    }
  };

  const handleViewImage = (imageUrl) => {
    setPopupImageUrl(imageUrl);
    setShowImagePopup(true);
  };

  useEffect(() => {
    getAllPlatforms();
  }, []);

  const isAddButtonDisabled = !newField.name || !newField.details;

  return (
    <div className="container mx-auto px-6 py-8">
      <h2 className="text-3xl font-bold mb-6 text-white">Payment Method</h2>
      <div className="mt-6 bg-primary-700 overflow-hidden text-white rounded-lg shadow-lg p-6">
        <div className="flex space-x-4">
          <input
            type="text"
            placeholder="Name (display name)"
            value={newField.name}
            onChange={(e) => setNewField({ ...newField, name: e.target.value })}
            className="flex-1 px-4 py-2 border text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="text"
            placeholder="Details"
            value={newField.details}
            onChange={(e) =>
              setNewField({ ...newField, details: e.target.value })
            }
            className="flex-1 px-4 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600 transition-colors duration-300"
            >
              <Upload size={18} className="mr-2" />
              Upload Image
            </label>
          </div>
          {newField.image && (
            <button
              onClick={() =>
                handleViewImage(URL.createObjectURL(newField.image))
              }
              className=" py-2 text-green-500 rounded-md hover:scale-110 transition-all duration-300"
            >
              <Eye size={22} />
            </button>
          )}
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

      <div className="bg-primary-800 mt-5 rounded-lg shadow-lg">
        <table className="min-w-full divide-y divide-gray-200 overflow-hidden">
          <thead className="bg-primary-400 text-white">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                S.No.
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Details
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
            {arrayData?.map((platform, index) => (
              <tr key={platform?._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                  {index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm ">
                  {platform?.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm ">
                  {platform?.details}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm ">
                  <Switch
                    checked={platform?.status === "active"}
                    onCheckedChange={() =>
                      toggleActive(platform?._id, platform?.status)
                    }
                  />
                </td>
                <td className="px-6 gap-3 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-center ml-6 space-x-2">
                    <button
                      onClick={() =>
                        handleViewImage(
                          import.meta.env.VITE_BECKEND_END_POINT +
                            "/" +
                            platform?.image
                        )
                      }
                      className="text-blue-500 hover:text-blue-700 hover:scale-110 transition-all"
                    >
                      <Eye size={20} />
                    </button>
                    <button
                      onClick={() => deletePlatform(platform?._id)}
                      className="text-red-600 hover:text-red-800 hover:scale-110 transition-all"
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

      {showImagePopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="relative bg-primary-800/90 rounded-lg p-4">
            <button
              onClick={() => setShowImagePopup(false)}
              className="absolute top-2 right-2 text-red-600 hover:text-red-800"
            >
              <XCircle size={30} />
            </button>
            <div className=" max-w-xl flex justify-center items-center">
              <img
                src={popupImageUrl}
                alt="Popup"
                className=" w-[70%] h-full object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
