import React from "react";
import {
  User,
  Server,
  Key,
  Shield,
  AlertTriangle,
  Info,
  CheckCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const CredentialItem = ({ icon: Icon, label, value, badgeColor = "" }) => (
  <div className="flex items-center justify-between py-1">
    <div className="flex items-center space-x-2">
      <Icon className="w-5 h-5 " />
      <span className="text-sm ">{label}</span>
    </div>
    <div className="flex items-center space-x-2">
      <span
        className={`text-sm font-medium px-3 py-1 rounded-full ${
          badgeColor ? badgeColor : "bg-gray-200 text-gray-800"
        }`}
      >
        {value}
      </span>
    </div>
  </div>
);

const UserDashboardAccount = ({ currentAccount }) => {
  const userInfo = useSelector((store) => store.user.userInfo);
  const masterPassword = useSelector((store) => store.user.masterPassword);
  const investorPassword = useSelector((store) => store.user.investorPassword);

  console.log("m&i pass", masterPassword, investorPassword);
  return (
    <div className="bg-secondary-800/80 shadow-md rounded-lg p-6 max-w-md">
      <h2 className="text-lg font-semibold mb-2">Account credentials</h2>
      <div className=" flex flex-col gap-2">
        <div>
          <CredentialItem
            icon={User}
            label="MT5 Account Id"
            value={userInfo.MT5Account ? userInfo.MT5Account : "00000"}
            badgeColor="bg-blue-100 text-blue-800"
          />
        </div>
        <div>
          <CredentialItem icon={Server} label="Server Name" value="Xtal-Live" />
        </div>
        <Link to={"/user/master-password"}>
          <CredentialItem
            icon={Key}
            label="Master Password"
            value={masterPassword ? masterPassword : "00000"}
            badgeColor="bg-yellow-100 text-yellow-800"
          />
        </Link>

        <Link className="" to={"/user/investor-password"}>
          <CredentialItem
            className=""
            icon={Shield}
            label="Investor Password"
            value={investorPassword ? investorPassword : "00000"}
            badgeColor="bg-red-100 text-red-800"
          />
        </Link>
        <div>
          <CredentialItem
            icon={AlertTriangle}
            label="Hard Rule"
            value="Breached"
          />
        </div>
        <div>
          <CredentialItem icon={Info} label="Soft Rule" value="Active" />
        </div>
        <div>
          <CredentialItem
            icon={CheckCircle}
            label="Account Status"
            value="Passed"
          />
        </div>
      </div>
    </div>
  );
};

export default UserDashboardAccount;
