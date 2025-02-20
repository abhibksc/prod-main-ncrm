import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import UserNewChallengeHook from "@/hooks/user/UseNewChallengeHook";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  ClipboardIcon,
  Eye,
  Loader2,
  LoaderPinwheelIcon,
  Upload,
  X,
} from "lucide-react";
import ModernHeading from "@/lib/ModernHeading";
import { backendApi, metaApi } from "@/utils/apiClients";

export default function UserDeposit() {
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    apiGroup: "",
    depositAmount: "",
    accountNumber: "",
    // accountNumber: loggedUser?.accounts[0]?.accountNumber,
  });
  // console.log("formdata--", formData);

  const [accountConfigurations, setAccountConfigurations] = useState([]);

  const [creatingLoading, setCreatingLoading] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const { getPaymentMethod } = UserNewChallengeHook();
  const paymentMethods = useSelector((store) => store.user.paymentMethods);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [accountType, setAccountType] = useState("");
  const [accountBalance, setAccountBalance] = useState("");
  const [balanceLoading, setBalanceLoading] = useState(false);
  const siteConfig = useSelector((store) => store.user.siteConfig);

  const filteredMethodsData = paymentMethods?.filter(
    (value) => value.status === "active"
  );
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "accountType") {
      const selectedConfig = accountConfigurations.find(
        (config) => config.accountType === value
      );

      setFormData((prev) => ({
        ...prev,
        accountType: value,
        apiGroup: selectedConfig.apiGroup,
      }));
    } else {
      const updatedValue =
        name === "phone" ? parseInt(value.replace(/\D/g, ""), 10) || "" : value;

      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : updatedValue,
      }));
    }
  };
  // account info--

  const fetchAccountInfo = async () => {
    try {
      setBalanceLoading(true);
      setAccountBalance("");
      const res = await metaApi.get(
        `/GetUserInfo?Manager_Index=${
          import.meta.env.VITE_MANAGER_INDEX
        }&MT5Account=${formData.accountNumber}`
      );
      setBalanceLoading(false);
      if (res.data.Equity) {
        setAccountBalance(res.data.Equity);
      }
    } catch (error) {
      console.log(error);
      setBalanceLoading(false);
    }
  };

  // submit api handler---------------

  const submitHandler = async () => {
    if (!creatingLoading) {
      const toastID = toast.loading("Please wait..");
      try {
        setCreatingLoading(true);
        // Store all form values in a separate object --
        const formValues = {
          userId: loggedUser._id,
          mt5Account: formData.accountNumber,
          deposit: formData.depositAmount,
          status: "pending",
          accountType: accountType,
          method: selectedPayment,
        };
        //
        // Create FormData object
        const formDataObj = new FormData();
        // Append all key-value pairs from the formValues object to FormData
        for (const key in formValues) {
          formDataObj.append(key, formValues[key]);
        }
        // Also append the image file to the FormData object
        formDataObj.append("depositSS", file); // Assuming 'file' is the image file you want to upload
        const depositDBres = await backendApi.post(
          `/deposit`,
          formDataObj, // Pass FormData object
          {
            headers: {
              "Content-Type": "multipart/form-data", // Important for file upload
            },
          }
        );
        console.log(depositDBres);
        toast.success("Submitted successfully", { id: toastID });
        setCreatingLoading(false);
        navigate("/user/dashboard");
      } catch (error) {
        setCreatingLoading(false);
        toast.error("Please try again", { id: toastID });
        console.log("user new challenge error---", error);
      }
    }
  };

  const paymentDetails = paymentMethods?.find(
    (m) => m.name === selectedPayment
  )?.details;
  const paymentImage = paymentMethods?.find(
    (m) => m.name === selectedPayment
  )?.image;

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied!!");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  // file upload----

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);

    if (selectedFile && selectedFile.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };
  // url to button convert ----
  function formatTextWithLinks(text) {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return text.split(urlRegex).map((part, index) => {
      // If part is a URL, render it as a button
      if (urlRegex.test(part)) {
        return (
          <button
            key={index}
            onClick={() => window.open(part, "_blank", "noopener,noreferrer")}
            className="bg-blue-500/90 mx-2 text-white px-6 py-2 rounded-full hover:bg-blue-600/80 transition duration-200 ml-2"
          >
            Pay Now
          </button>
        );
      }

      // Otherwise, return the text as is
      return (
        <span key={index} className="text-gray-200">
          {part}
        </span>
      );
    });
  }
  // use effect -----------
  useEffect(() => {
    getPaymentMethod();
  }, []);
  useEffect(() => {
    fetchAccountInfo();
  }, [formData.accountNumber]);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-secondary-800/20 p-5 rounded-xl mx-auto"
    >
      <div className="space-y-6 text-white">
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <ModernHeading text={"Deposit Funds"}></ModernHeading>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col items-center md:flex-row justify-between gap-10"
        >
          {/* Account and Deposit Amount Selects */}
          <div className="flex whitespace-nowrap flex-col gap-2 w-full">
            <label
              htmlFor="currency"
              className="text-sm font-medium w-full flex justify-between text-gray-200"
            >
              <p>Select Account</p>
              <div>
                {balanceLoading ? (
                  <LoaderPinwheelIcon className="animate-spin text-secondary-500" />
                ) : (
                  accountBalance && (
                    <p className="px-4">
                      Balance:{" "}
                      <span className="bg-secondary-500-10 px-3 py-1 rounded-full text-secondary-500">
                        ${accountBalance}
                      </span>
                    </p>
                  )
                )}
              </div>
            </label>
            <select
              onChange={(e) => {
                const selectedValue = loggedUser.accounts?.find(
                  (value) => value.accountNumber === e.target.value
                );
                setAccountType(selectedValue.accountType);
                handleInputChange(e);
              }}
              id="accountNumber"
              name="accountNumber"
              className="w-full px-4 py-2 border bg-secondary-800/20 border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
            >
              <option className=" bg-secondary-800 text-white" value="">
                Select Account
              </option>
              {loggedUser.accounts?.map((value, index) => (
                <option
                  key={index}
                  className=" bg-secondary-800 text-white"
                  onClick={() => setAccountType(value)}
                  value={value.accountNumber}
                >
                  {value.accountNumber}
                </option>
              ))}{" "}
            </select>
          </div>
          {/* ... other input fields remain the same */}
          <div className=" flex flex-col gap-2 w-full">
            <label
              htmlFor="deposit-amount"
              className="text-sm font-medium text-gray-200"
            >
              Deposit Amount
            </label>
            <input
              onChange={handleInputChange}
              type="number"
              id="depositAmount"
              name="depositAmount"
              placeholder="Enter amount"
              className="w-full px-4 py-2 border bg-secondary-800/20 border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
            />
          </div>
          <div>
            <div className="flex whitespace-nowrap gap-3 md:mt-5 items-center w-full">
              <h1 className="sm:text-sm font-semibold text-gray-300">
                INR Figure
              </h1>

              <p className="bg-secondary-500-10 text-secondary-500 txt px-4 sm:px-5 py-1 font-semibold rounded-full">
                &#8377; {formData.depositAmount * siteConfig.dollarDepositRate}
              </p>
            </div>
            <div className=" mt-1 flex items-center justify-center">
              <p className="text-[12px] mb-2 text-gray-500">
                USD to INR Rate:{" "}
                <span className="font-medium text-gray-400/80">
                  ₹ {siteConfig?.dollarDepositRate}
                </span>
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <label className="block mb-2 text-sm font-medium">
            Select Payment Method
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMethodsData.map((method, index) => (
              <motion.button
                key={method.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.3,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedPayment(method.name)}
                className={`p-4 flex flex-col items-center font-semibold justify-center rounded-xl transition-colors ${
                  selectedPayment === method.name
                    ? "bg-secondary-500-80 shadow-lg text-white"
                    : "bg-secondary-800/50 shadow-sm hover:bg-secondary-700/40"
                }`}
              >
                <span className="text-2xl mb-2">{method.icon}</span>
                <span className="text-sm">{method.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence>
          {selectedPayment && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="bg-secondary-800/40 rounded-xl shadow-lg p-6 flex flex-col items-start space-y-4"
            >
              {/* Section Header */}
              <div className="w-full flex justify-between items-center">
                <h3 className="text-lg font-bold text-gray-100">
                  Account Details
                </h3>
                <span className="text-xs text-gray-400 bg-secondary-700 py-1 px-3 rounded-md">
                  {selectedPayment || "Payment Info"}
                </span>
              </div>

              {/* Payment Details Section */}
              {paymentDetails && selectedPayment !== "Online Payment" ? (
                <div className="w-full flex flex-col space-y-2 bg-secondary-700/50 p-4 rounded-lg">
                  <p className="text-sm text-gray-300 leading-tight">
                    {formatTextWithLinks(paymentDetails) ||
                      "No details available"}
                  </p>
                  <button
                    onClick={() => copyText(paymentDetails)}
                    className="flex items-center self-end text-blue-400 hover:text-blue-500 focus:outline-none space-x-1 text-xs"
                  >
                    <ClipboardIcon className="h-4 w-4" />
                    <span>{copied ? "Copied!" : "Copy Details"}</span>
                  </button>
                </div>
              ) : (
                <p className="text-sm text-gray-400">
                  No payment details available.
                </p>
              )}

              {/* Online Payment Section */}
              {selectedPayment === "Online Payment" && (
                <a
                  href={paymentDetails}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-2 rounded-lg hover:scale-105 transition-all"
                >
                  Pay Now
                </a>
              )}

              {/* Payment Image Section */}
              {paymentImage && (
                <div className="w-full flex flex-col items-center space-y-2">
                  <img
                    src={`${
                      import.meta.env.VITE_BACKEND_BASE_URL
                    }/${paymentImage}`}
                    alt="Payment Receipt"
                    className="w-24 h-24 object-cover rounded-lg shadow-md"
                  />
                  <a
                    href={`${
                      import.meta.env.VITE_BACKEND_BASE_URL
                    }/${paymentImage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-400 hover:text-blue-500"
                  >
                    View Receipt
                  </a>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <label className="block mb-2 text-sm font-medium">
            Upload proof of payment
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <motion.label
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="cursor-pointer bg-secondary-500-70 hover:bg-secondary-500-50 transition-colors py-2 px-4 rounded-lg flex items-center"
            >
              <Upload className="mr-2" />
              Choose file
              <input
                type="file"
                className="hidden"
                onChange={handleFileChange}
                ref={fileInputRef}
                accept="image/*"
              />
            </motion.label>
            {file ? (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2"
              >
                <span className="text-sm">{file.name}</span>
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleRemoveFile}
                  className="text-red-500 hover:text-red-600"
                >
                  <X size={20} />
                </motion.button>
                {previewUrl && (
                  <motion.button
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={togglePreview}
                    className="text-blue-500 hover:text-blue-600"
                  >
                    <Eye size={20} />
                  </motion.button>
                )}
              </motion.div>
            ) : (
              <span className="text-sm">No file chosen</span>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex items-center"
        >
          <input
            type="checkbox"
            id="agreeToTerms"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="agreeToTerms" className="text-sm">
            I agree to
            <a
              href={import.meta.env.VITE_TAC_LINK}
              className="text-blue-400 mx-1 cursor-pointer"
              target="_blank"
            >
              Terms & Conditions
            </a>
          </label>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="flex justify-center items-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={submitHandler}
            disabled={!agreeToTerms || creatingLoading || !selectedPayment}
            className={`flex mx-auto justify-center items-center py-3 px-12 hover:px-16 transition-all rounded-full text-white ${
              selectedPayment && agreeToTerms
                ? "bg-secondary-500-90 hover:bg-secondary-500-80 "
                : "bg-gray-600  pointer-events-none"
            }`}
          >
            Submit Request
            {creatingLoading && (
              <Loader2 className="animate-spin mx-2"></Loader2>
            )}
          </motion.button>
        </motion.div>
      </div>

      {/* Preview Modal with Animation */}
      <AnimatePresence>
        {showPreview && previewUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-secondary-900 p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-auto"
            >
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full h-auto rounded"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={togglePreview}
                className="mt-4 bg-red-500/80 text-white px-6 py-2 rounded-full hover:bg-red-600/70"
              >
                Close
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
