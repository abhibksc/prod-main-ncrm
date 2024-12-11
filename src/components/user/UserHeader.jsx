import { useState, useRef, useEffect } from "react";
import {
  User,
  LogOut,
  UserCircle,
  CheckCircle,
  Menu,
  KeyRound,
  ShieldBan,
  BadgeCheck,
  UserRoundCog,
} from "lucide-react";
import { RiCustomerService2Line } from "react-icons/ri";

import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import UseUserHook from "@/hooks/user/UseUserHook";
import { handleToggleSidebar } from "@/redux/user/userSlice";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";

const UserDropdown = ({ isOpen, onClose }) => {
  const dropdownRef = useRef(null);
  const { getReset } = UseUserHook();
  const navigate = useNavigate();

  const logoutHandler = () => {
    getReset();
    navigate("/user/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const menuItems = [
    {
      to: "/user/profile",
      icon: <UserCircle className="w-4 h-4" />,
      label: "Profile",
    },
    {
      to: "/user/account-details",
      icon: <UserRoundCog className="w-4 h-4" />,
      label: "Account Details",
    },
    {
      to: "/user/change-password",
      icon: <KeyRound className="w-4 h-4" />,
      label: "Change Password",
    },
    {
      to: "/user/customer-support",
      icon: <RiCustomerService2Line className="w-4 h-4" />,
      label: "Customer Support",
    },
  ];

  return (
    <div ref={dropdownRef} className="relative">
      <AnimatePresence>
        {isOpen && (
          <div className="absolute z-50 right-0 top-10 w-48">
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="bg-secondary-800 rounded-xl shadow-lg overflow-hidden"
            >
              <motion.div className="py-1">
                {menuItems.map((item, index) => (
                  <motion.div
                    key={item.to}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.2 }}
                    whileHover={{
                      scale: 1.02,
                      backgroundColor: "rgba(255,255,255,0.1)",
                    }}
                    className="block"
                  >
                    <Link
                      to={item.to}
                      className="flex items-center px-4 py-2 text-sm text-white hover:bg-secondary-700 hover:pl-6 transition-all"
                    >
                      <span className="mr-2">{item.icon}</span>
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.2 }}
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "rgba(255,255,255,0.1)",
                  }}
                  className="block"
                >
                  <Link
                    onClick={logoutHandler}
                    className="flex items-center px-4 py-2 text-sm text-red-500 font-semibold hover:bg-secondary-700 transition-colors duration-150"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Link>
                </motion.div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
const UserHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isSidebarOpen = useSelector((store) => store.user.isSidebarOpen);
  const dispatch = useDispatch();
  const loggedUser = useSelector((store) => store.user.loggedUser);

  // console.log("isOpenSidebar", isSidebarOpen);

  const sidebarHandler = () => {
    dispatch(handleToggleSidebar(!isSidebarOpen));
  };
  return (
    <nav className="bg-secondary-900 p-4 w-full h-16">
      <div className=" px-5  flex justify-between items-center">
        <div className=" flex gap-2">
          <button className=" lg:hidden" onClick={sidebarHandler}>
            <Menu></Menu>
          </button>
          <a
            href="/user/dashboard"
            className=" items-center mr-4 outline-none border-none"
          >
            <img
              src={import.meta.env.VITE_LOGO_LINK}
              alt="Forex Funding Logo"
              className=" object-contain w-auto h-10 md:h-12 sm:h-8"
            />
          </a>
        </div>

        <div
          className={` gap-1 hidden md:flex font-bold rounded-full px-3 py-1 ${
            loggedUser.accounts.length !== 0
              ? " text-green-500 bg-green-500/10"
              : "text-red-500 animate-pulse  bg-red-500/10"
          } `}
        >
          <p>
            {loggedUser.accounts.length !== 0 ? (
              <BadgeCheck></BadgeCheck>
            ) : (
              <ShieldBan></ShieldBan>
            )}
          </p>
          <p>{loggedUser.accounts.length !== 0 ? "Active" : "Inactive"}</p>
        </div>
        <div className="relative flex items-center gap-2">
          <div className=" flex gap-1 items-center">
            <CheckCircle className=" w-4 mt-1 text-secondary-500  " />

            <p className="text-sm text-secondary-500  font-semibold">
              {loggedUser.firstName}
            </p>
          </div>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary-500/10  hover:bg-secondary-500/30 focus:outline-none transition-colors duration-300"
          >
            <User className="w-6 h-6 text-secondary-500" />
          </button>
          <UserDropdown
            isOpen={isDropdownOpen}
            onClose={() => setIsDropdownOpen(false)}
          />
        </div>
      </div>
    </nav>
  );
};

export default UserHeader;
