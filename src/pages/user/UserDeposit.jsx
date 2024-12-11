import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import UserNewChallengeHook from "@/hooks/user/UseNewChallengeHook";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ClipboardIcon,
  Eye,
  Image,
  Loader2,
  LoaderPinwheelIcon,
  Upload,
  X,
} from "lucide-react";
import ModernHeading from "@/lib/ModernHeading";
import { backendApi, metaApi } from "@/utils/apiClients";

export default function UserDeposit() {
  const loggedUser = useSelector((store) => store.user.loggedUser);

  const [formData, setFormData] = useState({
    apiGroup: "",
    depositAmount: "",
    accountNumber: "",
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
    <div className=" w-full bg-secondary-800/20 p-8 rounded-xl mx-auto">
      <div className="space-y-6 text-white">
        <div>
          <ModernHeading text={"Deposit Funds"}></ModernHeading>
        </div>
        <div className=" flex justify-between gap-10">
          <div className="flex flex-col gap-2 w-full">
            <label
              htmlFor="currency"
              className="text-sm font-medium flex justify-between text-gray-200"
            >
              <p>Select Account</p>
              {balanceLoading ? (
                <LoaderPinwheelIcon className=" animate-spin text-secondary-500"></LoaderPinwheelIcon>
              ) : (
                accountBalance && (
                  <p className="px-4">
                    Balance :{" "}
                    <span className="bg-secondary-500/10 px-3 py-1 rounded-full text-secondary-500">
                      ${accountBalance}
                    </span>{" "}
                  </p>
                )
              )}
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
              <option
                disabled
                className=" bg-secondary-800 text-white"
                value=""
              >
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
              ))}
            </select>
          </div>
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
          <div className="flex gap-3 md:mt-5 items-center w-full">
            <h1 className="sm:text-sm font-semibold text-gray-300">
              INR Figure
            </h1>
            <p className="bg-secondary-500/10 text-secondary-500 txt px-4 sm:px-5 py-1 font-semibold rounded-full">
              &#8377; {formData.depositAmount * 85}
            </p>
          </div>
        </div>

        <div>
          <label className="block mb-2 text-sm font-medium">
            Select Payment Method
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredMethodsData.map((method) => (
              <button
                key={method.name}
                onClick={() => setSelectedPayment(method.name)}
                className={`p-4 flex flex-col items-center font-semibold justify-center rounded-xl transition-colors ${
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
          <div className="bg-secondary-800/80 p-4 rounded-lg">
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
                <span className="text-xs">{copied ? "Copied!" : "Copy"}</span>
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
              <div className="  mt-6 my-4 w-full flex gap-2 justify-center items-center rounded-md">
                <a
                  className=" flex gap-2 text-blue-400 hover:text-blue-500 transition-all"
                  target="_blank"
                  href={`${
                    import.meta.env.VITE_BACKEND_BASE_URL
                  }/${paymentImage}`}
                >
                  <Image className=""></Image>
                  View image
                </a>

                {/* <img
                  src={`${
                    import.meta.env.VITE_BACKEND_BASE_URL
                  }/${paymentImage}`}
                  alt=""
                  className=" rounded-md w-[20%]"
                /> */}
              </div>
            )}
          </div>
        )}
        {/* <div className="flex justify-between items-center gap-10 w-full]">
          <div className=" flex flex-col gap-2 w-[40%]">
            <label
              htmlFor="deposit-amount"
              className="text-sm font-medium text-gray-200"
            >
              Depositable Amount
            </label>
            <input
              type="number"
              id="deposit-amount"
              name="deposit-amount"
              placeholder="Enter amount"
              className="w-full px-4 py-2 border bg-secondary-800/20 border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
            />
          </div>
          <div className="flex gap-3 md:mt-5 items-center w-[60%]">
            <h1 className="sm:text-sm font-semibold text-gray-300">
              INR Figure
            </h1>
            <p className="bg-secondary-500/10 text-secondary-500 txt px-4 sm:px-5 py-1 font-semibold rounded-full">
              &#8377; {12 * 84}
            </p>
          </div>
        </div> */}

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
            <div className="bg-secondary-900 p-4 rounded-lg max-w-3xl max-h-[90vh] overflow-auto">
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full h-auto rounded"
              />
              <button
                onClick={togglePreview}
                className="mt-4 bg-red-500/80 text-white px-6 py-2 rounded-full hover:bg-red-600/70"
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
        <div className=" flex justify-center items-center">
          <button
            onClick={submitHandler}
            disabled={
              !agreeToTerms || creatingLoading || !selectedPayment || !file
            }
            className={` flex mx-auto justify-center items-center py-3 px-12 hover:px-16 transition-all rounded-full text-white ${
              selectedPayment && agreeToTerms && file
                ? "bg-secondary-500/90 hover:bg-secondary-500/80 "
                : "bg-gray-600  pointer-events-none"
            }`}
          >
            Submit Request
            {creatingLoading && (
              <Loader2 className="animate-spin mx-2"></Loader2>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
