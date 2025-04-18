import { KeyRound, Loader2, LogOut, Menu, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import AccountConfiguration from "../admin/AccountConfiguration";
import { useSelector } from "react-redux";
import SadminAdminInfo from "./SadminInfo";
import SadminSiteConfiguration from "@/components/s-admin/SadminSiteConfiguration";
// import SadminAdminInfo from "@/components/admin/s-admin/SadminAdminInfo";

const PasswordScreen = ({ onAuthenticate }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password === import.meta.env.VITE_S_ADMIN_PASSWORD) {
      // Set expiry to 1 hour from now
      const expiryDate = new Date();
      expiryDate.setTime(expiryDate.getTime() + 60 * 60 * 1000); // 60 minutes * 60 seconds * 1000 ms

      // Store auth state with expiry
      const authData = {
        isAuthenticated: true,
        expiry: expiryDate.getTime(),
      };

      sessionStorage.setItem("adminAuth", JSON.stringify(authData));
      onAuthenticate(true);
    } else {
      setError("Invalid password");
      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        {/* Decorative elements */}
        <div className="absolute inset-0 blur-3xl bg-green-800/20 rounded-full transform -rotate-12" />
        <div className="absolute inset-0 blur-3xl bg-green-400/20 rounded-full transform rotate-12" />

        {/* Main card */}
        <div className="relative bg-gray-800/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-gray-700/50">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="p-3 bg-green-600/10 rounded-full mb-4">
              <KeyRound size={32} className="text-green-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-100 text-center">
              Super Admin
            </h1>
            <p className="text-gray-400 mt-2 text-center">
              Enter your credentials to access the dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <div
                className={`absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 transition-opacity duration-300 ${
                  isFocused ? "opacity-100" : "opacity-0"
                }`}
                style={{ padding: "1px" }}
              >
                <div className="w-full h-full bg-gray-800 rounded-lg" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Enter password"
                className="relative w-full p-4 bg-gray-800 rounded-lg text-gray-100 border border-gray-700 focus:outline-none transition-shadow duration-300"
              />
            </div>

            {error && (
              <div className="text-red-400 text-sm text-center bg-red-400/10 p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full p-4 bg-gradient-to-r to-green-700 from-gray-800/40 text-white rounded-lg font-medium relative overflow-hidden group hover:shadow-lg transition-shadow duration-300"
            >
              <span className="absolute inset-0 bg-green-600/20 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
              <span className="relative flex items-center justify-center">
                {isLoading ? (
                  <Loader2 className="animate-spin mr-2" size={20} />
                ) : null}
                {isLoading ? "Authenticating..." : "Access Dashboard"}
              </span>
            </button>
          </form>

          {/* Footer */}
          <p className="text-gray-500 text-sm text-center mt-6">
            Protected Area • Authorized Personnel Only
          </p>
        </div>
      </div>
    </div>
  );
};

const SadminHome = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRoute, setCurrentRoute] = useState("account-configuration");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const siteConfig = useSelector((state) => state.user.siteConfig); // Get from Redux

  useEffect(() => {
    const checkAuth = () => {
      const authData = sessionStorage.getItem("adminAuth");
      if (authData) {
        console.log("attanticated", authData);
        const { isAuthenticated, expiry } = JSON.parse(authData);
        const now = new Date().getTime();

        if (isAuthenticated && now < expiry) {
          setIsAuthenticated(true);
        } else {
          sessionStorage.removeItem("adminAuth");
          setIsAuthenticated(false);
        }
      }
    };

    checkAuth();
    const interval = setInterval(checkAuth, 1000 * 60);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    setIsAuthenticated(false);
  };

  const routes = [
    {
      id: "account-configuration",
      name: "Account Configuration",
      component: () => <AccountConfiguration></AccountConfiguration>,
    },
    {
      id: "site-configuration",
      name: "Site Configuration",
      component: () => <SadminSiteConfiguration></SadminSiteConfiguration>,
    },
    {
      id: "admin-info",
      name: "Admin Info",
      component: () => <SadminAdminInfo></SadminAdminInfo>,
    },
  ];

  const CurrentComponent =
    routes.find((route) => route.id === currentRoute)?.component ||
    (() => null);

  if (!isAuthenticated) {
    return <PasswordScreen onAuthenticate={setIsAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-primary-900 text-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden flex justify-between items-center p-4 bg-primary-800">
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Backdrop */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-20"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-primary-800 border-r border-gray-700/40 z-30 transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <a
            href="#"
            className=" flex mx-auto border-none outline-none items-center my-4 "
          >
            <img
              src={siteConfig?.logo}
              alt="Forex Logo"
              className=" object-contain w-auto h-10 md:h-12 sm:h-10"
            />
          </a>
          <div className="p-6 border-b border-gray-700/50">
            <h1 className="text-xl font-bold">Super Admin Panel</h1>
            <p className="text-sm font-semibold">
              ( {import.meta.env.VITE_WEBSITE_NAME} )
            </p>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-2">
            {routes.map((route) => (
              <button
                key={route.id}
                onClick={() => {
                  setCurrentRoute(route.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full px-4 py-2 rounded-lg transition-colors text-left flex items-center space-x-2 ${
                  currentRoute === route.id
                    ? "bg-primary-600/50 text-purple-500"
                    : "text-gray-200 hover:bg-primary-700/50"
                }`}
              >
                <span>{route.name}</span>
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-gray-400 hover:text-red-400 transition-colors flex items-center space-x-2"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 lg:ml-64 min-h-screen ${
          isSidebarOpen ? "blur-sm lg:blur-none" : ""
        }`}
      >
        <div className=" bg-primary-800/60 p-4">
          <CurrentComponent />
        </div>
      </main>
    </div>
  );
};

export default SadminHome;
