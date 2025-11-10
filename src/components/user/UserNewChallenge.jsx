import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import UseUserHook from "@/hooks/user/UseUserHook";
import { useNavigate } from "react-router-dom";
import UserNewChallengeHook from "@/hooks/user/UseNewChallengeHook";
import ModernHeading from "@/lib/ModernHeading";
import { backendApi, metaApi } from "@/utils/apiClients";
import OpenAccountMail from "../emails/OpenAccountMail";
import { CFgenerateRandomNumber } from "@/utils/CustomFunctions";

const UserNewChallenge = () => {
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    accountType: "",
    apiGroup: "",
    platform: "",
    accountSize: "" || "",
    accountBalance: "",
    leverage: "",
  });

  const [accountConfigurations, setAccountConfigurations] = useState([]);
  const [creatingLoading, setCreatingLoading] = useState(false);
  const siteConfig = useSelector((state) => state.user.siteConfig); // Get from Redux

  const filterAccountConfig = accountConfigurations?.find(
    (value) => value.accountType === formData.accountType
  );

  const { getPlatforms, getPaymentMethod } = UserNewChallengeHook();
  const { getUpdateLoggedUser } = UseUserHook();
  const platformData = useSelector((store) => store.user.platforms);

  const filteredPlatformData = platformData?.filter(
    (value) => value.status === "active"
  );

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "accountType") {
      const selectedConfig = accountConfigurations?.find(
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

const createAccountHandler = async () => {
  if (creatingLoading) return;

  if (!loggedUser?._id) {
    toast.error("Missing user. Please sign in again.");
    return;
  }

  const requiredKeys = ["leverage", "accountType", "apiGroup", "platform"];
  const missing = requiredKeys.filter((k) => !formData?.[k]);
  if (missing.length) {
    toast.error(`Please fill: ${missing.join(", ")}`);
    return;
  }

  setCreatingLoading(true);
  const toastId = toast.loading("Creating MT5 account…");

  try {
    const endpoint = `/add-mt5-account/${encodeURIComponent(loggedUser._id)}`;

    const payload = {
      leverage: formData.leverage,
      accountType: formData.accountType,
      groupName: formData.apiGroup,
      platform: formData.platform,
      siteConfig,
      VITE_MANAGER_INDEX: import.meta.env.VITE_MANAGER_INDEX,
      VITE_WEBSITE_NAME: import.meta.env.VITE_WEBSITE_NAME,
      VITE_EMAIL_WEBSITE: import.meta.env.VITE_EMAIL_WEBSITE,
    };

    const { data } = await backendApi.post(endpoint, payload);

    // Build a friendly success message (avoid showing passwords in toasts)
    const accNo = data?.account?.accountNumber;
    const successMsg = accNo
      ? `MT5 account ${accNo} created 🎉`
      : "MT5 account created 🎉";

    endLoadingToast(toastId, { type: "success", message: successMsg, autoClose: 2500 });

     // Redirect after a short beat so the toast can flip
          setTimeout(() => navigate("/"), 100);
      setTimeout(() => navigate("/user/challenges"), 200);

    // If you need: setAccounts((prev) => [data.account, ...prev]);
    return data;
  } catch (err) {
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to create account. Please try again.";

    console.error("Error creating MT5 account:", err);
    endLoadingToast(toastId, { type: "error", message: msg, autoClose: 4000 });
  } finally {
    setCreatingLoading(false);
  }
};

  const fetchAccountConfigurations = async () => {
    try {
      const res = await backendApi.get(`/get-account-types`);
      setAccountConfigurations(res.data.data);
    } catch (error) {
      console.log("Error fetching existing ac types data", error);
    }
  };

  // Set default leverage
  useEffect(() => {
    const filterAccountConfig = accountConfigurations?.find(
      (value) => value.accountType === formData.accountType
    );
    if (filterAccountConfig?.leverage) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        leverage: filterAccountConfig.leverage[0]?.value || "",
      }));
    }
  }, [accountConfigurations, formData.accountType]);

  // use effect -----------
  useEffect(() => {
    getPlatforms();
    getPaymentMethod();
    fetchAccountConfigurations();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-secondary-800/30 p-10 mb-20 text-white rounded-lg w-full mx-auto"
    >
      <div className="space-y-6">
        <ModernHeading text={"Open MT5 Account"}></ModernHeading>

        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row gap-6 items-center justify-between w-full"
        >
          <div className="w-full">
            <label className="block mb-2 text-sm font-medium">
              1. Choose your account type
            </label>
            <div className="relative">
              <select
                name="accountType"
                value={formData.accountType}
                onChange={handleInputChange}
                className="w-full bg-secondary-800 p-3 outline-none rounded appearance-none focus:ring-2 focus:ring-secondary-500"
              >
                <option value="" disabled>
                  Select Type
                </option>
                {accountConfigurations?.map((value, index) => (
                  <option key={index} value={value?.accountType}>
                    {value.accountType}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div className="w-full">
            <div className="my-5">
              <label className="block mb-2 text-sm font-medium">
                2. Choose your Leverage
              </label>
              <div className="relative">
                <select
                  name="leverage"
                  value={formData.leverage}
                  onChange={handleInputChange}
                  className="w-full bg-secondary-800 p-3 outline-none rounded appearance-none focus:ring-2 focus:ring-secondary-500"
                >
                  <option value="" disabled>
                    Select Leverage
                  </option>
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
        </motion.div>

        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <label className="block mb-2 text-sm font-medium">
            3. Choose your platform
          </label>
          <div className="grid grid-cols-2 gap-4">
            {filteredPlatformData?.map((plt) => (
              <motion.button
                key={plt.name}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setFormData({ ...formData, platform: plt.name })}
                className={`p-4 flex rounded-full items-center justify-center transition-colors ${
                  formData.platform === plt.name
                    ? "bg-secondary-500-70 shadow-lg font-semibold"
                    : "bg-secondary-800/50 shadow-sm hover:bg-secondary-700/40"
                }`}
              >
                <span className="mr-2 text-2xl">{plt.logo}</span>
                <span>{plt.name}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>
        <div className="w-full flex items-center justify-center pt-10">
          <motion.button
            whileHover={{ scale: creatingLoading ? 1 : 1.1 }}
            whileTap={{ scale: creatingLoading ? 1 : 0.95 }}
            onClick={createAccountHandler}
            disabled={creatingLoading}
            className={`bg-secondary-500-80 px-12 py-3 shadow-md transition-all rounded-full ${
              creatingLoading
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-secondary-500-70 hover:px-16"
            }`}
          >
            {creatingLoading ? "Creating..." : "Create Account"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserNewChallenge;
