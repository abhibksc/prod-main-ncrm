import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import UserHeader from "./components/user/UserHeader";
import { Toaster } from "react-hot-toast";
import UserSidebar2 from "./components/user/UserSidebar";
import { useSelector } from "react-redux";

import UserSidebar from "./components/user/UserSidebar";
export default function UserOutlet() {
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const navigate = useNavigate();
  const verifyUser = () => {
    // console.log("beforeee use effect ____________________", loggedUser);
    if (!loggedUser || !loggedUser.emailVerified) {
      // console.log("Log out ____________________");
      navigate("/user/login");
    }
  };

  useEffect(() => {
    setTimeout(() => {
      verifyUser();
    }, 2000);
  }, [navigate, loggedUser]);

  if (!loggedUser) {
    return null;
  }

  return (
    <div className="text-white h-screen overflow-hidden">
      <Toaster />
      <UserHeader className="fixed top-0 w-full z-10" />
      <div className="flex">
        <UserSidebar className="fixed top-15 left-0 h-full z-10" />
        <div className="flex-1 user-custom-scrollbar pb-20 overflow-y-auto p-5 bg-secondary-800/50 h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
