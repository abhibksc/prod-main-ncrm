import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  ChartNoAxesGantt,
  KeyRound,
  LogOut,
  Search,
  Settings,
  User,
  UserCheck,
} from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { Link } from "react-router-dom";

const Header = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] =
    useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const userDropdownRef = useRef(null);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const toggleNotificationDropdown = () =>
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
  const toggleUserDropdown = () => setIsUserDropdownOpen(!isUserDropdownOpen);

  // Animation control
  const controls = useAnimation();

  // Effect to control animation
  useEffect(() => {
    if (isUserDropdownOpen) {
      controls.start({ opacity: 1, y: 0 });
    } else {
      controls.start({ opacity: 0, y: -20 });
    }
  }, [isUserDropdownOpen, controls]);

  // Effect to close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        userDropdownRef.current &&
        !userDropdownRef.current.contains(event.target)
      ) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <header className="antialiased w-full border-neutral-700 border-b-[0.1px]">
      <nav className="border-gray-200 px-4 lg:px-6 py-2.5 bg-primary-800">
        <div className="flex flex-wrap justify-between items-center">
          <div className="flex justify-start items-center">
            <button
              id="toggleSidebar"
              aria-expanded={isSidebarOpen}
              aria-controls="sidebar"
              onClick={toggleSidebar}
              className="md:hidden p-2 mr-3 text-gray-600 rounded cursor-pointer lg:inline hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700"
            >
              <ChartNoAxesGantt className="md:hidden"></ChartNoAxesGantt>
            </button>

            <a href="#" className="flex mr-4">
              <h2 className="text-primary-400 text-3xl font-extrabold">
                Forex-ZX
              </h2>
            </a>
            <form
              action="#"
              method="GET"
              className="hidden ml-20 lg:block lg:pl-2"
            >
              <label htmlFor="topbar-search" className="sr-only">
                Search here...
              </label>
              <div className="relative mt-1 lg:w-96">
                <div className="flex text-neutral-200 absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
                  <Search className=""></Search>
                </div>
                <input
                  type="text"
                  name="email"
                  id="topbar-search"
                  className="border px-3 bg-primary-700 text-white outline-none border-white/10 sm:text-sm rounded-lg block w-full pl-9 p-2.5 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Search here"
                />
              </div>
            </form>
          </div>
          <div className="flex items-center lg:order-2">
            <button
              id="toggleSidebarMobileSearch"
              type="button"
              className="p-2 text-gray-500 rounded-lg lg:hidden hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
            >
              <span className="sr-only">Search</span>
              <Search></Search>
            </button>
            <button
              type="button"
              onClick={toggleNotificationDropdown}
              className="p-2 mr-1 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            >
              <span className="sr-only">View notifications</span>
              <Bell></Bell>
            </button>
            {/* Notification dropdown */}
            {isNotificationDropdownOpen && (
              <div
                className="absolute top-full right-0 z-50 my-4 w-80 max-w-sm text-base list-none bg-white rounded divide-y divide-gray-100 shadow-lg dark:divide-gray-600 dark:bg-gray-700"
                id="notification-dropdown"
              >
                {/* Notification dropdown content */}
              </div>
            )}

            <button
              type="button"
              onClick={toggleUserDropdown}
              className="flex relative mx-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
              id="user-menu-button"
              aria-expanded={isUserDropdownOpen}
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="w-8 h-8 rounded-full"
                src="https://www.svgrepo.com/show/382097/female-avatar-girl-face-woman-user-9.svg"
                alt="user photo"
              />
            </button>
            {/* User dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={controls}
              transition={{ duration: 0.3 }}
              className="absolute font-semibold mx-auto top-12 py-2 right-10 text-white/70 flex flex-col bg-primary-700 rounded h-42 w-36 text-sm"
              id="dropdown"
              ref={userDropdownRef}
            >
              {isUserDropdownOpen && (
                <>
                  <Link
                    to={"/admin/profile-setting"}
                    className="flex hover:bg-primary-500 p-2  rounded gap-2"
                  >
                    <User></User>
                    <p>Profile</p>
                  </Link>
                  <Link
                    to={`/admin/password-setting`}
                    className="flex hover:bg-primary-500 p-2  rounded  gap-2"
                  >
                    <KeyRound></KeyRound>
                    <p>Password</p>
                  </Link>
                  <Link
                    to={`/admin/kyc-setting`}
                    className=" hover:bg-primary-500 p-2  rounded flex gap-2"
                  >
                    <UserCheck></UserCheck>
                    <p className=" whitespace-nowrap">KYC varification</p>
                  </Link>
                  <Link
                    to={"/admin/login"}
                    className="text-red-600 hover:bg-primary-500 p-2  rounded flex gap-2"
                  >
                    <LogOut></LogOut>
                    <p>Logout</p>
                  </Link>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
