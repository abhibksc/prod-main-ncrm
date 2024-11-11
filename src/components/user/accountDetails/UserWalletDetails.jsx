import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import UseUserHook from "@/hooks/user/UseUserHook";

const InputField = ({ label, placeholder, value, onChange, name }) => (
  <div className="mb-6 w-full">
    <label className="block text-sm font-medium text-white mb-2">{label}</label>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      className="w-full px-4 py-3 border text-secondary-800 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all duration-300"
    />
  </div>
);

const UserWalletDetails = () => {
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const [formData, setFormData] = useState({
    tetherAddress: loggedUser?.walletDetails?.tetherAddress || "",
    ethAddress: loggedUser?.walletDetails?.ethAddress || "",
    accountNumber: loggedUser?.walletDetails?.accountNumber || "",
    trxAddress: loggedUser?.walletDetails?.trxAddress || "",
  });
  const { getUpdateLoggedUser } = UseUserHook();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitHandler = async () => {
    const toastId = toast.loading("Plese wait..");
    // console.log(formData);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/${
          loggedUser._id
        }/wallet-details`,
        {
          tetherAddress: formData.tetherAddress,
          accountNumber: formData.accountNumber,
          trxAddress: formData.trxAddress,
          ethAddress: formData.ethAddress,
        }
      );
      // console.log(res);
      getUpdateLoggedUser();
      toast.success("Details updated", { id: toastId });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!!", { id: toastId });
    }
  };
  useEffect(() => {
    getUpdateLoggedUser();
  }, []);
  return (
    <div className="mx-auto p-4 bg-secondary-800/60 rounded-2xl ">
      <div className=" text-black p-4 rounded-xl ">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputField
            label="Tether Wallet Address"
            placeholder="Enter Tether wallet address"
            value={formData.tetherAddress}
            onChange={handleInputChange}
            name="tetherAddress"
          />
          <InputField
            label="ETH Wallet Address"
            placeholder="Enter ETH wallet address"
            value={formData.ethAddress}
            onChange={handleInputChange}
            name="ethAddress"
          />
          <InputField
            label="Account No"
            placeholder="Enter account number"
            value={formData.accountNumber}
            onChange={handleInputChange}
            name="accountNumber"
          />
          <InputField
            label="TRX Wallet Address"
            placeholder="Enter TRX wallet address"
            value={formData.trxAddress}
            onChange={handleInputChange}
            name="trxAddress"
          />
        </div>
        <div className="flex items-center justify-center mt-8">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={submitHandler}
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-full hover:bg-blue-500/80 hover:px-8 transition-all shadow-lg"
          >
            Update Details
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default UserWalletDetails;
