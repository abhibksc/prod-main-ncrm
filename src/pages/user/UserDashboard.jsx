import UserDashboardAccount from "@/components/user/dashboard/UserDashboardAccount";
import UserDashboardAccountStats from "@/components/user/dashboard/UserDashboardAccountStats";
import UserDashboardBanner from "@/components/user/dashboard/UserDashboardBanner";
import UserDashboardCountdown from "@/components/user/dashboard/UserDashboardCountdown";
import UserLineChart from "@/components/user/UserLineChart";
import UseUserHook from "@/hooks/user/UseUserHook";
import {
  Activity,
  Scale,
  Target,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function UserDashboard() {
  const abailableBalance = useSelector((store) => store.user.availableBalance);
  const depositBalance = useSelector((store) => store.user.depositBalace);
  const profitNloss = useSelector((store) => store.user.profitNloss);
  const currentAccount = useSelector((store) => store.user.currentAccount);
  const { GetCloseTradeAPI, GetUserInfoAPI } = UseUserHook();

  // Use effect ----

  useEffect(() => {
    GetCloseTradeAPI();
    GetUserInfoAPI();
  }, []);

  const isPoitive = profitNloss > 0 ? true : false;

  console.log("isPositive", isPoitive);

  // console.log(abailableBalance, depositBalance);
  return (
    <div className="pb-10">
      <div className="grid grid-cols-1">
        <div className="flex flex-wrap justify-between items-stretch bg-secondary-800 shadow-md rounded-lg p-4 gap-4">
          <div
            className="flex items-center space-x-3 p-3 border-l-4 border-orange-500 bg-secondary-800 rounded-r-lg flex-1 min-w-[200px]"
            style={{
              // backgroundImage:
              //   'url("https://png.pngtree.com/thumb_back/fw800/background/20231029/pngtree-white-textured-background-with-abstract-polygon-shapes-image_13716469.png")',
              backgroundImage:
                'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)),url("https://static.vecteezy.com/system/resources/thumbnails/021/915/647/small/gray-color-luxury-square-seamless-pattern-vector.jpg")',
              backgroundBlendMode: "overlay",
              backgroundSize: "cover",
            }}
          >
            <Scale className="w-6 h-6" />
            <div className="">
              <p className="text-xs">Deposit Balance</p>
              <p className="font-bold">{depositBalance} $USD</p>
            </div>
          </div>

          <div
            className="flex items-center space-x-3 p-3 border-l-4 border-blue-500 bg-secondary-800 rounded-r-lg flex-1 min-w-[200px]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)),url("https://static.vecteezy.com/system/resources/thumbnails/021/915/647/small/gray-color-luxury-square-seamless-pattern-vector.jpg")',
              backgroundBlendMode: "overlay",
              backgroundSize: "cover",
            }}
          >
            <Activity className="w-6 h-6" />
            <div>
              <p className="text-xs">Available Balance</p>
              <p className="font-bold">{abailableBalance} $USD</p>
            </div>
          </div>

          <div
            className="flex items-center space-x-3 p-3 border-l-4 border-yellow-400 bg-secondary-800 rounded-r-lg flex-1 min-w-[200px]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)), url("https://static.vecteezy.com/system/resources/thumbnails/021/915/647/small/gray-color-luxury-square-seamless-pattern-vector.jpg")',
              backgroundBlendMode: "overlay",
              backgroundSize: "cover",
            }}
          >
            {isPoitive ? (
              <TrendingUp className="w-6 h-6 text-green-500" />
            ) : (
              <TrendingDown className="w-6 h-6 text-red-500" />
            )}
            <div>
              <p className="text-xs">Profit/Loss</p>
              <p
                className={`font-bold ${
                  isPoitive ? " text-green-500" : " text-red-500"
                }`}
              >
                {profitNloss} USD
              </p>
            </div>
          </div>

          <div
            className="flex items-center space-x-3 p-3 border-l-4 border-purple-500 bg-secondary-800 bg-secondary-700rounded-r-lg flex-1 min-w-[200px]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.4)),url("https://static.vecteezy.com/system/resources/thumbnails/021/915/647/small/gray-color-luxury-square-seamless-pattern-vector.jpg")',
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
      <div className="grid md:grid-cols-2 grid-cols-1 justify-between my-10">
        <div className="">
          <UserLineChart />
        </div>
        <div className=" md:ml-20">
          <UserDashboardAccount currentAccount={currentAccount} />
        </div>
      </div>

      <div className="grid md:grid-cols-2 grid-cols-1 justify-between my-10">
        <div>
          <UserDashboardAccountStats></UserDashboardAccountStats>
        </div>
        <div className=" flex flex-col gap-10 mt-10">
          <div>
            <UserDashboardBanner></UserDashboardBanner>
          </div>
          <div>
            <UserDashboardCountdown></UserDashboardCountdown>
          </div>
        </div>
      </div>
    </div>
  );
}
