import { useEffect, useState, useRef } from "react";
import { ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import UseUserHook from "@/hooks/user/UseUserHook";
import { useNavigate } from "react-router-dom";
import UserNewChallengeHook from "@/hooks/user/UseNewChallengeHook";
import ModernHeading from "@/lib/ModernHeading";
import { backendApi, metaApi } from "@/utils/apiClients";
const UserNewChallenge = () => {
  const loggedUser = useSelector((store) => store.user.loggedUser);

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

  const filterAccountConfig = accountConfigurations?.find(
    (value) => value.accountType === formData.accountType
  );

  const navigate = useNavigate();
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

  // add main api handler---------------

  function generateRandomNumber(digits) {
    if (digits <= 0) throw new Error("Digits must be a positive number");
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const createAccountHandler = async () => {
    const randomNumber = generateRandomNumber(import.meta.env.VITE_MT5_DIGIT);
    if (!creatingLoading) {
      const toastID = toast.loading("Please wait..");
      try {
        const generateMt5 = await metaApi.post(`/Adduser`, {
          Manager_Index: import.meta.env.VITE_MANAGER_INDEX,
          MT5Account: randomNumber,
          Name: loggedUser.firstName + " " + loggedUser.lastName,
          Country: loggedUser.Country,
          Leverage: formData.leverage,
          Group_Name: formData.apiGroup,
        });
        console.log(generateMt5);

        if (generateMt5.data.MT5Account > 0) {
          const addAccountToDB = await backendApi.post(
            `/add-mt5-account/${loggedUser._id}`,
            {
              accountNumber: generateMt5.data.MT5Account,
              leverage: formData.leverage,
              accountType: formData.accountType,
              groupName: formData.apiGroup,
              masterPassword: generateMt5.data.Master_Pwd,
              investorPassword: generateMt5.data.Investor_Pwd,
              platform: formData.platform,
            }
          );
          toast.success("Account created Successfully", { id: toastID });
          setCreatingLoading(false);
          await getUpdateLoggedUser();
          navigate("/user/dashboard");
        } else {
          toast.error("Please Retry again!!", { id: toastID });
          setCreatingLoading(false);
        }
      } catch (error) {
        setCreatingLoading(false);
        toast.error("Please try again", { id: toastID });
        console.log("add account error---", error);
      }
    }
  };

  // fetch Account Configurations --------------

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
    <div className="bg-secondary-800/30 p-10 mb-20 text-white rounded-lg w-full mx-auto">
      <div className="space-y-6">
        <ModernHeading text={"Open MT5 Account"}></ModernHeading>

        <div className=" flex gap-6 items-center justify-between w-full">
          <div className=" w-full">
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
          <div className=" w-full">
            <div className=" my-5">
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
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            3. Choose your platform
          </label>
          <div className="grid grid-cols-2 gap-4">
            {filteredPlatformData?.map((plt) => (
              <button
                key={plt.name}
                onClick={() => setFormData({ ...formData, platform: plt.name })}
                className={`p-4 flex rounded-full items-center justify-center transition-colors ${
                  formData.platform === plt.name
                    ? "bg-secondary-500/70 shadow-lg  font-semibold"
                    : "bg-secondary-800/50 shadow-sm hover:bg-secondary-700/40"
                }`}
              >
                <span className="mr-2 text-2xl">{plt.logo}</span>
                <span>{plt.name}</span>
              </button>
            ))}
          </div>
        </div>
        <div className=" w-full flex items-center justify-center pt-10">
          <button
            onClick={createAccountHandler}
            className=" bg-secondary-500/80 px-12 py-3 shadow-md hover:bg-secondary-500/70 transition-all hover:px-16 rounded-full"
          >
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserNewChallenge;
