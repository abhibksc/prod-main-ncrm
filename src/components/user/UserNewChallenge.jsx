import { useEffect, useState, useRef } from "react";
import {
  ChevronDown,
  Check,
  ArrowLeft,
  Upload,
  ArrowRightCircleIcon,
  Loader2,
  ClipboardIcon,
  UploadCloudIcon,
  X,
  Eye,
} from "lucide-react";
import CountUp from "react-countup";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  setAvailableBalance,
  setOpenTrades,
  setProfitNloss,
} from "../../redux/user/userSlice";
import UseUserHook from "@/hooks/user/UseUserHook";
import { useNavigate } from "react-router-dom";
import { getData } from "country-list";
import UserNewChallengeHook from "@/hooks/user/UseNewChallengeHook";
const UserNewChallenge = () => {
  const [step, setStep] = useState(1);
  const loggedUser = useSelector((store) => store.user.loggedUser);

  const [formData, setFormData] = useState({
    accountType: "",
    apiGroup: "",
    platform: "",
    accountSize: "" || "",
    accountBalance: "",
    leverage: "",
    firstName: loggedUser.firstName || "",
    lastName: loggedUser.lastName || "",
    address: loggedUser.address || "",
    country: loggedUser.country || "",
    city: loggedUser.city || "",
    zipCode: loggedUser.zipCode || "",
    state: loggedUser.state || "",
    email: loggedUser.email || "",
    phone: loggedUser.phone || "",
  });

  const [accountConfigurations, setAccountConfigurations] = useState([]);
  const [phases, setPhases] = useState([]);

  const filterAccountConfig = accountConfigurations.find(
    (value) => value.accountType === formData.accountType
  );

  console.log("formm data----", formData);

  const [startAnimation, setStartAnimation] = useState(false);
  const [creatingLoading, setCreatingLoading] = useState(false);
  const { GetUserInfoAPI } = UseUserHook();
  const [selectedPayment, setSelectedPayment] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const dispatch = useDispatch();
  const [direction, setDirection] = useState(1);
  const navigate = useNavigate();
  const countriesArray = getData();
  const { getPlatforms, getPaymentMethod } = UserNewChallengeHook();
  const { getUpdateLoggedUser } = UseUserHook();
  const platformData = useSelector((store) => store.user.platforms);
  const paymentMethods = useSelector((store) => store.user.paymentMethods);
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef(null);

  const filteredPlatformData = platformData?.filter(
    (value) => value.status === "active"
  );
  const filteredMethodsData = paymentMethods?.filter(
    (value) => value.status === "active"
  );
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "accountType") {
      const selectedConfig = accountConfigurations.find(
        (config) => config.accountType === value
      );
      console.log("selected configgg", selectedConfig);

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

  // add main api handler---------------

  const randomNumber = Math.floor(10000 + Math.random() * 90000).toString();
  const apiTestHandler = async () => {
    const toastID = toast.loading("Please wait..");
    setCreatingLoading(true);

    try {
      setCreatingLoading(false);
      // Store all form values in a separate object
      const formValues = {
        deposit: formData.accountSize,
        balance: formData.accountBalance,
        mt5Account: randomNumber,
        status: "pending",
        userId: loggedUser._id,
        managerIndex: import.meta.env.VITE_MANAGER_INDEX,
        name: formData.firstName,
        lName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        zipCode: formData.zipCode,
        leverage: formData.leverage,
        groupName: formData.apiGroup,
        accountType: formData.accountType,
      };

      // Create FormData object
      const formDataObj = new FormData();

      // Append all key-value pairs from the formValues object to FormData
      for (const key in formValues) {
        formDataObj.append(key, formValues[key]);
      }

      // Also append the image file to the FormData object
      formDataObj.append("depositSS", file); // Assuming 'file' is the image file you want to upload

      const depositDBres = await axios.post(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/deposit`,
        formDataObj, // Pass FormData object
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file upload
          },
        }
      );
      const addChallengeDB = await axios.post(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/add-challenge`,
        {
          mt5Account: randomNumber,
          type: formData.accountType,
          accountSize: formData.accountBalance,
          deposit: formData.accountSize,
          balance: "000",
          phase: "1",
          reason: "pending",
          status: "inactive",
          leverage: formData.leverage,
          masterPassword: "000",
          investarPassword: "000",
          userId: loggedUser._id,
        }
      );
      const updateUser = await axios.put(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/update-user`,
        {
          id: loggedUser._id,
          mt5Account: "000",
          depositBalance: 0,
          accountSize: 0,
          masterPassword: "000",
          investorPassword: "000",
          phase: 0,
          managerIndex: import.meta.env.VITE_MANAGER_INDEX,
          groupName: formData.apiGroup,
        }
      );
      await GetUserInfoAPI();
      dispatch(setProfitNloss(0));
      dispatch(setOpenTrades([]));
      dispatch(setAvailableBalance(0));
      dispatch(setProfitNloss(0));
      await getUpdateLoggedUser();
      await GetUserInfoAPI();
      toast.success("Created new challenge", { id: toastID });
      navigate("/user/dashboard");
    } catch (error) {
      setCreatingLoading(false);
      toast.error("Plese try again", { id: toastID });
      console.log("api testing error---", error);
    }
  };

  const nextStep = () => {
    setDirection(1);
    setStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setDirection(-1);
    setStep((prev) => prev - 1);
  };
  // fetch Account Configurations --------------

  const fetchAccountConfigurations = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/get-account-types`
      );

      setAccountConfigurations(res.data.data);
      console.log("userNewchallenge-- fetch ac details", res.data.data);
    } catch (error) {
      console.log("Error fetching existing ac types data", error);
    }
  };

  // fetch phases  ------------------
  const fetchPhases = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/get-phases`
      );

      setPhases(res.data.data);
    } catch (error) {
      console.log("Error fetching existing phases data", error);
    }
  };
  const filterPhaseData = phases.filter(
    (value) => value.accountType === formData.accountType && value.phase === 1
  )[0];

  // console.log("filter phase data________________________", filterPhaseData);

  // Set default leverage
  useEffect(() => {
    const filterAccountConfig = accountConfigurations.find(
      (value) => value.accountType === formData.accountType
    );
    console.log("filter--", filterAccountConfig);

    if (filterAccountConfig?.leverage) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        leverage: filterAccountConfig.leverage[0]?.value || "",
      }));
    }
  }, [accountConfigurations, formData.accountType]);

  // use effect -----------
  useEffect(() => {
    setStartAnimation(false);
    setTimeout(() => setStartAnimation(true), 100);

    getPlatforms();
    getPaymentMethod();
    fetchAccountConfigurations();
    fetchPhases();
  }, []);
  const [copied, setCopied] = useState(false);
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

  // target stacks ---------------

  const targetStaks = [
    `${filterPhaseData?.maxProfit || 0}% Profit Target*`,
    `${filterPhaseData?.maxOverallLoss || 0}% Max Overall Loss*`,
    `${filterPhaseData?.maxDailyLoss || 0}% Max Daily Loss*`,
  ];
  return (
    <div className="bg-secondary-800/60 p-10 mb-20 text-white rounded-lg max-w-3xl md:max-w-6xl mx-auto">
      <div className="flex justify-between mb-8">
        {["Configure", "Verify", "Pay"].map((stepName, index) => (
          <div key={stepName} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                index + 1 === step
                  ? "bg-green-500"
                  : index + 1 < step
                  ? "bg-blue-500"
                  : "bg-gray-700"
              }`}
            >
              {index + 1 < step ? <Check /> : index + 1}
            </div>
            <span className="mt-2 text-sm">{stepName}</span>
            {index < 2 && (
              <div
                className={`h-1 w-16 mt-5 rounded-full ${
                  index + 1 < step ? "bg-blue-500" : "bg-gray-500"
                }`}
              />
            )}
          </div>
        ))}
      </div>
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          initial={{ opacity: 0, x: 50 * direction }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 * direction }}
          transition={{ duration: 0.3 }}
        >
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">
                Configure your account
              </h2>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  1. Choose your account type
                </label>
                <div className="relative">
                  <select
                    name="accountType"
                    value={formData.accountType}
                    onChange={handleInputChange}
                    className="w-full bg-secondary-800 p-3 rounded appearance-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="" disabled>
                      Select Type
                    </option>
                    {accountConfigurations.map((value, index) => (
                      <option key={index} value={value?.accountType}>
                        {value.accountType}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  2. Choose your platform
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {filteredPlatformData?.map((plt) => (
                    <button
                      key={plt.name}
                      onClick={() =>
                        setFormData({ ...formData, platform: plt.name })
                      }
                      className={`p-4 flex rounded-full items-center justify-center transition-colors ${
                        formData.platform === plt.name
                          ? "bg-secondary-500/80 shadow-lg  font-semibold"
                          : "bg-secondary-800/50 shadow-sm hover:bg-secondary-700/40"
                      }`}
                    >
                      <span className="mr-2 text-2xl">{plt.logo}</span>
                      <span>{plt.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  3. Choose account size
                </label>
                <div className="flex flex-wrap gap-2">
                  {filterAccountConfig?.accountSize?.map((option, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          accountSize: option.deposit,
                          accountBalance: option.balance,
                        })
                      }
                      className={`py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                        formData.accountSize === option.deposit
                          ? "bg-secondary-500/80 shadow-lg text-white"
                          : "bg-secondary-800/60 shadow-sm hover:bg-secondary-700/40"
                      }`}
                    >
                      {option.balance}
                    </button>
                  ))}
                </div>

                <div className=" my-5">
                  <label className="block mb-2 text-sm font-medium">
                    4. Choose your Leverage
                  </label>
                  <div className="relative">
                    <select
                      name="leverage"
                      value={formData.leverage}
                      onChange={handleInputChange}
                      className="w-full bg-secondary-800 p-3 rounded appearance-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Leverage</option>
                      {filterAccountConfig?.leverage?.map((value, index) => (
                        <option key={index} value={value.value}>
                          {value.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="mt-12 mb-8 flex flex-col items-center bg-secondary-800/80 p-6 rounded-lg">
                <div className="flex items-center flex-col justify-between mb-2">
                  <div className="text-2xl text-center font-bold text-blue-400">
                    {formData.accountType}
                  </div>
                </div>
                <div className="text-blue-400 mb-2">
                  Account Size ${formData.accountBalance}
                </div>

                <button className="bg-blue-600 text-white py-2 px-4 rounded-full mb-6">
                  {formData.platform}
                </button>
                <div className="space-y-2">
                  {targetStaks?.map((item, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="text-green-500 mr-2" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6">
                  <span className="text-green-500/90 text-4xl font-bold">
                    $
                    {startAnimation && (
                      <CountUp
                        start={0}
                        end={parseInt(formData.accountSize)}
                        duration={2}
                        separator=","
                      />
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6">
                Configure your account
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    First Name*
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full bg-secondary-800 p-3 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full bg-secondary-800 p-3 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">Email*</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
                  className="w-full bg-secondary-800 p-3 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Country
                </label>
                <div className="relative">
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full bg-secondary-800 p-3 rounded appearance-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select country</option>
                    {countriesArray.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c?.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Mobile Number*
                </label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={loggedUser?.mobile}
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-secondary-800 p-3 rounded focus:ring-2 focus:ring-blue-500"
                  pattern="[0-9]{10}" // Optional: This pattern is for a 10-digit number, adjust as needed.
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Address*
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="w-full bg-secondary-800 p-3 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">City*</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full bg-secondary-800 p-3 rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    ZIP Code*
                  </label>
                  <input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleInputChange}
                    className="w-full bg-secondary-800 p-3 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium">
                    State*
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full bg-secondary-800 p-3 rounded focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 text-white">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6">
                Your Challenge and Payment Details
              </h2>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredMethodsData.map((method) => (
                    <button
                      key={method.name}
                      onClick={() => setSelectedPayment(method.name)}
                      className={`p-4 flex flex-col items-center font-semibold justify-center rounded-lg transition-colors ${
                        selectedPayment === method.name
                          ? "bg-secondary-500/80 shadow-lg text-white"
                          : "bg-secondary-800/50 shadow-sm hover:bg-secondary-700/40"
                      }`}
                    >
                      <span className="text-2xl mb-2">{method.icon}</span>
                      <span className="text-sm">{method.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedPayment && (
                <div className="bg-secondary-700/50 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Account Details</h3>

                  {paymentDetails && selectedPayment !== "Online Payment" ? (
                    <button
                      onClick={() => copyText(paymentDetails)}
                      className="flex items-center space-x-1 text-blue-400 hover:text-blue-500 focus:outline-none"
                    >
                      <p className="text-sm text-white">
                        {formatTextWithLinks(paymentDetails) ||
                          "No details available"}
                      </p>
                      <ClipboardIcon className="h-5 w-5" />
                      <span className="text-xs">
                        {copied ? "Copied!" : "Copy"}
                      </span>
                    </button>
                  ) : (
                    ""
                  )}
                  {selectedPayment === "Online Payment" && (
                    <div className=" mt-6 my-4">
                      <a
                        href={paymentDetails}
                        target="_blank"
                        className=" bg-green-700 hover:bg-green-700/80 transition-all font-semibold  rounded-full px-6 py-2"
                      >
                        Pay now
                      </a>
                    </div>
                  )}

                  {paymentImage && (
                    <div className="  mt-6 my-4 w-full flex flex-col justify-center items-center rounded-md">
                      <img
                        src={`${
                          import.meta.env.VITE_BECKEND_END_POINT
                        }/${paymentImage}`}
                        alt=""
                        className=" rounded-md w-[20%]"
                      />
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
                <div className="flex gap-5 items-center">
                  <h1 className="text-lg sm:text-xl font-semibold">
                    Account Size
                  </h1>
                  <p className="bg-orange-400/80 px-4 sm:px-5 py-1 font-semibold rounded-full">
                    $ {formData.accountBalance}
                  </p>
                </div>
                <div className="flex gap-5 items-center">
                  <h1 className="text-lg sm:text-xl font-semibold">
                    Deposit Amount
                  </h1>
                  <p className="bg-green-600 px-4 sm:px-5 py-1 font-semibold rounded-full">
                    $ {formData.accountSize}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 items-center">
                <h1 className="sm:text-sm font-semibold text-gray-300">
                  INR Figure
                </h1>
                <p className="bg-green-600/10 px-4 sm:px-5 py-1 font-semibold rounded-full">
                  &#8377; {formData.accountSize * 84}
                </p>
              </div>
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Upload proof of payment
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <label className="cursor-pointer bg-secondary-500/70 hover:bg-secondary-500/50 transition-colors py-2 px-4 rounded-lg flex items-center">
                    <Upload className="mr-2" />
                    Choose file
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      ref={fileInputRef}
                      accept="image/*"
                    />
                  </label>
                  {file ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">{file.name}</span>
                      <button
                        onClick={handleRemoveFile}
                        className="text-red-500 hover:text-red-600"
                      >
                        <X size={20} />
                      </button>
                      {previewUrl && (
                        <button
                          onClick={togglePreview}
                          className="text-blue-500 hover:text-blue-600"
                        >
                          <Eye size={20} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <span className="text-sm">No file chosen</span>
                  )}
                </div>
              </div>
              {showPreview && previewUrl && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-auto">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="max-w-full h-auto"
                    />
                    <button
                      onClick={togglePreview}
                      className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
              <div className="flex items-center">
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
              </div>
              <button
                onClick={apiTestHandler}
                disabled={!agreeToTerms || !selectedPayment || !file}
                className={`w-full flex mx-auto justify-center items-center py-3 px-4 rounded-lg text-white transition-colors ${
                  selectedPayment && agreeToTerms && file
                    ? "bg-blue-500 hover:bg-blue-500/80 "
                    : "bg-gray-600  pointer-events-none"
                }`}
              >
                Submit Request
                {creatingLoading && (
                  <Loader2 className="animate-spin mx-2"></Loader2>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      <div className="flex relative justify-between mt-8 mb-2">
        {step > 1 && (
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="bg-gray-500/30 hover:px-6 transition-all text-white px-4 py-2  rounded-full disabled:opacity-50"
          >
            <ArrowLeft className="inline-block mr-2" />
            Back
          </button>
        )}

        {step <= 2 ? (
          <div className="  absolute top-[-10px] right-0">
            <button
              onClick={nextStep}
              className="bg-secondary-500/70  hover:px-6 transition-all text-white px-4 py-2  rounded-full"
            >
              Next
              <ArrowRightCircleIcon className="inline-block ml-2 animate-bounce" />
            </button>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default UserNewChallenge;
