import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import UserSidebar from "./components/user/UserSidebar";
import UserHeader from "./components/user/UserHeader";
import { Toaster } from "react-hot-toast";
import UserSidebar2 from "./components/user/UserSidebar2";
import { useSelector } from "react-redux";
import Cookies from "js-cookie";

export default function UserOutlet() {
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loggedUser || !loggedUser.emailVerified) {
      navigate("/user/login");
    }
  }, [navigate, loggedUser]);

  // if (!loggedUser) {
  //   return null;
  // }

  return (
    <div className="text-white h-screen overflow-hidden">
      <Toaster
        toastOptions={{
          // Define default options
          style: {
            background: "#1b4332", // Dark background for toast
            color: "#fff", // White text color
          },
          success: {
            style: {
              background: "#1b4332", // Green background for success
              border: "#fff",
            },
          },
          error: {
            style: {
              background: "#1b4332", // Red background for error
            },
          },
        }}
      />
      <UserHeader className="fixed top-0 w-full z-10" />
      <div className="flex">
        {/* <UserSidebar className="fixed top-15 left-0 h-full z-10" /> */}
        <UserSidebar2 className="fixed top-15 left-0 h-full z-10" />
        <div className="flex-1 user-custom-scrollbar overflow-y-auto p-5 bg-secondary-800/50 h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
