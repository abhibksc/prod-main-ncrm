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

    setCreatingLoading(true);
    const toastID = toast.loading("Please wait...");

    let retries = 0;
    let accountCreated = false;

    while (retries < 5 && !accountCreated) {
      // const randomNumber = 250410236;
      const randomNumber = CFgenerateRandomNumber(siteConfig?.mt5Digit || 6);

      let accountExists = false;

      try {
        const check = await metaApi.get(
          `/GetUserInfo?Manager_Index=${
            import.meta.env.VITE_MANAGER_INDEX
          }&MT5Account=${randomNumber}`
        );
        if (check.data.MT5Account) {
          accountExists = true;
          console.log("Account already exists, retrying...");
          retries++;
          continue;
        }
      } catch (error) {
        console.log("error?.response?.data?.message", error.response.status);
        if (error.response && error.response.status === 404) {
          // Account doesn't exist - proceed
          accountExists = false;
        } else {
          // Some other error
          console.error("Check account failed:", error);
          retries++;
          continue;
        }
      }

      try {
        const res = await metaApi.post(`/Adduser`, {
          Manager_Index: import.meta.env.VITE_MANAGER_INDEX,
          MT5Account: randomNumber,
          Name: `${loggedUser.firstName} ${loggedUser.lastName}`,
          Country: loggedUser.Country,
          Leverage: formData.leverage,
          Group_Name: formData.apiGroup,
        });

        const mt5Account = res.data.MT5Account;

        if (mt5Account > 0) {
          await backendApi.post(`/add-mt5-account/${loggedUser._id}`, {
            accountNumber: mt5Account,
            leverage: formData.leverage,
            accountType: formData.accountType,
            groupName: formData.apiGroup,
            masterPassword: res.data.Master_Pwd,
            investorPassword: res.data.Investor_Pwd,
            platform: formData.platform,
          });

          try {
            const emailContent = OpenAccountMail({
              loggedUser,
              generateMt5: res,
              formData,
              siteConfig,
            });

            await backendApi.post(`/custom-mail`, {
              email: loggedUser.email,
              content: emailContent,
              subject: "Account Created",
            });
          } catch (mailErr) {
            console.error("Email failed:", mailErr);
          }

          toast.success("Account created successfully!", { id: toastID });
          await getUpdateLoggedUser();
          navigate("/user/challenges");
          accountCreated = true;
        } else {
          console.warn("MT5Account generation failed, retrying...");
          retries++;
        }
      } catch (err) {
        console.error("Error in account creation attempt:", err);
        retries++;
      }
    }

    if (!accountCreated) {
      toast.error("Failed to create account. Please try again later.", {
        id: toastID,
      });
    }

    setCreatingLoading(false);
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
