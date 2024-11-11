import React, { useEffect, useState } from "react";
import {
  Copy,
  Check,
  ChevronDown,
  Smile,
  Users,
  ArrowRight,
  ChartBar,
  Wallet,
  Gift,
  Wallet2,
  RotateCwIcon,
  HandCoins,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import axios from "axios";
import UseUserHook from "@/hooks/user/UseUserHook";
import toast from "react-hot-toast";
import UserIBcards from "@/components/user/UserIBCards";

const UserReferal = () => {
  const [activeTab, setActiveTab] = useState("commission");
  const [isCopied, setIsCopied] = useState(false);
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const { getUpdateLoggedUser } = UseUserHook();
  const [isVisible, setIsVisible] = useState(false);
  const [refreshLoading, setIsRefreshLoading] = useState(false);

  const currentUrl = window.location.href;
  const extractedUrl = new URL(currentUrl).origin;
  const referralLink = `${extractedUrl}/user/signup/${loggedUser?.referalId}`;
  const [commissionsData, setCommissionsData] = useState([]);

  const TabButton = ({ label, isActive, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base ${
        isActive
          ? "bg-secondary-500/70 text-white shadow-lg"
          : "text-white hover:bg-secondary-700/20"
      }`}
      onClick={onClick}
    >
      {label}
    </motion.button>
  );

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };
  console.log(commissionsData);
  // generate IB account handler ------------

  const generateHandler = async () => {
    const randomNumber = Math.floor(10000 + Math.random() * 90000).toString();
    const toastId = toast.loading("Gerating..");

    try {
      const generateMtId = await axios.post(
        `${import.meta.env.VITE_API_END_POINT}/api/web/Adduser`,
        {
          Manager_Index: import.meta.env.VITE_MANAGER_INDEX,
          MT5Account: randomNumber,
          Name: loggedUser.firstName,
          Leverage: import.meta.env.VITE_IB_LEVERAGE || "200",
          Group_Name: import.meta.env.VITE_IB_GROUP_NAME,
        }
      );
      const updateLoggedUser = await axios.put(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/update-user`,
        {
          id: loggedUser._id,
          referalId: generateMtId.data.MT5Account,
        }
      );
      toast.success("IB account created", { id: toastId });
      getUpdateLoggedUser();
      // console.log("generate mt id ---", generateMtId.data.MT5Account);
      // console.log("updateLoggedUser---", updateLoggedUser.data);
    } catch (error) {
      console.log(error);
      toast.error(" Something went wrong", { id: toastId });
    }
  };
  // fetch all commissions data------------

  const fetchCommissions = async () => {
    try {
      setIsRefreshLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/get-commissions`
      );

      const commissions = res.data.data.filter(
        (value) => value?.referralId === loggedUser.referalId
      );
      setCommissionsData(commissions);
      setIsRefreshLoading(false);
    } catch (error) {
      console.log(error);
      setIsRefreshLoading(false);
    }
  };
  // formate date -----------------

  function formatDate(isoDateString) {
    const date = new Date(isoDateString);

    const formattedDate = date.toLocaleDateString("en-GB", {
      year: "numeric",
      day: "2-digit",
      month: "2-digit",
    });

    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // 12-hour format with AM/PM
    });

    return `${formattedDate}, ${formattedTime}`;
  }
  // since joined ---------------

  function calculateTimeSinceJoined(isoDateString) {
    const joinDate = new Date(isoDateString);
    const today = new Date();

    // Calculate the difference in time (in milliseconds)
    const timeDifference = today - joinDate;

    // Calculate different time units
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );

    // Build the time string
    let timeString = [];

    if (days > 0) {
      timeString.push(`${days} day${days !== 1 ? "s" : ""}`);
    }
    if (hours > 0) {
      timeString.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
    }
    if (minutes > 0) {
      timeString.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
    }

    // Handle case when less than a minute
    if (timeString.length === 0) {
      return "less than a minute ago";
    }

    return timeString.join(", ") + " ago";
  }

  // reresh handler -----------

  const refreshHandler = () => {
    fetchCommissions();
  };

  const ReferralsView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-4 sm:space-y-6 rounded-xl"
    >
      <div className="bg-secondary-800/60 max-w-5xl mx-auto sm:p-6 rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl">
        <h3 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4">
          Referral Link
        </h3>
        <div className="flex flex-col sm:flex-row items-center bg-gray-100 p-2 sm:p-3 rounded-lg">
          <input
            type="text"
            value={referralLink}
            readOnly
            className="w-full sm:w-auto flex-grow bg-transparent outline-none text-gray-700 text-sm mb-2 sm:mb-0"
          />
          <motion.button
            onClick={copyToClipboard}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full sm:w-auto sm:ml-4 bg-secondary-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-secondary-700 transition-colors duration-300 flex items-center justify-center"
          >
            {isCopied ? <Check size={18} /> : <Copy size={18} />}
            {isCopied && (
              <motion.span layout className="ml-2 text-sm">
                Copied
              </motion.span>
            )}
          </motion.button>
        </div>
        <p className="text-xs sm:text-sm text-yellow-500 font-semibold mt-3 flex items-center">
          <Smile className="mr-2" size={16} />
          Share this link to invite your friends and earn commissions.
        </p>
      </div>
    </motion.div>
  );

  const CommissionView = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-4 sm:space-y-6"
    >
      <UserIBcards commissionsData={commissionsData}></UserIBcards>
      <div className="bg-secondary-800/60 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className=" flex justify-between items-center px-5">
          <h3 className="font-semibold text-base sm:text-xl p-4 sm:px-3 sm:py-6 ">
            Referral Details
          </h3>
          <div
            onClick={refreshHandler}
            className=" flex items-center cursor-pointer gap-1 hover:scale-105 transition-all hover:text-gray-300"
          >
            <RotateCwIcon
              className={`${refreshLoading && "animate-spin"}`}
            ></RotateCwIcon>
            <button className=" mt-2 "></button>
            <p>Refresh</p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary-700/60 text-white">
              <tr>
                <th className="p-3 sm:p-4 text-left text-sm sm:text-base">
                  Name/Email
                </th>
                <th className="p-3 sm:p-4 text-center text-sm sm:text-base">
                  AC NO:
                </th>
                <th className="p-3 sm:p-4 text-center text-sm sm:text-base">
                  AC Type
                </th>
                <th className="p-3 sm:p-4 text-center text-sm sm:text-base">
                  Country
                </th>
                <th className="p-3 sm:p-4 text-center text-sm sm:text-base">
                  Deposit
                </th>
                <th className="p-3 sm:p-4 text-center text-sm sm:text-base">
                  Account Size
                </th>
                <th className="p-3 sm:p-4 text-center text-sm sm:text-base">
                  Commission
                </th>
                <th className="p-3 sm:p-4 text-center text-sm sm:text-base">
                  Time Stamp
                </th>
              </tr>
            </thead>
            <tbody>
              {!commissionsData && (
                <tr className="text-gray-400 text-center">
                  <td colSpan="4" className="p-3 sm:p-4 text-sm sm:text-base">
                    No commission data available
                  </td>
                </tr>
              )}
              {commissionsData?.map((value) => (
                <tr
                  key={value._id}
                  className="text-gray-200 border-b border-secondary-800"
                >
                  <td className="pl-6 py-3 text-sm sm:text-base">
                    <div>
                      <p> {value?.currentReferral?.firstName} </p>
                      <p className=" text-gray-400">
                        {" "}
                        {value?.currentReferral?.email}
                      </p>
                    </div>
                  </td>
                  <td className="text-sm text-center sm:text-base">
                    {value?.mt5Account}
                  </td>
                  <td className=" text-center text-sm sm:text-base">
                    {value?.accountType}
                  </td>
                  <td className=" text-center text-sm sm:text-base">
                    {value?.currentReferral?.country || "null"}
                  </td>
                  <td className=" text-center text-sm sm:text-base">
                    ${value?.depositBalance}
                  </td>
                  <td className=" text-center text-sm sm:text-base">
                    ${value?.accountSize}
                  </td>
                  <td className=" text-center text-sm sm:text-base">
                    ${value?.commission}
                  </td>
                  <td className="py-3 text-center px-4">
                    <div>{formatDate(value?.createdAt)}</div>
                    <div className="text-sm text-gray-400">
                      {calculateTimeSinceJoined(value?.createdAt)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );

  // use effect -------

  useEffect(() => {
    setIsVisible(true);
    getUpdateLoggedUser();
    fetchCommissions();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className=" w-full mx-auto p-4 sm:p-8 rounded-xl bg-secondary-800/10"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-8 space-y-2 sm:space-y-0">
        {!loggedUser.referalId ? (
          ""
        ) : (
          <div className="space-x-2 sm:space-x-4 flex">
            <TabButton
              label="Referral"
              isActive={activeTab === "referrals"}
              onClick={() => setActiveTab("referrals")}
            />
            <TabButton
              label="Affliate Dashboard"
              isActive={activeTab === "commission"}
              onClick={() => setActiveTab("commission")}
            />
          </div>
        )}
        {loggedUser.referalId && (
          <div>
            <div className=" flex font-semibold gap-2">
              <HandCoins className=" text-yellow-500"></HandCoins>
              <p>Affliate ID</p>
            </div>
            <div className=" bg-yellow-500/10 ml-4 shadow-2xl px-2 my-1 py-1 rounded-full text-center">
              <p className=" text-gray-200  font-semibold  text-lg">
                {loggedUser?.referalId}
              </p>
            </div>
          </div>
        )}
      </div>
      {loggedUser.referalId ? (
        <AnimatePresence mode="wait">
          {activeTab === "referrals" ? (
            <ReferralsView key="referrals" />
          ) : (
            <CommissionView key="commission" />
          )}
        </AnimatePresence>
      ) : (
        <div className="p-4 md:mt-[-90px] mt-[-70px] rounded-2xl mb-8 w-full overflow-hidden">
          {/* Hero Section with Fade-in Animation */}
          <div
            className={`flex flex-col items-center text-center mb-12 transition-all duration-1000 transform ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <div className="bg-secondary-600/10 px-4 py-1 rounded-full text-sm font-medium text-secondary-600 mb-4 hover:bg-secondary-600/20 transition-colors">
              Earn 15% Per referral commission{" "}
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Transform Your Network Into <br />
              <span className="text-secondary-600 inline-block hover:scale-105 transition-transform">
                Passive Income
              </span>
            </h2>
            <p className="text-gray-300 max-w-xl mb-6">
              Join our Affiliate program and earn a fixed 15% commission for
              every account purchase. No complicated tiers, just straightforward
              earnings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <button
                className="px-6 py-3 bg-secondary-600/70 hover:bg-secondary-600/40 rounded-full flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                onClick={generateHandler}
              >
                <Users className="animate-pulse" size={20} />
                Generate Affiliate Account
              </button>
            </div>
          </div>

          {/* Stats Section with Stagger Animation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { value: "15%", label: "Referral Commission" },
              { value: "24/7", label: "Instant Payouts" },
              { value: "100%", label: "Transparent Terms" },
              { value: "∞", label: "Unlimited Referrals" },
            ].map((stat, index) => (
              <div
                key={index}
                className={`bg-secondary-700/20 p-4 rounded-xl shadow-sm hover:shadow-xl transition-all duration-500 transform hover:scale-105 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="text-2xl font-bold text-secondary-600">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Features Grid with Hover Effects */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {[
              {
                icon: Gift,
                title: "Easy Registration",
                description:
                  "Generate your affiliate account instantly with one click. No lengthy forms or waiting periods.",
              },
              {
                icon: ChartBar,
                title: "Real-time Tracking",
                description:
                  "Monitor your referrals and earnings in real-time through our intuitive dashboard.",
              },
              {
                icon: Wallet,
                title: "Instant Payouts",
                description:
                  "Access your earnings immediately. No minimum threshold or waiting period.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`bg-secondary-700/10 p-6 rounded-xl shadow-sm group hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-10"
                }`}
                style={{ transitionDelay: `${index * 200}ms` }}
              >
                <div className="w-12 h-12 bg-secondary-600/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-secondary-600/20 transition-all duration-300 group-hover:scale-110">
                  <feature.icon className="w-6 h-6 text-secondary-600 transition-transform duration-300 group-hover:rotate-12" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-300 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Getting Started Section with Step Animation */}
          <div
            className={`bg-secondary-700/10 rounded-xl p-8 shadow-sm transition-all duration-1000 transform ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h3 className="text-xl font-semibold mb-6 text-center">
              Start Earning in 3 Simple Steps
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  step: "1",
                  title: "Generate Account",
                  description:
                    "Click the button to instantly create your affiliate account",
                },
                {
                  step: "2",
                  title: "Share Your Link",
                  description: "Invite traders using your unique referral link",
                },
                {
                  step: "3",
                  title: "Earn Commission",
                  description: "Get 15% for every referral",
                },
              ].map((step, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 group"
                  style={{ transitionDelay: `${index * 300}ms` }}
                >
                  <div className="w-8 h-8 bg-secondary-600/10 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110">
                    <span className="text-secondary-600 font-medium">
                      {step.step}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">{step.title}</h4>
                    <p className="text-sm text-gray-300">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Final CTA with Pulse Animation */}
          <div
            className={`mt-12 text-center transition-all duration-1000 transform ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-10"
            }`}
          >
            <h3 className="text-2xl font-bold mb-4">
              Ready to Start Your affiliate Journey?
            </h3>
            <p className="text-gray-300 mb-6">
              Join our community of dedicated and successful affiliates.{" "}
            </p>
            <button
              className="px-8 py-4 bg-secondary-600/70 hover:bg-secondary-600/40 rounded-full flex items-center gap-2 mx-auto group transition-all duration-300 hover:scale-105 hover:shadow-lg"
              onClick={generateHandler}
            >
              <Users className="animate-pulse" size={20} />
              Generate affiliate Account
              <ArrowRight
                className="transform transition-transform group-hover:translate-x-2"
                size={20}
              />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default UserReferal;
