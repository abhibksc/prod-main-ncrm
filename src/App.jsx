import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./components/admin/SideBar";
import Header from "./components/admin/Header";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

export default function App() {
  const adminUser = useSelector((store) => store.admin.adminUser);
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
    <div className="h-screen flex flex-col">
      <Toaster />
      <div className="fixed top-0 left-0 right-0 z-10">
        <Header />
      </div>
      <div className="flex flex-1 pt-14">
        <div className="fixed left-0 w-64">
          <Sidebar />
        </div>
        <div className="ml-64 flex-1 overflow-auto bg-primary-700/60">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
