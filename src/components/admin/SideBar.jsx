import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink } from "react-router-dom";
import {
  ChevronDown,
  ChevronUp,
  Home,
  Settings,
  Info,
  ContactIcon,
  ArrowRightCircle,
  Users,
  LogIn,
  ChevronsRight,
  LogOut,
  CreditCard,
  LucideBadgeDollarSign,
  Banknote,
  ListCollapseIcon,
  Ticket,
  Settings2Icon,
} from "lucide-react";

const Sidebar = () => {
  const [openSections, setOpenSections] = useState(new Set());

  const toggleSection = (section) => {
    setOpenSections((prev) => {
      const newOpenSections = new Set(prev);
      if (newOpenSections.has(section)) {
        newOpenSections.delete(section);
      } else {
        newOpenSections.add(section);
      }
      return newOpenSections;
    });
  };

  const menuItems = [
    { label: "Dashboard", icon: <Home />, route: "/admin/dashboard" },
    {
      label: "Commission Levels",
      icon: <ContactIcon />,
      nested: [
        { label: "Deposit", route: "/admin/deposit" },
        { label: "Withdraw", route: "/admin/withdraw" },
      ],
    },
    // {
    //   label: "Setup challenges",
    //   icon: <ChevronsRight />,
    //   route: "/admin/setup-challenges",
    // },
    {
      label: "Account Configuration",
      icon: <Settings2Icon />,
      route: "/admin/account-configuration",
    },
    {
      label: "Account Challenges",
      icon: <ChevronsRight />,
      route: "/admin/account-challenges",
    },
    // {
    //   label: "Withdrawal conditions",
    //   icon: <ChevronsRight />,
    //   route: "/admin/withdraw-conditions",
    // },
    // {
    //   label: "Trade Accounts",
    //   icon: <ChevronsRight />,
    //   route: "/admin/trade-accounts",
    // },
    {
      label: "Manage Users",
      icon: <Users />,
      nested: [
        {
          label: "Email Verified",
          route: "/admin/manage-users/email-verified",
        },
        {
          label: "Email Unverified",
          route: "/admin/manage-users/email-unverified",
        },
        { label: "KYC Verified", route: "/admin/manage-users/kyc-verified" },
        {
          label: "KYC Unverified",
          route: "/admin/manage-users/kyc-unverified",
        },
        { label: "All Users", route: "/admin/manage-users/all-users" },
      ],
    },

    {
      label: "Deposits",
      icon: <LucideBadgeDollarSign />,
      nested: [
        { label: "Pending Deposits", route: "/admin/deposit/pending" },
        { label: "Approved Deposits", route: "/admin/deposit/approved" },
        { label: "Rejected Deposits", route: "/admin/deposit/rejected" },
        { label: "All Deposits", route: "/admin/deposit/all" },
      ],
    },
    {
      label: "Withdrawals",
      icon: <Banknote />,
      nested: [
        { label: "Pending Withdrawals", route: "/admin/withdrawal/pending" },
        { label: "Approved Withdrawals", route: "/admin/withdrawal/approved" },
        { label: "Rejected Withdrawals", route: "/admin/withdrawal/rejected" },
        { label: "All Withdrawals", route: "/admin/withdrawal/all" },
      ],
    },
    {
      label: "Payment Getways",
      icon: <CreditCard />,
      nested: [
        { label: "Automatic getways", route: "/admin/getway/automatic" },
        { label: "Manual getways", route: "/admin/getway/manual" },
      ],
    },
    {
      label: "Support Ticket",
      icon: <Ticket></Ticket>,
      nested: [
        { label: "Pending Ticket", route: "/admin/ticket/pending" },
        { label: "Closed Ticket", route: "/admin/ticket/close" },
        { label: "Answered Ticket", route: "/admin/ticket/answer" },
        { label: "All Ticket", route: "/admin/ticket/all" },
      ],
    },
    {
      label: "Report",
      icon: <ListCollapseIcon></ListCollapseIcon>,
      nested: [
        { label: "Transition Log", route: "/admin/report/transaction" },
        { label: "Invest Log", route: "/admin/report/invest" },
        { label: "Refral Commision", route: "/admin/report/refral" },
        { label: "Login History", route: "/admin/report/login" },
      ],
    },
    {
      label: "Settings",
      icon: <Settings />,
      nested: [
        { label: "KYC Varification", route: "/admin/kyc-setting" },
        { label: "Profile Update", route: "/admin/profile-setting" },
        { label: "Password Update", route: "/admin/password-setting" },
      ],
    },
    { label: "Logout", icon: <LogOut />, route: "/admin/login" },
  ];

  return (
    <aside className="h-screen pb-20 w-64 pt-3 bg-primary-800 text-white overflow-hidden">
      <motion.div
        className="h-full overflow-y-auto custom-scrollbar"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <ul className="space-y-2 text-sm px-4 py-1">
          {menuItems.map((item, index) => (
            <li key={index} className="relative">
              {item.route ? (
                <NavLink
                  to={item.route}
                  className={({ isActive }) =>
                    `flex items-center w-full p-2 text-left rounded transition-colors duration-200 ${
                      isActive ? "bg-primary-600" : "hover:bg-primary-600"
                    }`
                  }
                >
                  {item.icon}
                  <span className="ml-3 text-sm">{item.label}</span>
                </NavLink>
              ) : (
                <button
                  onClick={() => item.nested && toggleSection(item.label)}
                  className="flex items-center w-full p-2 text-left hover:bg-primary-600 rounded transition-colors duration-200"
                >
                  {item.icon}
                  <span className="ml-3 text-sm">{item.label}</span>
                  {item.nested && (
                    <span className="ml-auto">
                      {openSections.has(item.label) ? (
                        <ChevronUp />
                      ) : (
                        <ChevronDown />
                      )}
                    </span>
                  )}
                </button>
              )}
              <AnimatePresence>
                {item.nested && openSections.has(item.label) && (
                  <motion.ul
                    className="ml-6 mt-1 space-y-1 bg-primary-700 rounded-lg shadow-md overflow-hidden"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {item.nested.map((subItem, subIndex) => (
                      <li key={subIndex}>
                        <NavLink
                          to={subItem.route}
                          className={({ isActive }) =>
                            `flex items-center p-2 text-left text-gray-300 hover:bg-primary-600 rounded-lg transition-colors duration-200 ${
                              isActive ? "bg-primary-600" : ""
                            }`
                          }
                        >
                          <span className="ml-2 text-sm">{subItem.label}</span>
                        </NavLink>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          ))}
        </ul>
      </motion.div>
    </aside>
  );
};

export default Sidebar;
