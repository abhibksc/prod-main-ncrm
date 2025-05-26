import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./components/admin/SideBar";
import Header from "./components/admin/Header";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import UseAdminHook from "./hooks/admin/UseAdminHook";
import { backendApi } from "./utils/apiClients";
import md5 from "md5";

export default function App() {
  const adminUser = useSelector((store) => store.admin.adminUser);
  const adminToggle = useSelector((store) => store.admin.adminToggle);
  const navigate = useNavigate();

  // mobile app ----
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const { getResetAdmin } = UseAdminHook();

  useEffect(() => {
    // Listen for the 'beforeinstallprompt' event to enable installation
    const promptEvent = (e) => {
      e.preventDefault(); // Prevent the browser's default install prompt
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", promptEvent);

    // Cleanup the event listener
    return () => {
      window.removeEventListener("beforeinstallprompt", promptEvent);
    };
  }, []);
  // logout on update password funcnality ---

  const fetchAdminUser = async () => {
    const res = await backendApi.get(`/admin/user`);
    const currentPasswordHash = md5(res.data.data.password);
    const storedPasswordHash = localStorage.getItem("admin_password_ref");

    if (storedPasswordHash && storedPasswordHash !== currentPasswordHash) {
      getResetAdmin();
      navigate("/admin/login");
    }
  };

  // useEffect for logout ---

  useEffect(() => {
    const interval = setInterval(fetchAdminUser, 20000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!adminUser) {
      navigate("/admin/login");
    }
  }, [navigate]);

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
