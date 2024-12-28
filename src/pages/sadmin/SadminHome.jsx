import React, { useState, useEffect } from "react";

const PasswordScreen = ({ onAuthenticate }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === import.meta.env.VITE_S_ADMIN_PASSWORD) {
      expiryDate.setDate(expiryDate.getDate() + 1); // Set expiry to 24 hours from now

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
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-gray-100 mb-6 text-center">
          Super Admin Access
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 focus:outline-none focus:border-purple-500"
            />
          </div>
          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
};

const SadminHome = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentRoute, setCurrentRoute] = useState("dashboard");

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      const authData = sessionStorage.getItem("adminAuth");
      if (authData) {
        const { isAuthenticated, expiry } = JSON.parse(authData);
        const now = new Date().getTime();

        if (isAuthenticated && now < expiry) {
          setIsAuthenticated(true);
        } else {
          // Clear expired auth
          sessionStorage.removeItem("adminAuth");
          setIsAuthenticated(false);
        }
      }
    };

    checkAuth();
    // Check auth status periodically
    const interval = setInterval(checkAuth, 1000 * 60); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("adminAuth");
    setIsAuthenticated(false);
  };

  const routes = [
    {
      id: "dashboard",
      path: "/dashboard",
      name: "Dashboard",
      component: () => (
        <div className="p-6 bg-gray-800 rounded-lg">
          <h1 className="text-xl font-semibold text-gray-100">Dashboard</h1>
        </div>
      ),
    },
    {
      id: "users",
      path: "/users",
      name: "User Management",
      component: () => (
        <div className="p-6 bg-gray-800 rounded-lg">
          <h1 className="text-xl font-semibold text-gray-100">
            User Management
          </h1>
        </div>
      ),
    },
    {
      id: "settings",
      path: "/settings",
      name: "Settings",
      component: () => (
        <div className="p-6 bg-gray-800 rounded-lg">
          <h1 className="text-xl font-semibold text-gray-100">Settings</h1>
        </div>
      ),
    },
  ];

  const CurrentComponent =
    routes.find((route) => route.id === currentRoute)?.component ||
    (() => null);

  if (!isAuthenticated) {
    return <PasswordScreen onAuthenticate={setIsAuthenticated} />;
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <nav className="flex justify-between items-center p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex space-x-4">
          {routes.map((route) => (
            <button
              key={route.id}
              onClick={() => setCurrentRoute(route.id)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                currentRoute === route.id
                  ? "bg-purple-900/50 text-purple-400"
                  : "text-gray-400 hover:bg-gray-700"
              }`}
            >
              {route.name}
            </button>
          ))}
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-gray-400 hover:text-red-400 transition-colors"
        >
          Logout
        </button>
      </nav>

      <main className="p-6">
        <CurrentComponent />
      </main>
    </div>
  );
};

export default SadminHome;
