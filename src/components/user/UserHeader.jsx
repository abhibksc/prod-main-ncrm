import React, { useState, useRef, useEffect } from "react";
import {
  User,
  LogOut,
  Settings,
  UserCircle,
  CheckCircle,
  ListEndIcon,
  Menu,
  KeyRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { handleToggleSidebar } from "@/redux/user/userSlice";
import UserSidebar from "./UserSidebar";
import Hamburger from "../hamburgar/Hamburgar";

const UserDropdown = ({ isOpen, onClose }) => {
  const dropdownRef = useRef(null);

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

  return (
    <div
      ref={dropdownRef}
      className={`absolute right-0 top-10 mt-2 w-48 bg-secondary-800 rounded-md shadow-lg py-1 transition-all duration-300 ease-in-out ${
        isOpen
          ? "opacity-100 translate-y-0"
          : "opacity-0 -translate-y-2 pointer-events-none"
      }`}
    >
      <a
        href="#"
        className="block px-4 py-2 text-sm text-white hover:bg-secondary-700"
      >
        <Link to={"/user/profile"} className="flex items-center">
          <UserCircle className="w-4 h-4 mr-2" />
          Profile
        </Link>
      </a>
      <a
        href="#"
        className="block px-4 py-2 text-sm text-white hover:bg-secondary-700"
      >
        <Link to={"/user/change-password"} className="flex items-center">
          <KeyRound className="w-4 h-4 mr-2" />
          Change Password
        </Link>
      </a>
      <a
        href="#"
        className="block px-4 py-2 text-sm text-white hover:bg-secondary-700"
      >
        <Link to={"/user/login"} className="flex items-center">
          <LogOut className="w-4 h-4 mr-2" />
          Sign out
        </Link>
      </a>
    </div>
  );
};
UserSidebar;
const UserHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isSidebarOpen = useSelector((store) => store.user.isSidebarOpen);
  const dispatch = useDispatch();
  console.log("isOpenSidebar", isSidebarOpen);

  const sidebarHandler = () => {
    dispatch(handleToggleSidebar(!isSidebarOpen));
  };

  return (
    <nav className="bg-secondary-900 p-4 w-full h-16">
      <div className="container mx-auto flex justify-between items-center">
        <div className=" -ml-14 flex gap-5">
          <h1 className="text-3xl text-center font-extrabold ">Forex-ZX</h1>
          <button className=" md:hidden" onClick={sidebarHandler}>
            <Menu></Menu>
            {/* <Hamburger></Hamburger>{" "} */}
          </button>
        </div>
        <div className="relative flex items-center">
          <span className="mr-2 text-green-500 flex items-center">
            <CheckCircle className="w-4 h-4 mr-1" />
            <span className="text-xs text-green-500 font-semibold">
              Verified
            </span>
          </span>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-secondary-700 hover:bg-secondary-600 focus:outline-none transition-colors duration-300"
          >
            <User className="w-6 h-6 text-white" />
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
