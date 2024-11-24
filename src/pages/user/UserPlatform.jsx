import React, { useEffect } from "react";
import {
  Download,
  Monitor,
  Smartphone,
  AppleIcon,
  Shield,
  UserCheck,
  FileText,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import UseUserHook from "@/hooks/user/UseUserHook";

const UserPlatform = () => {
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const { getUpdateLoggedUser } = UseUserHook();

  useEffect(() => {
    getUpdateLoggedUser();
  }, []);

  return (
    <div className="p-4 sm:p-8 bg-gradient-to-br from-primary-900 to-gray-800">
      {!loggedUser.kycVerified ? (
        <div className="mx-auto">
          <div className="bg-secondary-800/20 rounded-lg shadow-lg p-4">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="mx-auto mb-4 w-16">
                <Shield className="w-16 h-16 text-secondary-500" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Verify Your Identity</h2>
              <p className="text-gray-300">
                Complete KYC verification to access our trading platforms
              </p>
            </div>

            {/* Alert */}
            <div className="flex items-center bg-amber-50/90 border border-amber-200 rounded-lg p-4 mb-8">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <p className="ml-2 text-amber-700">
                Your account requires verification before accessing trading
                platforms
              </p>
            </div>

            {/* KYC Steps */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Step 1 */}
              <div className="p-4 rounded-lg border border-gray-700/30 bg-secondary-800/60 hover:shadow-md transition-shadow">
                <FileText className="w-8 h-8 text-secondary-500 mb-3" />
                <h3 className="font-semibold mb-2">1. Prepare Documents</h3>
                <p className="text-sm text-gray-300">
                  Have your ID, proof of address, and other required documents
                  ready
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-4 rounded-lg border border-gray-700/30 bg-secondary-800/60 hover:shadow-md transition-shadow">
                <UserCheck className="w-8 h-8 text-secondary-500 mb-3" />
                <h3 className="font-semibold mb-2">2. Submit Information</h3>
                <p className="text-sm text-gray-300">
                  Fill out your personal details and upload your verification
                  documents
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-4 rounded-lg border border-gray-700/30 bg-secondary-800/60 hover:shadow-md transition-shadow">
                <Shield className="w-8 h-8 text-secondary-500 mb-3" />
                <h3 className="font-semibold mb-2">3. Get Verified</h3>
                <p className="text-sm text-gray-300">
                  Our team will review your documents and verify your account
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-8 text-center">
              <Link to={"/user/account-details"}>
                <button className="bg-blue-600/80 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-600/70 transition-colors">
                  Start Verification
                </button>
              </Link>
            </div>

            {/* Footer Note */}
            <p className="mt-6 text-center text-sm text-gray-500">
              Your information is encrypted and securely stored following
              industry standards
            </p>
          </div>
        </div>
      ) : (
        <div>
          <motion.h2
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 sm:mb-12 text-center"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Download Trading Platforms
            <div className="max-w-6xl mt-10 mx-auto">
              <PlatformCard
                title="MetaTrader 5 (MT5)"
                description="Experience the power of MetaTrader 5 on your preferred device. Download now for advanced trading features and real-time market analysis."
                buttons={[
                  {
                    icon: (
                      <Smartphone className="w-5 text-secondary-500 h-5 sm:w-6 sm:h-6" />
                    ),
                    text: "Android",
                    downloadLink:
                      "https://play.google.com/store/apps/details?id=net.metaquotes.metatrader5&pcampaignid=web_share",
                  },
                  {
                    icon: (
                      <AppleIcon className="w-5 text-secondary-500 h-5 sm:w-6 sm:h-6" />
                    ),
                    text: "iOS",
                    downloadLink:
                      "https://apps.apple.com/us/app/metatrader-5/id413251709?platform=ipad",
                  },
                  {
                    icon: (
                      <Monitor className="w-5  text-secondary-500 h-5 sm:w-6 sm:h-6" />
                    ),
                    text: "Windows",
                    downloadLink:
                      "https://download.mql5.com/cdn/web/metaquotes.ltd/mt5/mt5setup.exe?utm_source=www.metatrader5.com&utm_campaign=download",
                  },
                ]}
              />
            </div>
          </motion.h2>
        </div>
      )}
    </div>
  );
};

const PlatformCard = ({ title, description, buttons }) => (
  <motion.div
    className=" overflow-hidden"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="p-4 sm:p-8">
      <h3 className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4 text-center text-transparent bg-clip-text bg-gradient-to-r from-secondary-500/80 to-gray-100 animate-text">
        {title}
      </h3>
      <style jsx>{`
        @keyframes gradient-shimmer {
          0% {
            background-position: 0% 0%;
          }
          50% {
            background-position: 100% 100%;
          }
          100% {
            background-position: 0% 0%;
          }
        }

        .animate-text {
          background-size: 300% 300%;
          animation: gradient-shimmer 4s linear infinite;
        }
      `}</style>

      <p className="text-gray-300 mb-4 sm:mb-8 sm:text-lg">{description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
        {buttons.map((button, index) => (
          <DownloadButton
            key={index}
            icon={button.icon}
            downloadLink={button.downloadLink}
            text={button.text}
          />
        ))}
      </div>
    </div>
  </motion.div>
);

const DownloadButton = ({ icon, text, downloadLink }) => (
  <Link to={downloadLink} target="_blank" className="group">
    <motion.button
      className="w-full flex items-center justify-center space-x-2 sm:space-x-3 bg-secondary-800/30 hover:bg-secondary-800 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-xl transition-colors duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div>{icon}</motion.div>
      <span>{text}</span>
      <Download className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-y-1 transition-transform duration-300" />
    </motion.button>
  </Link>
);

export default UserPlatform;
