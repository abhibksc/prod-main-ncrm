import React from "react";
import { Search } from "lucide-react";

const dummyData = [
  {
    id: 1,
    user: "Awais Sharif",
    username: "@rdDU6k",
    loginAt: "2024-07-10 01:46 AM",
    timeAgo: "3 weeks ago",
    ip: "37.19.201.233",
    location: "Singapore",
    country: "Singapore",
    browser: "Chrome",
    os: "Linux",
  },
  {
    id: 2,
    user: "Awais Sharif",
    username: "@rdDU6k",
    loginAt: "2024-07-08 02:56 PM",
    timeAgo: "3 weeks ago",
    ip: "2400:adc5:12e:3000:5572:84dc:80aa:c811",
    location: "Lahore",
    country: "Pakistan",
    browser: "Chrome",
    os: "Windows 10",
  },
  {
    id: 3,
    user: "Awais Sharif",
    username: "@rdDU6k",
    loginAt: "2024-07-08 02:26 PM",
    timeAgo: "3 weeks ago",
    ip: "2400:adc5:12e:3000:b5ef:52a6:97e2:770f",
    location: "Lahore",
    country: "Pakistan",
    browser: "Chrome",
    os: "Linux",
  },
  {
    id: 4,
    user: "Ashar Sajjad",
    username: "@5RIKZM",
    loginAt: "2024-07-08 12:49 PM",
    timeAgo: "3 weeks ago",
    ip: "119.155.30.207",
    location: "Lahore",
    country: "Pakistan",
    browser: "Chrome",
    os: "Mac OS X",
  },
  {
    id: 5,
    user: "Ashar Sajjad",
    username: "@tjO46pS",
    loginAt: "2024-07-07 12:54 AM",
    timeAgo: "4 weeks ago",
    ip: "182.185.150.117",
    location: "Lahore",
    country: "Pakistan",
    browser: "Handheld Browser",
    os: "iPhone",
  },
  {
    id: 6,
    user: "Ashar Sajjad",
    username: "@5RIKZM",
    loginAt: "2024-07-07 12:41 AM",
    timeAgo: "4 weeks ago",
    ip: "182.185.150.117",
    location: "Lahore",
    country: "Pakistan",
    browser: "Handheld Browser",
    os: "iPhone",
  },
  {
    id: 7,
    user: "Ashar Sajjad",
    username: "@5RIKZM",
    loginAt: "2024-07-07 12:27 AM",
    timeAgo: "4 weeks ago",
    ip: "182.185.150.117",
    location: "Lahore",
    country: "Pakistan",
    browser: "Handheld Browser",
    os: "iPhone",
  },
  {
    id: 8,
    user: "Ashar Sajjad",
    username: "@tjO46pS",
    loginAt: "2024-07-01 05:44 PM",
    timeAgo: "1 month ago",
    ip: "86.98.62.185",
    location: "Dubai",
    country: "United Arab Emirates",
    browser: "Chrome",
    os: "Mac OS X",
  },
];

const LoginReport = () => {
  return (
    <div className="bg-primary-700 text-white px-10 py-5 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">User Login History</h2>
        <div className="flex">
          <input
            type="text"
            placeholder="Enter Username"
            className="border border-gray-300 rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary-600"
          />
          <button className="bg-primary-400 text-white rounded-r-md px-4 py-2 hover:bg-primary-500">
            <Search className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-primary-400 text-white text-left">
              <th className="py-3 px-4">User</th>
              <th className="py-3 px-4">Login at</th>
              <th className="py-3 px-4">IP</th>
              <th className="py-3 px-4">Location</th>
              <th className="py-3 px-4">Browser | OS</th>
            </tr>
          </thead>
          <tbody>
            {dummyData.map((row) => (
              <tr key={row.id} className="border-b">
                <td className="py-3 px-4">
                  <div className="font-medium">{row.user}</div>
                  <div className="text-sm text-blue-400">{row.username}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="">{row.loginAt}</div>
                  <div className="text-sm ">{row.timeAgo}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="  text-purple-300">{row.ip}</div>
                </td>
                <td className="py-3 px-4">
                  <div className=" ">{row.location}</div>
                  <div className="text-sm  text-gray-400">{row.country}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="">{row.browser}</div>
                  <div className="text-sm">{row.os}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LoginReport;
