import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart2,
  Trophy,
  Users,
  CreditCard,
  ArrowUpDown,
  ShieldEllipsis,
  ReceiptPoundSterlingIcon,
  HardDriveDownloadIcon,
  CircleFadingPlus,
  ArrowLeftRight,
  ArrowDownCircleIcon,
  SquareStackIcon,
} from "lucide-react";
import { handleToggleSidebar } from "@/redux/user/userSlice";

const MenuItem = ({ icon: Icon, label, link, onClick }) => (
  <motion.div whileHover={{ scale: 1.05, x: 5 }} whileTap={{ scale: 0.95 }}>
    <NavLink
      to={link}
      className={({ isActive }) =>
        `flex items-center gap-3 p-4 rounded-lg ${
          isActive
            ? "text-secondary-500"
            : "text-white/80 transition-colors duration-300"
        }`
      }
      onClick={onClick}
    >
      <Icon size={28} />
      <span className="mt-1 font-semibold text-xs">{label}</span>
    </NavLink>
  </motion.div>
);

const sidebarVariants = {
  open: {
    width: "168px",
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
    },
  },
  closed: {
    width: "0px",
    opacity: 0,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 30,
      when: "afterChildren",
    },
  },
};

const contentVariants = {
  open: {
    opacity: 1,
    x: 0,
    transition: { delay: 0.2, duration: 0.2 },
  },
  closed: {
    opacity: 0,
    x: -10,
    transition: { duration: 0.2 },
  },
};

const UserSidebar = () => {
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const reduxSidebarState = useSelector((store) => store.user.isSidebarOpen);
  const [isOpen, setIsOpen] = useState(reduxSidebarState);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 640);
  const dispatch = useDispatch();
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const smallScreen = window.innerWidth < 640;
      setIsSmallScreen(smallScreen);
      if (!smallScreen) {
        setIsOpen(true); // Ensure the sidebar is open on larger screens
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (isSmallScreen) {
      setIsOpen(reduxSidebarState);
    } else {
      setIsOpen(true); // Keep sidebar open on larger screens
    }
  }, [reduxSidebarState, isSmallScreen]);

  const closeSidebar = () => {
    if (isSmallScreen) {
      setIsOpen(false);
      dispatch({ type: "SET_SIDEBAR_OPEN", payload: false });
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isOpen &&
        isSmallScreen
      ) {
        closeSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isSmallScreen]);

  const menuItems = [
    { icon: BarChart2, label: "Dashboard", link: "/user/dashboard" },
    { icon: ShieldEllipsis, label: "Accounts", link: "/user/challenges" },
    { icon: ArrowUpDown, label: "Transactions", link: "/user/transaction" },
    { icon: BarChart2, label: "Trades", link: "/user/trade-history" },
    { icon: CircleFadingPlus, label: "Deposit", link: "/user/deposit" },
    { icon: ArrowLeftRight, label: "Transfer", link: "/user/transfer" },
    { icon: ArrowDownCircleIcon, label: "Withdraw", link: "/user/withdraw" },
    { icon: SquareStackIcon, label: "IB Zone", link: "/user/referrals" },
    { icon: HardDriveDownloadIcon, label: "Platform", link: "/user/platform" },
    {
      icon: ReceiptPoundSterlingIcon,
      label: "Economic Calendar",
      link: "/user/economic-calendar",
    },
  ];

  return (
    <>
      {isOpen && isSmallScreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}
      <motion.div
        ref={sidebarRef}
        className={`fixed left-0 h-screen top-0 bg-secondary-900 text-white overflow-hidden z-50`}
        initial={false}
        animate={isOpen ? "open" : "closed"}
        variants={sidebarVariants}
      >
        <motion.div
          className="flex flex-col items-center py-4 pl-3 pr-0 h-full"
          variants={contentVariants}
        >
          <div>
            <a
              href="/user/dashboard"
              className=" items-center mr-4 outline-none border-none"
            >
              <img
                src={import.meta.env.VITE_LOGO_LINK}
                alt="Forex Logo"
                className=" object-contain w-auto h-10 md:h-12 sm:h-8"
              />
            </a>
          </div>
          <div className="flex-grow overflow-y-auto pb-16 pr-3 user-custom-scrollbar w-full">
            {/* Sticky button section */}
            <div className="sticky top-0 w-full bg-secondary-900 pt-0 pb-4 z-10">
              <motion.div
                className="hover:py-2 transition-all"
                whileTap={{ scale: 0.95 }}
              >
                <Link to={"/user/new-challenge"}>
                  <button className="text-sm whitespace-nowrap font-semibold rounded-full px-8 py-2 bg-secondary-500/70 w-full transition-all duration-300 hover:bg-secondary-500/60">
                    Open Account
                  </button>
                </Link>
              </motion.div>
            </div>
            <AnimatePresence>
              {menuItems.map((item) => (
                <motion.div
                  key={item.label}
                  className="w-full"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <MenuItem
                    icon={item.icon}
                    label={item.label}
                    link={item.link}
                    onClick={isSmallScreen ? closeSidebar : null}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </>
  );
};

export default UserSidebar;
