import React from "react";
import { Outlet } from "react-router-dom";
import UserSidebar from "./components/user/UserSidebar";
import UserHeader from "./components/user/UserHeader";

export default function UserOutlet() {
  return (
    <div className="text-white h-screen overflow-hidden">
      <UserHeader className="fixed top-0 w-full z-10" />
      <div className="flex">
        <UserSidebar className="fixed top-15 left-0 h-full z-10" />
        <div className="flex-1 user-custom-scrollbar overflow-y-auto p-5 bg-secondary-800/50 h-screen">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
