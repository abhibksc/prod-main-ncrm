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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSelector } from "react-redux";
import axios from "axios";
import UseUserHook from "@/hooks/user/UseUserHook";
import toast from "react-hot-toast";

const UserReferal = () => {
  const [activeTab, setActiveTab] = useState("referrals");
  const [isCopied, setIsCopied] = useState(false);
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const { getUpdateLoggedUser } = UseUserHook();
  const [isVisible, setIsVisible] = useState(false);
  const [refreshLoading, setIsRefreshLoading] = useState(false);

  const currentUrl = window.location.href;
  const extractedUrl = new URL(currentUrl).origin;
  const referralLink = `${extractedUrl}/user/signup/${loggedUser?.referalId}`;
  const [referralUsers, setReferralsUsers] = useState([]);

  const TabButton = ({ label, isActive, onClick }) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={`px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 text-sm sm:text-base ${
        isActive
          ? "bg-secondary-700/80 text-white shadow-lg"
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
          Leverage: "200",
          Group_Name: "contest.Promo11",
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
  // fetch all users handler ------------

  const fetchJoinedUsers = async () => {
    try {
      setIsRefreshLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/get-users`
      );
      const joinedUsers = res.data.data.filter(
        (value) => value?.referralBy === loggedUser._id
      );
      setReferralsUsers(joinedUsers);
      setIsRefreshLoading(false);
    } catch (error) {
      console.log(error);
      setIsRefreshLoading(false);
    }
  };
  // reresh handler -----------

  const refreshHandler = () => {
    fetchJoinedUsers();
  };
  // use effect ---------------

  useEffect(() => {
    getUpdateLoggedUser();
    fetchJoinedUsers();
  }, []);

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
      <h2 className="text-xl sm:text-2xl font-bold">Total Commission: 0</h2>
      <div className="bg-secondary-800/60 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className=" flex justify-between items-center px-5">
          <h3 className="font-semibold text-base sm:text-xl p-4 sm:px-3 sm:py-6 ">
            Referrals Details
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
                  Client Name
                </th>
                <th className="p-3 sm:p-4 text-left text-sm sm:text-base">
                  Email
                </th>
                <th className="p-3 sm:p-4 text-left text-sm sm:text-base">
                  Deposit
                </th>
                <th className="p-3 sm:p-4 text-left text-sm sm:text-base">
                  Comision
                </th>
                <th className="p-3 sm:p-4 text-left text-sm sm:text-base">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {!referralUsers && (
                <tr className="text-gray-400 text-center">
                  <td colSpan="4" className="p-3 sm:p-4 text-sm sm:text-base">
                    No commission data available
                  </td>
                </tr>
              )}
              {referralUsers?.map((value) => (
                <tr key={value._id} className="text-gray-200">
                  <td className="pl-6 py-3 text-sm sm:text-base">
                    {value?.firstName}
                  </td>
                  <td className="pl-2 text-sm sm:text-base">{value?.email}</td>
                  <td className="pl-6 text-sm sm:text-base">000</td>
                  <td className="pl-6 text-sm sm:text-base">000</td>
                  <td className="pl-6 text-sm sm:text-base">Joined</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );

  // is visible use effect -------

  useEffect(() => {
    setIsVisible(true);
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
              label="Referrals"
              isActive={activeTab === "referrals"}
              onClick={() => setActiveTab("referrals")}
            />
            <TabButton
              label="Commission"
              isActive={activeTab === "commission"}
              onClick={() => setActiveTab("commission")}
            />
          </div>
        )}
        {loggedUser.referalId && (
          <div>
            <div className=" flex gap-2">
              <Wallet2 className=""></Wallet2>
              <p>Wallet Balance</p>
            </div>
            <div className=" bg-secondary-600/10 shadow-2xl font-semibold text-green-500 px-2 my-2 py-1 rounded-full text-center">
              <p>$0</p>
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
              Earn $5 Per Lot Traded
            </div>
            <h2 className="text-3xl font-bold mb-4">
              Transform Your Network Into <br />
              <span className="text-secondary-600 inline-block hover:scale-105 transition-transform">
                Passive Income
              </span>
            </h2>
            <p className="text-gray-300 max-w-xl mb-6">
              Join our IB program and earn a fixed $5 commission for every lot
              your referrals trade. No complicated tiers, just straightforward
              earnings.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <button
                className="px-6 py-3 bg-secondary-600/70 hover:bg-secondary-600/40 rounded-full flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-lg"
                onClick={generateHandler}
              >
                <Users className="animate-pulse" size={20} />
                Generate IB Account
              </button>
              <a
                href="#learn-more"
                className="group flex items-center gap-2 text-secondary-600 transition-all duration-300"
              >
                Learn More
                <ArrowRight
                  className="transform transition-transform group-hover:translate-x-2"
                  size={16}
                />
              </a>
            </div>
          </div>

          {/* Stats Section with Stagger Animation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { value: "$5", label: "Per Lot Commission" },
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
                  "Generate your IB account instantly with one click. No lengthy forms or waiting periods.",
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
                    "Click the button to instantly create your IB account",
                },
                {
                  step: "2",
                  title: "Share Your Link",
                  description: "Invite traders using your unique referral link",
                },
                {
                  step: "3",
                  title: "Earn Commission",
                  description: "Get $5 for every lot your referrals trade",
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
              Ready to Start Your IB Journey?
            </h3>
            <p className="text-gray-300 mb-6">
              Join our growing community of successful IBs today
            </p>
            <button
              className="px-8 py-4 bg-secondary-600/70 hover:bg-secondary-600/40 rounded-full flex items-center gap-2 mx-auto group transition-all duration-300 hover:scale-105 hover:shadow-lg"
              onClick={generateHandler}
            >
              <Users className="animate-pulse" size={20} />
              Generate IB Account
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
