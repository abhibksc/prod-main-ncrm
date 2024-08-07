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

const UserDashboardAccount = () => {
  return (
    <div className="bg-secondary-800/80 shadow-md rounded-lg p-6 max-w-md">
      <h2 className="text-lg font-semibold mb-4">Account credentials</h2>
      <div className="space-y-3">
        <CredentialItem
          icon={User}
          label="MT5 Account Id"
          value="9784512772435"
          badgeColor="bg-blue-100 text-blue-800"
        />
        <CredentialItem icon={Server} label="Server Name" value="Xtal-Live" />
        <CredentialItem
          icon={Key}
          label="Trading Password"
          value="mZmy2EW@CFT6399"
          badgeColor="bg-yellow-100 text-yellow-800"
        />
        <CredentialItem
          icon={Shield}
          label="Investor Password"
          value="jwH2dYH@CFT2512"
          badgeColor="bg-red-100 text-red-800"
        />
        <CredentialItem
          icon={AlertTriangle}
          label="Hard Rule"
          value="Breached"
        />
        <CredentialItem icon={Info} label="Soft Rule" value="Active" />
        <CredentialItem
          icon={CheckCircle}
          label="Account Status"
          value="Passed"
        />
      </div>
    </div>
  );
};

export default UserDashboardAccount;
