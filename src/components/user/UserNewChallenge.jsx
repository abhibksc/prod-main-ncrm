import { useEffect, useState } from "react";
import {
  ChevronDown,
  Check,
  ArrowLeft,
  Upload,
  ArrowRightCircleIcon,
  Loader2,
} from "lucide-react";
import CountUp from "react-countup";

import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import {
  setAvailableBalance,
  setCurrentAccount,
  setDepositBalance,
  setInvestorPassword,
  setMasterPassword,
} from "../../redux/user/userSlice";
import UseUserHook from "@/hooks/user/UseUserHook";
import { useNavigate } from "react-router-dom";

const UserNewChallenge = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    country: "",
    accountType: "",
    platform: "",
    accountSize: "",
    accountBalance: "",
    isUSResident: false,
    title: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    zipCode: "",
    state: "",
    dateOfBirth: "",
    leverage: "",
    email: "",
    phone: "",
  });
  const [startAnimation, setStartAnimation] = useState(false);
  const [creatingLoading, setCreatingLoading] = useState(false);
  const { GetCloseTradeAPI, GetUserInfoAPI } = UseUserHook();
  const [selectedPayment, setSelectedPayment] = useState("");
  const [file, setFile] = useState(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const dispatch = useDispatch();
  const [direction, setDirection] = useState(1);
  const navigate = useNavigate();
  // use effect for the count animation  -----------
  useEffect(() => {
    setStartAnimation(false);
    setTimeout(() => setStartAnimation(true), 100);
  }, [formData.accountSize]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    const updatedValue =
      name === "phone" ? parseInt(value.replace(/\D/g, ""), 10) || "" : value;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : updatedValue,
    }));
  };
  // Add user api handler---------------

  const apiTestHandler = async () => {
    const toastID = toast.loading("Please wait..");
    setCreatingLoading(true);
    const randomNumber = Math.floor(
      1000000 + Math.random() * 9000000
    ).toString();

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_END_POINT}/api/web/Adduser`,

        {
          Manager_Index: 1,
          MT5Account: randomNumber,
          Master_Pwd: "",
          Investor_Pwd: "",
          Name: formData.firstName,
          lName: formData.lastName,
          Email: formData.email,
          Phone: formData.phone,
          Address: formData.address,
          City: formData.city,
          Country: formData.country,
          State: formData.state,
          Zip_Code: formData.zipCode,
          Balance: parseInt(formData.accountBalance),
          Leverage: parseInt(formData.leverage),
          Group_Name: "SK GROUP\\M10\\CLASSIC",
        }
      );

      const newChallengeDBres = await axios.post(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/new-challenge`,
        {
          managerIndex: 1,
          MT5Account: randomNumber,
          masterPass: "",
          InvesterPass: "",
          fName: formData.firstName,
          lName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          State: formData.state,
          zipCode: formData.zipCode,
          balance: "0",
          levrage: parseInt(formData.leverage),
          groupName: "SK GROUP\\M10\\CLASSIC",
        }
      );
      dispatch(setCurrentAccount(randomNumber));

      setCreatingLoading(false);
      // const depositApires = await axios.get(
      //   `${
      //     import.meta.env.VITE_API_END_POINT
      //   }/api/web/MakeDepositBalance?Manager_Index=1&MT5Account=${randomNumber}&Amount=${
      //     formData.accountBalance
      //   }&Comment=TEST`
      // );

      const depositDBres = await axios.post(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/deposit`,
        {
          deposit: formData.accountSize,
          balance: formData.accountBalance,
          mt5Account: randomNumber,
          status: "pending",
          userId: "66de89ee0ab97583ae19ec9a",
          managerIndex: "1",
        }
      );

      dispatch(setDepositBalance(formData.accountBalance));
      dispatch(setInvestorPassword(res.data.Investor_Pwd));
      dispatch(setMasterPassword(res.data.Master_Pwd));
      dispatch(setAvailableBalance(formData.accountBalance));
      GetUserInfoAPI();
      // GetCloseTradeAPI();
      toast.success("Created new challenge", { id: toastID });

      console.log("add user api res---", res);
      console.log("deposit DBdeposit res --", depositDBres);
      // navigate("/user/dashboard");
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
  const countries = ["Afghanistan", "Albania", "Algeria", "Zimbabwe"];
  const leverageOptions = [
    { id: 1, label: "1:100", value: "100" },
    { id: 2, label: "1:200", value: "200" },
    { id: 3, label: "1:300", value: "300" },
    { id: 4, label: "1:400", value: "400" },
    { id: 5, label: "1:500", value: "500" },
    { id: 6, label: "1:600", value: "600" },
    { id: 7, label: "1:700", value: "700" },
    { id: 8, label: "1:800", value: "800" },
    { id: 9, label: "1:900", value: "900" },
    { id: 10, label: "1:1000", value: "1000" },
  ];

  const accountTypes = ["1 Step", "2 Step", "3 Step", "2 Step X"];

  const accountOptions = [
    { display: 5000, value: 49 },
    { display: 10000, value: 99 },
    { display: 25000, value: 149 },
    { display: 50000, value: 249 },
    { display: 100000, value: 449 },
  ];

  const platforms = [
    { name: "MT5", logo: "🌟" },
    { name: "cTrader", logo: "💹" },
    { name: "TradeLocker", logo: "🔒" },
    { name: "TradingView", logo: "📈" },
  ];
  const accountSizes = ["$5,000", "$10,000", "$25,000", "$50,000", "$100,000"];

  const paymentMethods = [
    {
      name: "Tether(BEP20)",
      icon: "💰",
      details: "Send USDT to: 0x1234...5678",
    },
    { name: "Ethereum", icon: "🔷", details: "Send ETH to: 0xabcd...efgh" },
    {
      name: "TRON(TRC20)",
      icon: "🔴",
      details: "Send TRX to: TRX1234...5678",
    },
  ];

  return (
    <div className="bg-secondary-800/60 p-10 mb-20 text-white rounded-lg max-w-3xl md:max-w-4xl mx-auto">
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
              {/* <button onClick={apiTestAPI}>Click here</button> */}

              <div>
                <label className="block mb-2 text-sm font-medium">
                  1. Choose your country
                </label>
                <div className="relative">
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full bg-secondary-800 p-3 rounded appearance-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select country</option>
                    {countries.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  2. Choose your account type
                </label>
                <div className="flex flex-wrap gap-2">
                  {accountTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() =>
                        setFormData({ ...formData, accountType: type })
                      }
                      className={`py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                        formData.accountType === type
                          ? "bg-secondary-600 text-white"
                          : "bg-secondary-700/50 hover:bg-secondary-700"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  3. Choose your platform
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {platforms.map((plt) => (
                    <button
                      key={plt.name}
                      onClick={() =>
                        setFormData({ ...formData, platform: plt.name })
                      }
                      className={`p-4 flex rounded-full items-center justify-center transition-colors ${
                        formData.platform === plt.name
                          ? "bg-secondary-700"
                          : "bg-secondary-700/20 hover:bg-secondary-700/40"
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
                  4. Choose account size
                </label>
                <div className="flex flex-wrap gap-2">
                  {accountOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          accountSize: option.value,
                          accountBalance: option.display,
                        })
                      }
                      className={`py-2 px-4 rounded-full text-sm font-medium transition-colors ${
                        formData.accountSize === option.value
                          ? "bg-secondary-700 text-white"
                          : "bg-secondary-800 hover:bg-secondary-900/60"
                      }`}
                    >
                      {option.display}
                    </button>
                  ))}
                </div>

                <div className=" my-5">
                  <label className="block mb-2 text-sm font-medium">
                    5. Choose your Leverage
                  </label>
                  <div className="relative">
                    <select
                      name="leverage"
                      value={formData.leverage}
                      onChange={handleInputChange}
                      className="w-full bg-secondary-800 p-3 rounded appearance-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Leverage</option>
                      {leverageOptions.map((value) => (
                        <option key={value.id} value={value.value}>
                          {value.label}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="usResident"
                  name="isUSResident"
                  checked={formData.isUSResident}
                  onChange={handleInputChange}
                  className="mr-2"
                />
                <label htmlFor="usResident" className="text-sm">
                  I am not a US resident or citizen.
                </label>
              </div>

              <div className="mt-12 mb-8 flex flex-col items-center bg-secondary-800/80 p-6 rounded-lg">
                <div className="flex items-center flex-col justify-between mb-4">
                  <div className="text-2xl text-center font-bold text-blue-400">
                    5K Two Step X Student
                  </div>
                </div>
                <div className="text-blue-400 mb-4">Account Size 5000 USD</div>
                <button className="bg-blue-600 text-white py-2 px-4 rounded-full mb-6">
                  MATCHTRADER
                </button>
                <div className="space-y-2">
                  {[
                    "10% Profit Target*",
                    "8% Max Overall Loss*",
                    "4% Max Daily Loss*",
                  ].map((item, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="text-green-500 mr-2" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                <div className="text-sm text-gray-400 mt-4">
                  *For a more detailed overview visit{" "}
                  <span className="text-blue-400">here</span>
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
                  Mobile Number*
                </label>
                <input
                  type="tel"
                  name="phone"
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
              <h2 className="text-2xl font-bold mb-6">
                Your Challenge and Payment Details
              </h2>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-4">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.name}
                      onClick={() => setSelectedPayment(method.name)}
                      className={`p-4 flex flex-col items-center justify-center rounded-lg transition-colors ${
                        selectedPayment === method.name
                          ? "bg-secondary-600 text-white"
                          : "bg-secondary-700/50 hover:bg-secondary-700"
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
                  <p className="text-sm">
                    {
                      paymentMethods.find((m) => m.name === selectedPayment)
                        ?.details
                    }
                  </p>
                </div>
              )}

              <div className=" flex  gap-10">
                <div className=" flex gap-5 items-center">
                  <h1 className=" text-xl font-semibold">Deposit Balance</h1>
                  <p className=" bg-orange-400/80 px-5 py-1 font-semibold rounded-full">
                    {formData.accountBalance}
                  </p>
                </div>

                <div className=" flex gap-5 items-center">
                  <h1 className=" text-xl font-semibold">Payable Amount</h1>
                  <p className=" bg-green-600 px-5 py-1 font-semibold rounded-full">
                    ${formData.accountSize}
                  </p>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Upload proof of payment
                </label>
                <div className="flex items-center space-x-4">
                  <label className="cursor-pointer bg-secondary-700 hover:bg-secondary-600 transition-colors py-2 px-4 rounded-lg flex items-center">
                    <Upload className="mr-2" />
                    Choose file
                    <input
                      type="file"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files[0])}
                    />
                  </label>
                  <span className="text-sm">
                    {file ? file.name : "No file chosen"}
                  </span>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  checked={agreeToTerms}
                  onChange={(e) => setAgreeToTerms(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="agreeToTerms" className="text-sm">
                  I agree to{" "}
                  <span className="text-blue-400 cursor-pointer">
                    Terms & Conditions
                  </span>
                </label>
              </div>

              <button
                onClick={apiTestHandler}
                disabled={!agreeToTerms}
                className={`w-full flex mx-auto justify-center items-center py-3 px-4 rounded-lg text-white transition-colors ${
                  selectedPayment && agreeToTerms
                    ? "bg-green-700 hover:bg-green-800"
                    : "bg-gray-600 cursor-not-allowed"
                }`}
              >
                Submit Request
                {creatingLoading && (
                  <Loader2 className=" animate-spin mx-2"></Loader2>
                )}
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex relative justify-between mt-8">
        {step > 1 && (
          <button
            onClick={prevStep}
            disabled={step === 1}
            className="bg-gray-500 text-white px-4 py-2  rounded-full disabled:opacity-50"
          >
            <ArrowLeft className="inline-block mr-2" />
            Back
          </button>
        )}

        {step <= 2 ? (
          <div className="  absolute top-[-10px] right-0">
            <button
              onClick={nextStep}
              className="bg-blue-500 text-white px-4 py-2  rounded-full"
            >
              Next
              <ArrowRightCircleIcon className="inline-block ml-2" />
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
