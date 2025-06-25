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
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { useGetIdInfo } from "@/hooks/user/UseGetIdInfo";
import { CiMoneyBill } from "react-icons/ci";

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (delay) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut", delay },
  }),
};

const CredentialCard = ({
  icon: Icon,
  label,
  value,
  badgeColor = "",
  delay,
  link,
}) => (
  <motion.div
    className="flex flex-col items-center p-4 bg-secondary-800/20 rounded-2xl duration-300"
    variants={cardVariants}
    custom={delay}
    initial="hidden"
    animate="visible"
  >
    <div className="p-2 bg-secondary-900/20 rounded-full ">
      <Icon className="w-6 h-6 text-gray-200" />
    </div>
    <span className="text-xs font-medium text-gray-200 text-center">
      {label}
    </span>
    <Link to={link || "#"}>
      <motion.div
        className="mt-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <span
          className={`text-sm font-semibold px-3 py-1 rounded-full ${badgeColor} bg-opacity-80`}
        >
          {value}
        </span>
      </motion.div>
    </Link>
  </motion.div>
);

const UserDashboardAccount = () => {
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const siteConfig = useSelector((store) => store.user.siteConfig);
  const [currentAccount, setCurrentAccount] = useState(() => {
    if (loggedUser?.accounts?.length > 0) {
      return loggedUser.accounts[0];
    }
    return { accountNumber: "000", leverage: "00" };
  });
  const { info, loading } = useGetIdInfo(currentAccount.accountNumber);

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
      className="bg-secondary-800/20 p-6 rounded-3xl shadow-lg w-full max-w-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="flex items-center justify-between bg-secondary-800/20 p-4 rounded-xl mb-6"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-gray-200">Server:</span>
          <span className="bg-secondary-500/10 text-sm text-gray-200 py-1 rounded-full">
            {siteConfig?.serverName}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {Array.isArray(loggedUser?.accounts) &&
            loggedUser.accounts.length > 0 && (
              <select
                onChange={handleAccountChange}
                id="accountNumber"
                name="accountNumber"
                className="bg-secondary-800/20 text-gray-200 border border-secondary-700/30 py-2 px-3 rounded-lg focus:ring-2 focus:ring-secondary-500 outline-none text-sm transition-all duration-300"
              >
                <option
                  disabled
                  className="bg-secondary-800 text-gray-400"
                  value=""
                >
                  Select Account
                </option>
                {loggedUser.accounts?.map((account, index) => (
                  <option
                    key={index}
                    className="bg-secondary-800 text-gray-200"
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
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
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
        <CredentialCard
          icon={User}
          label="Trading Account"
          value={currentAccount.accountNumber}
          badgeColor="bg-blue-100 text-blue-800"
          delay={0.2}
        />
        <CredentialCard
          icon={MdOutlineAccountBalanceWallet}
          label="Balance"
          value={`$${info?.Balance || 0}`}
          badgeColor="bg-sky-100 text-sky-800"
          delay={0.3}
        />
        <CredentialCard
          icon={CiMoneyBill}
          label="Equity"
          value={`$${info?.Equity || 0}`}
          badgeColor="bg-sky-100 text-sky-800"
          delay={0.4}
        />
        <CredentialCard
          icon={CheckCircle}
          label="Leverage"
          value={currentAccount.leverage}
          badgeColor="bg-indigo-100 text-indigo-800"
          delay={0.5}
        />
        <CredentialCard
          icon={PanelTopInactiveIcon}
          label="Account Type"
          value={currentAccount.accountType || "N/A"}
          badgeColor="bg-orange-100 text-orange-800"
          delay={0.6}
        />
        <CredentialCard
          icon={Info}
          label="KYC Status"
          value={loggedUser?.kycVerified ? "Active" : "Inactive"}
          badgeColor={
            loggedUser?.kycVerified
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-700"
          }
          delay={0.7}
        />
      </motion.div>
    </motion.div>
  );
};

export default UserDashboardAccount;
