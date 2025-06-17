import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { backendApi } from "@/utils/apiClients";
import { RiUserSharedFill } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { setAdminUser } from "@/redux/adminSlice";
import md5 from "md5";

const SadminAdminInfo = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCredentials, setShowCredentials] = useState(false);
  const dispatch = useDispatch();

  const fetchDetails = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await backendApi.get(`/admin/user`);
      setAdmin(data.data.data);
    } catch (error) {
      console.error("Error fetching admin details:", error);
      setError("Error: Could not fetch admin details");
      toast.error("Failed to fetch");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await backendApi.post(`/admin/create-n-update`, { email, password });
      fetchDetails();
      setEmail("");
      setPassword("");
      toast.success("Updated Successfully");
    } catch (error) {
      setError("Error: Could not create/update admin");
      toast.error("Failed to update");
    }
    setLoading(false);
  };

  const handleShowCredentials = () => {
    setShowCredentials(!showCredentials);
    setTimeout(() => {
      setShowCredentials(false);
    }, 30000); // Hide credentials after 30 seconds
  };
  // super admin handler -----

  const adminLoginHandler = () => {
    if (!admin) {
      toast.error("Admin not fetched yet!! please try again ");
      return;
    }
    const currentPasswordHash = md5(admin.password);
    localStorage.setItem("admin_password_ref", currentPasswordHash);
    dispatch(setAdminUser(admin));
    window.open("/admin/dashboard", "_blank");
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  return (
    <div className="min-h-screen bg-primary-800 p-6 flex items-center justify-center">
      <Toaster />
      <div className="w-full max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side - Admin Form */}
          <div className="bg-primary-700/60 p-8 rounded-xl shadow-xl w-full">
            <h2 className="text-3xl font-bold text-center text-gray-100 mb-6">
              Admin Management
            </h2>
            <p className="text-center text-sm text-gray-400 mb-6">
              Manage your admin credentials efficiently and securely. Please
              ensure your credentials are kept safe.
            </p>
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <div className="flex flex-col">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-gray-100 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="p-4 bg-primary-800/60 text-white rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="flex flex-col">
                <label
                  htmlFor="password"
                  className="text-sm font-semibold text-gray-100 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-4 bg-primary-800/60 text-white rounded-lg border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Enter your password"
                  required
                />
              </div>

              {error && <p className="text-red-500 text-center">{error}</p>}

              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-600/80 transition duration-300"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Admin Credentials"}
              </button>
            </form>
          </div>

          {/* Right Side - Credentials Display */}
          <div className="bg-primary-700/60 p-8 rounded-xl shadow-xl w-full max-w-lg mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-100 mb-6">
              Admin Credentials
            </h2>

            {admin ? (
              <div className="space-y-4">
                <button
                  onClick={handleShowCredentials}
                  className="w-full bg-gray-700/40 text-white hover:text-primary-300 py-3 rounded-lg hover:bg-gray-700/30 transition duration-300"
                >
                  {showCredentials
                    ? "Hide Credentials"
                    : "Show Admin Credentials"}
                </button>

                {showCredentials && (
                  <div className="p-6 rounded-lg ">
                    <h3 className="text-xl font-semibold text-gray-200 mb-3 flex items-center gap-2">
                      <span>🔐 Admin Details</span>
                    </h3>
                    <p className="text-gray-300">
                      <span className="font-semibold text-gray-100">
                        📧 Email:
                      </span>{" "}
                      {admin.email}
                    </p>
                    <p className="text-gray-300 mt-2">
                      <span className="font-semibold text-gray-100">
                        🔑 Password:
                      </span>{" "}
                      {admin.password}
                    </p>
                    <p className="text-xs text-gray-400 mt-3">
                      🔒 Auto-hides in 30s.
                    </p>
                  </div>
                )}
                <button
                  onClick={adminLoginHandler}
                  className="w-full flex items-center justify-center bg-gray-700/40 text-green-400 font-semibold hover:text-green-500 py-3 rounded-lg hover:bg-gray-700/30 transition duration-300"
                >
                  <RiUserSharedFill size={25} />
                  <p className=" ">Login as Admin</p>
                </button>
              </div>
            ) : (
              <p className="text-gray-400 text-center">No credentials found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SadminAdminInfo;
