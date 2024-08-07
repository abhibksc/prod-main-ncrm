import React from "react";
import { Download, Laptop, Globe } from "lucide-react";

const UserPlatform = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 text-white">
      <h2 className="text-3xl font-bold  ">Download</h2>

      {/* MT5 Download Section */}
      <div className="bg-secondary-800 shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold  mb-2">Download MT5</h3>
        <p className="mb-4">
          Download MetaTrader 5 (MT5) for desktop and mobile devices.
        </p>
        <div className="flex flex-wrap justify-around gap-4">
          <DownloadButton icon={<WindowsIcon />} text="Desktop Terminal" />
          <DownloadButton icon={<AppleIcon />} text="iOS Mobile" />
          <DownloadButton icon={<AndroidIcon />} text="Android Mobile" />
        </div>
      </div>

      {/* Webtrader Download Section */}
      <div className="bg-secondary-800 shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold  mb-2">Download Webtrader</h3>
        <p className=" mb-4">Download the web-based trading platform.</p>
        <div className="flex flex-wrap justify-around gap-4">
          <DownloadButton
            icon={<Globe className="w-8 h-8" />}
            text="Webtrader"
          />
          <DownloadButton
            icon={<Laptop className="w-8 h-8" />}
            text="Webtrader"
          />
        </div>
      </div>
    </div>
  );
};

const DownloadButton = ({ icon, text }) => (
  <div className="flex flex-col items-center">
    <div className="mb-2">{icon}</div>
    <span className="text-sm font-medium  mb-2">{text}</span>
    <button className="bg-secondary-600 hover:bg-secondary-600 text-white font-bold py-2 px-4 rounded">
      Download
    </button>
  </div>
);

const WindowsIcon = () => (
  <svg
    className="w-8 h-8 text-blue-500"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
  </svg>
);

const AppleIcon = () => (
  <svg
    className="w-8 h-8 text-gray-300"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm3.299 14.387c-.47.97-1.003 1.985-1.772 1.985-.769 0-.992-.507-1.85-.507-.859 0-1.128.499-1.839.499-.724 0-1.277-.955-1.739-1.909-1.153-2.057-1.276-4.465-.535-5.74.521-.896 1.454-1.463 2.457-1.463.765 0 1.478.508 1.944.508.466 0 1.333-.567 2.248-.567.577 0 2.165.233 3.193 1.757-2.938 1.789-2.465 5.432.893 6.437z" />
  </svg>
);

const AndroidIcon = () => (
  <svg
    className="w-8 h-8 text-green-500"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993S18.0741 15.3414 17.523 15.3414m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-.9993.9993-.9993c.5511 0 .9993.4482.9993.9993S7.0281 15.3414 6.477 15.3414M16.5242 6.0481l1.9504-1.9509c.1231-.1231.1231-.3224 0-.4455-.1231-.1231-.3224-.1231-.4455 0l-2.1346 2.1346c-.9738-.4489-2.0706-.7011-3.2345-.7011s-2.2607.2522-3.2345.7011l-2.1346-2.1346c-.1231-.1231-.3224-.1231-.4455 0-.1231.1231-.1231.3224 0 .4455l1.9504 1.9509C6.1114 7.3861 4.72 9.5075 4.72 11.9995h14.56c0-2.492-1.3914-4.6135-3.7558-5.9514M7.7203 9.9091H6.4795V8.6683h1.2409zm9.8401 0h-1.2409V8.6683h1.2409z" />
  </svg>
);

export default UserPlatform;
