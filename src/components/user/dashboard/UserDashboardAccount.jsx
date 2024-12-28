import { motion } from "framer-motion";
import {
  User,
  Key,
  Shield,
  CheckCircle,
  Info,
  PanelTopInactiveIcon,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (delay) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay },
  }),
};

const CredentialItem = ({
  icon: Icon,
  label,
  value,
  badgeColor = "",
  delay,
  link,
}) => (
  <motion.div
    className="flex items-center justify-between py-2"
    variants={itemVariants}
    custom={delay}
    initial="hidden"
    animate="visible"
  >
    <div className="flex items-center space-x-3">
      <Icon className="w-5 h-5 text-gray-300" />
      <span className="text-sm font-medium text-gray-200">{label}</span>
    </div>
    <Link to={link || "#"}>
      <motion.div
        className="flex items-center"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.1 }}
      >
        <span
          className={`text-sm font-medium px-3 py-1 rounded-full ${badgeColor} bg-opacity-80`}
        >
          {value}
        </span>
      </motion.div>
    </Link>
  </motion.div>
);

const UserDashboardAccount = () => {
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const [currentAccount, setCurrentAccount] = useState(
    loggedUser.accounts[0] || { accountNumber: "000", leverage: "N/A" }
  );

  const handleAccountChange = (e) => {
    const selectedAccount = loggedUser.accounts.find(
      (account) => account.accountNumber === e.target.value
    );
    setCurrentAccount(
      selectedAccount || { accountNumber: "000", leverage: "N/A" }
    );
  };

  return (
    <motion.div
      className="bg-secondary-800/70 shadow-lg rounded-lg p-6 min-w-5xl w-full md:max-w-lg"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="text-2xl flex justify-between items-center gap-5 mb-2 whitespace-nowrap text-gray-200"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="font-semibold justify-center items-center flex sm:flex-row flex-col text-lg">
          <p>Server :</p>
          <span className="bg-secondary-500/10 text-sm md:text-lg mt-1 rounded-full py-1 px-3">
            {import.meta.env.VITE_SERVER_NAME}
          </span>
        </div>
        <div className="text-sm">
          {loggedUser?.accounts.length > 0 && (
            <select
              onChange={handleAccountChange}
              id="accountNumber"
              name="accountNumber"
              className="w-full border-none py-1 rounded-full bg-secondary-500/10 px-2 outline-none font-semibold border-gray-700 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
            >
              <option
                disabled
                className="bg-secondary-800 text-gray-500"
                value=""
              >
                Select Account
              </option>
              {loggedUser.accounts?.map((account, index) => (
                <option
                  key={index}
                  className="bg-secondary-800 font-semibold text-white"
                  value={account.accountNumber}
                >
                  {account.accountNumber}
                </option>
              ))}
            </select>
          )}
        </div>
      </motion.div>

      <motion.div
        className="space-y-1"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        <CredentialItem
          icon={User}
          label="MT5 Account Id"
          value={currentAccount.accountNumber}
          badgeColor="bg-blue-100 text-blue-800"
          delay={0.15}
        />
        <CredentialItem
          icon={CheckCircle}
          label="Leverage"
          value={currentAccount.leverage}
          badgeColor="bg-indigo-100 text-indigo-800"
          delay={0.25}
        />
        <CredentialItem
          icon={Key}
          label="Master Password"
          value={currentAccount.masterPassword || "N/A"}
          badgeColor="bg-yellow-100 text-yellow-800"
          delay={0.35}
          link="/user/master-password"
        />
        <CredentialItem
          icon={Shield}
          label="Investor Password"
          value={currentAccount.investorPassword || "N/A"}
          badgeColor="bg-yellow-100 text-yellow-800"
          delay={0.45}
          link="/user/investor-password"
        />
        <CredentialItem
          icon={PanelTopInactiveIcon}
          label="Account Type"
          value={currentAccount.accountType || "N/A"}
          badgeColor="bg-orange-100 text-orange-800"
          delay={0.55}
        />
        <CredentialItem
          icon={Info}
          label="KYC Status"
          value={loggedUser?.kycVerified ? "Active" : "Inactive"}
          badgeColor={
            loggedUser?.kycVerified
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-700"
          }
          delay={0.65}
        />
      </motion.div>
    </motion.div>
  );
};

export default UserDashboardAccount;
