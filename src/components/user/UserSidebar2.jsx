import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart2,
  Trophy,
  DollarSign,
  Users,
  CreditCard,
  ArrowUpDown,
  MessageSquare,
  ShieldAlertIcon,
  Settings,
  ReceiptPoundSterlingIcon,
  LucideDownload,
  HardDriveDownloadIcon,
} from "lucide-react";

const MenuItem = ({ icon: Icon, label, link }) => (
  <motion.div whileHover={{ scale: 1.05, x: 5 }} whileTap={{ scale: 0.95 }}>
    <NavLink
      to={link}
      className={({ isActive }) =>
        `flex flex-col items-center justify-center p-4 rounded-lg ${
          isActive
            ? "text-secondary-500"
            : "text-white/80 transition-colors duration-300"
        }`
      }
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

const UserSidebar2 = () => {
  const dispatch = useDispatch();
  const reduxSidebarState = useSelector((store) => store.user.isSidebarOpen);
  const [isOpen, setIsOpen] = useState(reduxSidebarState);
  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024);
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsOpen(reduxSidebarState || isLargeScreen);
  }, [reduxSidebarState, isLargeScreen]);

  const closeSidebar = () => {
    if (!isLargeScreen) {
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
        !isLargeScreen
      ) {
        closeSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isLargeScreen]);

  const menuItems = [
    { icon: BarChart2, label: "Dashboard", link: "/user/dashboard" },
    { icon: Trophy, label: "Challenges", link: "/user/challenges" },
    {
      icon: ArrowUpDown,
      label: "Transaction History",
      link: "/user/transaction",
    },
    { icon: BarChart2, label: "Trade History", link: "/user/trade-history" },
    { icon: CreditCard, label: "Withdraw", link: "/user/withdraw" },
    { icon: Users, label: "Referrals", link: "/user/referrals" },
    // {
    //   icon: MessageSquare,
    //   label: "Support Ticket",
    //   link: "/user/support-ticket",
    // },
    {
      icon: ShieldAlertIcon,
      label: "Rules & definitions",
      link: "/user/rules",
    },
    { icon: HardDriveDownloadIcon, label: "Platform", link: "/user/platform" },
    {
      icon: ReceiptPoundSterlingIcon,
      label: "Economic Calendar",
      link: "/user/economic-calendar",
    },
  ];
  const loggedUser = useSelector((store) => store.user.loggedUser);
  return (
    <>
      {isOpen && !isLargeScreen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}
      <motion.div
        ref={sidebarRef}
        className={`fixed left-0 h-100vh h-screen top-0 bg-secondary-900 text-white overflow-hidden z-50 ${
          isLargeScreen ? "lg:relative lg:top-0 lg:h-screen" : ""
        }`}
        initial={false}
        animate={isOpen || isLargeScreen ? "open" : "closed"}
        variants={sidebarVariants}
      >
        <motion.div
          className="flex flex-col items-center py-4 pl-3 pr-0 h-full"
          variants={contentVariants}
        >
          <div className="flex-grow overflow-y-auto pb-16 pr-3 user-custom-scrollbar w-full">
            {loggedUser.phase === 0 && (
              <motion.div
                className=" hover:py-2 transition-all"
                whileTap={{ scale: 0.95 }}
              >
                <Link to={"/user/new-challenge"}>
                  <button className="mt-2 text-sm whitespace-nowrap mb-4 rounded-full px-8 py-2 bg-secondary-700/90 w-full transition-all duration-300 hover:bg-secondary-600">
                    New challenge
                  </button>
                </Link>
              </motion.div>
            )}
            <AnimatePresence>
              {(isOpen || isLargeScreen) &&
                menuItems.map((item) => (
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

export default UserSidebar2;
