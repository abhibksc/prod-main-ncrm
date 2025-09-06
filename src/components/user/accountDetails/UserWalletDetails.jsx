import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import UseUserHook from "@/hooks/user/UseUserHook";
import { backendApi } from "@/utils/apiClients";
import OtpUi from "@/components/OtpUi";

const InputField = ({ label, placeholder, value, onChange, name }) => (
  <div className="mb-6 w-full">
    <label className="block text-sm font-medium text-white mb-2">{label}</label>
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      name={name}
      className="w-full px-4 py-3 border text-gray-100 bg-secondary-900/80 border-gray-700 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500 transition-all duration-300"
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
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otp, setOtp] = useState("");
  const [apiLoader, setApiLoader] = useState(false);
  const { getUpdateLoggedUser } = UseUserHook();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const submitHandler = async () => {
    const toastId = toast.loading("Please wait..");

    // Send OTP first
    try {
      await backendApi.post("/send-otp", {
        email: loggedUser.email,
      });
      toast.success("OTP sent to your email", { id: toastId });
      setShowOtpInput(true); // open OTP input modal
    } catch (err) {
      console.log("OTP error", err);
      toast.error(
        `Failed to send OTP, ${
          err?.response?.data?.message || "Please try again later"
        } `,
        {
          id: toastId,
        }
      );
    }
  };

  // verify and submit wallet details
  const verifyOtpHandler = async () => {
    const toastID = toast.loading("Verifying and updating details..");
    if (!otp) {
      toast.error("OTP required", { id: toastID });
      return;
    }

    setApiLoader(true);

    try {
      const res = await backendApi.post("/verify-otp", {
        email: loggedUser.email,
        otp,
        purpose: "wallet-update",
      });
      const verificationToken = res.data.verificationToken;

      // Proceed to wallet details update
      await backendApi.put(`/${loggedUser._id}/wallet-details`, {
        tetherAddress: formData.tetherAddress,
        accountNumber: formData.accountNumber,
        trxAddress: formData.trxAddress,
        ethAddress: formData.ethAddress,
        verificationToken: verificationToken,
      });

      getUpdateLoggedUser();
      toast.success("Details updated successfully", { id: toastID });

      // Reset OTP state
      setShowOtpInput(false);
      setOtp("");
    } catch (error) {
      toast.error(error?.response?.data.message || "Update failed", {
        id: toastID,
      });
      console.log("error during wallet update", error);
    } finally {
      setApiLoader(false);
    }
  };
  useEffect(() => {
    getUpdateLoggedUser();
  }, []);
  return (
    <div className="mx-auto p-4 bg-secondary-800/40 rounded-2xl ">
      {showOtpInput && (
        <OtpUi
          otp={otp}
          setOtp={setOtp}
          setShowOtpInput={setShowOtpInput}
          verifyOtpHandler={verifyOtpHandler}
          apiLoader={apiLoader}
        />
      )}
      <div className=" text-black p-4 rounded-xl ">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputField
            label="USDT (Trc20)"
            placeholder="Enter USDT(Trc20) address"
            value={formData.tetherAddress}
            onChange={handleInputChange}
            name="tetherAddress"
          />
          <InputField
            label="USDT (Bep20)"
            placeholder="Enter USDT(Bep20) address"
            value={formData.ethAddress}
            onChange={handleInputChange}
            name="ethAddress"
          />
          {/* <InputField
            label="Binance ID"
            placeholder="Enter Binance ID"
            value={formData.accountNumber}
            onChange={handleInputChange}
            name="accountNumber"
          />
          <InputField
            label="BTC Address"
            placeholder="Enter BTC address"
            value={formData.trxAddress}
            onChange={handleInputChange}
            name="trxAddress"
          /> */}
        </div>
        <div className="flex items-center justify-center mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={submitHandler}
            className="px-6 py-3 bg-secondary-500-90 text-white font-semibold rounded-full hover:bg-secondary-500-80 hover:px-8 transition-all shadow-lg"
          >
            Update Details
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default UserWalletDetails;
