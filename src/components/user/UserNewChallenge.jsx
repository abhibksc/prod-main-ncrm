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

  function generateRandomNumber(digits) {
    if (digits <= 0) throw new Error("Digits must be a positive number");
    const min = Math.pow(10, digits - 1);
    const max = Math.pow(10, digits) - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const createAccountHandler = async () => {
    const randomNumber = generateRandomNumber(siteConfig.mt5Digit || 6);
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
          setCreatingLoading(false);
          toast.success("Account created Successfully", { id: toastID });
          navigate("/user/dashboard");
          await getUpdateLoggedUser();
          // sending mail -------------
          const customContent = `<!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Withdrawal Request Confirmation - Arena Trade</title>
            <style>
              body, html {
                margin: 0;
                padding: 0;
                font-family: 'Arial', sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f4f4;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 5px;
                background-color: #ffffff;
              }
              .header {
                background-color: #19422df2;
                color: #ffffff;
                padding: 20px 15px;
                text-align: center;
                border-radius: 10px 10px 0 0;
              }
              .header h1 {
                margin: 0;
                font-size: 22px;
                letter-spacing: 1px;
              }
              .content {
                padding: 10px 20px;
              }
              .cta-button {
                display: inline-block;
                padding: 12px 24px;
                background-color: #2d6a4f;
                color: #FFFFFF;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                margin: 10px 0;
              }
              .footer {
                background-color: #19422df2;
                color: #ffffff;
                text-align: center;
                padding: 5px 10px;
                font-size: 12px;
                border-radius: 0 0 10px 10px;
              }
              .footer-info {
                margin-top: 6px;
              }
              .footer-info a {
                color: #B6D0E2;
                text-decoration: none;
              }

              .withdrawal-details {
                background-color: #f8f8f8;
                border-left: 4px solid #2d6a4f;
                padding: 15px;
                margin: 20px 0;
              }
              .withdrawal-details p {
                margin: 5px 0;
              }
              .highlight {
                font-weight: bold;
                color: #0a2342;
              }
              .risk-warning {
                color: #C70039;
                padding: 5px;
                font-size: 12px;
                line-height: 1.4;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Account Created</h1>
              </div>
              <div class="content">
                <p>Dear ${
                  loggedUser?.firstName + " " + loggedUser?.lastName
                },</p>
        <p>We are pleased to inform you that your MT5 trading account has been successfully created. Below are your account details:</p>
               <div class="withdrawal-details">

                <p>Account No: <span class="highlight">${
                  generateMt5.data.MT5Account
                }</span></p>
                  <p>Account Type: <span class="highlight">${
                    formData.accountType
                  }</span></p>
                  <p>Leverage: <span class="highlight">${
                    formData.leverage
                  }</span></p>
                  <p>Master Password: <span class="highlight">${
                    generateMt5.data.Master_Pwd
                  }</span></p>
                  <p>Investor Password: <span class="highlight">${
                    generateMt5.data.Investor_Pwd
                  }</span></p>
                  <p>Server Name: <span class="highlight">${
                    import.meta.env.VITE_SERVER_NAME
                  }</span></p>
                  <p>Platform: <span class="highlight">${
                    formData.platform
                  }</span></p>
                </div>

          <p>Thank you for choosing us.</p>
          <p>Happy trading!</p>
                <p>Best regards,<br>The ${
                  import.meta.env.VITE_WEBSITE_NAME || "Forex"
                } Team</p>
                <hr>

              </div>
               <div class="footer">
                <div class="footer-info">
           <p>${import.meta.env.VITE_EMAIL_ADDRESS || "forextest@mail.com"}</p>
                  <p>Website: <a href="https://${
                    import.meta.env.VITE_EMAIL_WEBSITE
                  }"> ${
            import.meta.env.VITE_EMAIL_WEBSITE
          } </a> | E-mail: <a href="mailto:${
            import.meta.env.VITE_EMAIL_EMAIL || "forextest@mail.com"
          }">${import.meta.env.VITE_EMAIL_EMAIL || "forextest@mail.com"}</a></p>
                  <p>We sent out this message to all existing ${
                    import.meta.env.VITE_WEBSITE_NAME || "Forex"
                  } traders. Please visit this page to know more about our Privacy Policy.</p>
                  <p>&copy; 2024 ${
                    import.meta.env.VITE_WEBSITE_NAME || "Forex"
                  }. All Rights Reserved</p>
                </div>
              </div>
            </div>
          </body>
          </html>`;
          try {
            const customMailRes = await backendApi.post(`/custom-mail`, {
              email: loggedUser.email,
              content: customContent,
              subject: "Account Created",
            });
          } catch (error) {
            console.log("error sending mail", error);
          }
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
                    ? "bg-secondary-500-70 shadow-lg  font-semibold"
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
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={createAccountHandler}
            className="bg-secondary-500-80 px-12 py-3 shadow-md hover:bg-secondary-500-70 transition-all hover:px-16 rounded-full"
          >
            Create Account
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserNewChallenge;
