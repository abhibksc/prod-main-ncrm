import { Outlet } from "react-router-dom";
import Sidebar from "./components/admin/SideBar";
import Header from "./components/admin/Header";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <div className="h-screen flex flex-col">
      <Toaster />
      <div className="fixed top-0 left-0 right-0 z-10">
        <Header />
      </div>
      <div className="flex flex-1 pt-16">
        <div className="fixed left-0 mt-4 w-64">
          <Sidebar />
        </div>
        <div className="ml-64 mt-4 flex-1 overflow-auto bg-primary-700/60">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
