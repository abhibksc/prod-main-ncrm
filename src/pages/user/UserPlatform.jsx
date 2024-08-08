import React from "react";
import {
  Download,
  Laptop,
  Globe,
  Monitor,
  Smartphone,
  AppleIcon,
} from "lucide-react";

const UserPlatform = () => {
  return (
    <div className="p-6 bg-gradient-to-br min-h-screen">
      <h2 className="text-4xl font-bold text-white mb-8 text-center">
        Download Trading Platforms
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PlatformCard
          title="MetaTrader 5 (MT5)"
          description="Download MT5 for desktop and mobile devices."
          buttons={[
            { icon: <Monitor className="w-6 h-6" />, text: "Windows" },
            { icon: <AppleIcon className="w-6 h-6" />, text: "iOS" },
            { icon: <Smartphone className="w-6 h-6" />, text: "Android" },
          ]}
        />

        <PlatformCard
          title="Webtrader"
          description="Access our web-based trading platform."
          buttons={[
            { icon: <Globe className="w-6 h-6" />, text: "Browser" },
            { icon: <Laptop className="w-6 h-6" />, text: "Desktop" },
          ]}
        />
      </div>
    </div>
  );
};

const PlatformCard = ({ title, description, buttons }) => (
  <div className="bg-secondary-800/60 rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl ">
    <div className="p-6">
      <h3 className="text-2xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-300 mb-6">{description}</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {buttons.map((button, index) => (
          <DownloadButton key={index} icon={button.icon} text={button.text} />
        ))}
      </div>
    </div>
  </div>
);

const DownloadButton = ({ icon, text }) => (
  <button className="flex items-center justify-center space-x-2 bg-secondary-700 hover:bg-secondary-700/60 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300">
    {icon}
    <span>{text}</span>
    <Download className="w-4 h-4" />
  </button>
);

export default UserPlatform;
