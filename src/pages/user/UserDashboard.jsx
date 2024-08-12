import UserDashboardAccount from "@/components/user/dashboard/UserDashboardAccount";
import UserDashboardAccountStats from "@/components/user/dashboard/UserDashboardAccountStats";
import UserDashboardCountdown from "@/components/user/dashboard/UserDashboardCountdown";
import UserLineChart from "@/components/user/UserLineChart";
import { Activity, Scale, Target, TrendingUp } from "lucide-react";
import React from "react";

export default function UserDashboard() {
  return (
    <div className="pb-10">
      <div className="grid grid-cols-1">
        <div className="flex flex-wrap justify-between items-stretch bg-secondary-800 shadow-md rounded-lg p-4 gap-4">
          <div
            className="flex items-center space-x-3 p-3 border-l-4 border-orange-500 bg-secondary-800 rounded-r-lg flex-1 min-w-[200px]"
            style={{
              backgroundImage:
                'url("https://png.pngtree.com/thumb_back/fw800/background/20231029/pngtree-white-textured-background-with-abstract-polygon-shapes-image_13716469.png")',
              backgroundBlendMode: "overlay",
              backgroundSize: "cover",
            }}
          >
            <Scale className="w-6 h-6" />
            <div className="">
              <p className="text-xs">Simulated Balance</p>
              <p className="font-bold">50,000.00 USD</p>
            </div>
          </div>

          <div
            className="flex items-center space-x-3 p-3 border-l-4 border-blue-500 bg-secondary-800 rounded-r-lg flex-1 min-w-[200px]"
            style={{
              backgroundImage:
                'url("https://png.pngtree.com/thumb_back/fw800/background/20231029/pngtree-white-textured-background-with-abstract-polygon-shapes-image_13716469.png")',
              backgroundBlendMode: "overlay",
              backgroundSize: "cover",
            }}
          >
            <Activity className="w-6 h-6" />
            <div>
              <p className="text-xs">Current Balance</p>
              <p className="font-bold">57,225.00 USD</p>
            </div>
          </div>

          <div
            className="flex items-center space-x-3 p-3 border-l-4 border-green-500 bg-secondary-800 rounded-r-lg flex-1 min-w-[200px]"
            style={{
              backgroundImage:
                'url("https://png.pngtree.com/thumb_back/fw800/background/20231029/pngtree-white-textured-background-with-abstract-polygon-shapes-image_13716469.png")',
              backgroundBlendMode: "overlay",
              backgroundSize: "cover",
            }}
          >
            <TrendingUp className="w-6 h-6 text-green-500" />
            <div>
              <p className="text-xs">Profit/Loss</p>
              <p className="font-bold text-green-300">7,225.00 USD</p>
            </div>
          </div>

          <div
            className="flex items-center space-x-3 p-3 border-l-4 border-purple-500 bg-secondary-800 bg-secondary-700rounded-r-lg flex-1 min-w-[200px]"
            style={{
              backgroundImage:
                'url("https://png.pngtree.com/thumb_back/fw800/background/20231029/pngtree-white-textured-background-with-abstract-polygon-shapes-image_13716469.png")',
              backgroundBlendMode: "overlay",
              backgroundSize: "cover",
            }}
          >
            <Target className="w-6 h-6" />
            <div>
              <p className="text-xs">Target</p>
              <p className="font-bold">6,000.00 USD</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1  justify-between gap-20 my-10">
        <div>
          <UserLineChart></UserLineChart>
        </div>
        <div>
          <UserDashboardAccount></UserDashboardAccount>
        </div>
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 justify-between my-10">
        <div>
          <UserDashboardAccountStats></UserDashboardAccountStats>
        </div>
        <div className="mt-20">
          <UserDashboardCountdown></UserDashboardCountdown>
        </div>
      </div>
    </div>
  );
}
