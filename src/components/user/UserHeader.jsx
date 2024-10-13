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
  ShieldBan,
  BadgeCheck,
  UserRoundCog,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  handleToggleSidebar,
  setAvailableBalance,
  setCloseTrades,
  setCurrentAccount,
  setCurrentUser,
  setDepositBalance,
  setInvestorPassword,
  setLoggedUser,
  setMasterPassword,
  setOpenTrades,
  setPaymentMethods,
  setPhase,
  setPlatforms,
  setProfitNloss,
  setSignUpData,
  setUserFormData,
  setUserInfo,
} from "@/redux/user/userSlice";
import UserSidebar from "./UserSidebar";
import Hamburger from "../hamburgar/Hamburgar";

const UserDropdown = ({ isOpen, onClose }) => {
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = () => {
    dispatch(setLoggedUser(""));
    dispatch(setCurrentAccount(""));
    dispatch(setCurrentUser(""));
    dispatch(setDepositBalance(""));
    dispatch(setAvailableBalance(""));
    dispatch(setUserInfo(""));
    dispatch(setLoggedUser(""));
    dispatch(setInvestorPassword(""));
    dispatch(setMasterPassword(""));
    dispatch(setOpenTrades([]));
    dispatch(setCloseTrades([]));
    dispatch(setPlatforms([]));
    dispatch(setPaymentMethods([]));
    dispatch(setUserFormData(""));
    dispatch(setSignUpData(""));
    dispatch(setProfitNloss(""));
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

  return (
    <div
      ref={dropdownRef}
      className={`absolute z-10 right-0 top-10 mt-2 w-48 bg-secondary-800 rounded-md shadow-lg py-1 transition-all duration-300 ease-in-out ${
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
        <Link to={"/user/account-details"} className="flex items-center">
          <UserRoundCog className="w-4 h-4 mr-2" />
          Account Details
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
        <Link
          onClick={logoutHandler}
          className="flex text-red-500 font-semibold items-center"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </Link>
      </a>
    </div>
  );
};
UserSidebar;
const UserHeader = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const isSidebarOpen = useSelector((store) => store.user.isSidebarOpen);
  const userInfo = useSelector((store) => store.user.userInfo);
  const dispatch = useDispatch();
  const loggedUser = useSelector((store) => store.user.loggedUser);

  // console.log("isOpenSidebar", isSidebarOpen);

  const sidebarHandler = () => {
    dispatch(handleToggleSidebar(!isSidebarOpen));
  };

  return (
    <nav className="bg-secondary-900 p-4 w-full h-16">
      <div className=" px-5 mx-auto flex justify-between items-center">
        <div className=" flex gap-2">
          <button className=" md:hidden" onClick={sidebarHandler}>
            <Menu></Menu>
          </button>
          <a href="/user/dashboard" className="flex items-center mr-4">
            <img
              src="/beta-funded.png"
              alt="Forex-ZX Logo"
              className="h-4 w-auto sm:h-4 md:h-6 lg:h-8 xl:h-10 object-contain"
            />
          </a>{" "}
        </div>
        <div
          className={` gap-1 hidden md:flex font-bold rounded-full px-3 py-1 ${
            loggedUser.phase > 0
              ? " text-green-500 bg-green-500/10"
              : "text-red-500 animate-pulse  bg-red-500/10"
          } `}
        >
          <p>
            {loggedUser.phase > 0 ? (
              <BadgeCheck></BadgeCheck>
            ) : (
              <ShieldBan></ShieldBan>
            )}
          </p>
          <p>{loggedUser.phase > 0 ? "Active" : "Inactive"}</p>
        </div>
        <div className="relative flex items-center gap-2">
          <div className=" flex gap-1 items-center">
            <CheckCircle className=" w-4 mt-1 text-green-500  " />

            <p className="text-sm text-green-500  font-semibold">
              {loggedUser.firstName}
            </p>
          </div>
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
