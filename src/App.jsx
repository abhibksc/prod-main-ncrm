import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./components/admin/SideBar";
import Header from "./components/admin/Header";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function App() {
  const adminUser = useSelector((store) => store.admin.adminUser);
  const adminToggle = useSelector((store) => store.admin.adminToggle);
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminUser) {
      navigate("/admin/login");
    }
  }, [adminUser, navigate]);

  if (!adminUser) {
    return null;
  }

  return (
    <div className="text-white h-screen overflow-hidden">
      <Toaster />
      <Header className="fixed top-0 w-full z-10" />
      <div className="flex">
        <Sidebar className="fixed top-15 left-0 h-full z-10" />
        <div
          className={`flex-1 custom-scrollbar pb-20 overflow-y-auto bg-primary-700/60 h-screen ${
            !adminToggle ? "lg:ml-0" : ""
          }`}
        >
          <Outlet />
        </div>
      </div>
    </div>
  );
}
