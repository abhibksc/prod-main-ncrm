import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header";
import Sidebar from "./components/SideBar";

export default function App() {
  return (
    <div className="h-screen flex flex-col">
      <div className="fixed top-0 left-0 right-0 z-10">
        <Header />
      </div>
      <div className="flex flex-1 pt-[header-height]">
        <div className="fixed left-0 mt-[4%] w-[sidebar-width]">
          <Sidebar />
        </div>
        <div className="ml-[15%] mt-[4%] flex-1 overflow-auto bg-primary-700/60">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
