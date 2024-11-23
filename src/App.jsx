import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./components/admin/SideBar";
import Header from "./components/admin/Header";
import { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

export default function App() {
  const adminUser = useSelector((store) => store.admin.adminUser);
  const adminToggle = useSelector((store) => store.admin.adminToggle);
  const navigate = useNavigate();

  // mobile app ----
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

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

  useEffect(() => {
    if (!adminUser) {
      navigate("/admin/login");
    }
  }, [adminUser, navigate]);

  // Handle app installation on button click
  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Show the install prompt
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === "accepted") {
          console.log("User accepted the install prompt");
        } else {
          console.log("User dismissed the install prompt");
        }
        setDeferredPrompt(null); // Reset the deferred prompt state
        setIsInstallable(false); // Disable the install button
      });
    }
  };

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

          {/* Install Button */}
          {isInstallable && (
            <button
              className="fixed bottom-10 right-10 bg-blue-500 text-white py-2 px-4 rounded-full"
              onClick={handleInstall}
            >
              Install App
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
