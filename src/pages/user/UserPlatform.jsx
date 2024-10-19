import React from "react";
import {
  Download,
  Laptop,
  Globe,
  Monitor,
  Smartphone,
  AppleIcon,
} from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const UserPlatform = () => {
  return (
    <div className="p-4 sm:p-8 bg-gradient-to-br from-primary-900 to-gray-800 min-h-screen">
      <motion.h2
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 sm:mb-12 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Download Trading Platforms
      </motion.h2>

      <div className="max-w-6xl mx-auto">
        <PlatformCard
          title="MetaTrader 5 (MT5)"
          description="Experience the power of MetaTrader 5 on your preferred device. Download now for advanced trading features and real-time market analysis."
          buttons={[
            {
              icon: <Smartphone className="w-5 h-5 sm:w-6 sm:h-6" />,
              text: "Android",
              downloadLink:
                "https://play.google.com/store/apps/details?id=net.metaquotes.metatrader5&pcampaignid=web_share",
            },
            {
              icon: <AppleIcon className="w-5 h-5 sm:w-6 sm:h-6" />,
              text: "iOS",
              downloadLink:
                "https://apps.apple.com/us/app/metatrader-5/id413251709?platform=ipad",
            },
            {
              icon: <Monitor className="w-5 h-5 sm:w-6 sm:h-6" />,
              text: "Windows",
              downloadLink:
                "https://download.mql5.com/cdn/web/metaquotes.ltd/mt5/mt5setup.exe?utm_source=www.metatrader5.com&utm_campaign=download",
            },
          ]}
        />
      </div>
    </div>
  );
};

const PlatformCard = ({ title, description, buttons }) => (
  <motion.div
    className="bg-secondary-800/30 rounded-2xl shadow-2xl overflow-hidden"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="p-4 sm:p-8">
      <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 sm:mb-4">
        {title}
      </h3>
      <p className="text-gray-300 mb-4 sm:mb-8 text-base sm:text-lg">
        {description}
      </p>
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
      className="w-full flex items-center justify-center space-x-2 sm:space-x-3 bg-secondary-700 hover:bg-secondary-700/60 text-white font-semibold py-2 sm:py-3 px-4 sm:px-6 rounded-xl transition-colors duration-300 shadow-lg hover:shadow-xl text-sm sm:text-base"
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
