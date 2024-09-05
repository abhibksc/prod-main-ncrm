import { motion } from "framer-motion";
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

const CredentialItem = ({
  icon: Icon,
  label,
  value,
  badgeColor = "",
  delay,
}) => (
  <motion.div
    className="flex items-center justify-between py-2"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2, delay }}
  >
    <div className="flex items-center space-x-3">
      <Icon className="w-5 h-5 text-gray-300" />
      <span className="text-sm font-medium text-gray-200">{label}</span>
    </div>
    <motion.div
      className="flex items-center"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.1 }}
    >
      <span
        className={`text-sm font-medium px-3 py-1 rounded-full ${badgeColor}`}
      >
        {value}
      </span>
    </motion.div>
  </motion.div>
);

const UserDashboardAccount = () => {
  const userInfo = useSelector((store) => store.user.userInfo);
  const masterPassword = useSelector((store) => store.user.masterPassword);
  const investorPassword = useSelector((store) => store.user.investorPassword);
  // console.log("userInfo-", userInfo);

  return (
    <motion.div
      className="bg-secondary-800/70 shadow-lg rounded-lg p-6 max-w-md"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.h2
        className="text-2xl font-bold mb-4 text-gray-200"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        Account Credentials
      </motion.h2>
      <div className="space-y-1">
        <CredentialItem
          icon={User}
          label="MT5 Account Id"
          value={userInfo.MT5Account || "00000"}
          badgeColor="bg-blue-100 text-blue-800"
          delay={0.15}
        />
        <CredentialItem
          icon={Server}
          label="Server Name"
          badgeColor="bg-pink-100 text-yellow-800"
          value="Xtal-Live"
          delay={0.2}
        />
        <Link to="/user/master-password" className="block">
          <CredentialItem
            icon={Key}
            label="Master Password"
            value={masterPassword || "00000"}
            badgeColor="bg-yellow-100 text-yellow-800"
            delay={0.25}
          />
        </Link>
        <Link to="/user/investor-password" className="block">
          <CredentialItem
            icon={Shield}
            label="Investor Password"
            value={investorPassword || "00000"}
            badgeColor="bg-red-100 text-red-800"
            delay={0.3}
          />
        </Link>
        <CredentialItem
          icon={AlertTriangle}
          label="Hard Rule"
          value="Breached"
          badgeColor="bg-orange-100 text-orange-800"
          delay={0.35}
        />
        <CredentialItem
          icon={Info}
          label="Soft Rule"
          value="Active"
          badgeColor="bg-green-100 text-green-800"
          delay={0.4}
        />
        <CredentialItem
          icon={CheckCircle}
          label="Account Status"
          value="Passed"
          badgeColor="bg-indigo-100 text-indigo-800"
          delay={0.45}
        />
      </div>
    </motion.div>
  );
};

export default UserDashboardAccount;
