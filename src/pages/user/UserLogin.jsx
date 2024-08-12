import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/login`,
        { email, password }
      );
      toast.success("Login successful!");
      // navigate("/user/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed!");
    }
  };

  return (
    <div className="flex min-h-screen bg-secondary-900">
      <ToastContainer />
      <div
        style={{
          backgroundImage:
            "url('https://i.pinimg.com/736x/75/58/f3/7558f32aec01b3d8e452688d6dfd20cc.jpg')",
          backgroundBlendMode: "overlay",
          backgroundSize: "cover",
        }}
        className="w-full bg-blend-overlay md:w-1/2 bg-secondary-900 flex items-center justify-center p-8"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <h1 className="text-3xl font-bold mb-2 text-white">Welcome back!</h1>
          <p className="text-gray-300 mb-8">
            Enter to get unlimited access to data & information.
          </p>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email*
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 block w-full px-3 py-2 bg-secondary-800 border border-secondary-700 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-white"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-300"
              >
                Password*
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 block w-full px-3 py-2 bg-secondary-800 border border-secondary-700 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-white"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Log in
            </button>
          </form>
        </motion.div>
      </div>
      <div className="hidden md:block md:w-1/2 bg-secondary-800">
        <div className="h-full">
          <div className="h-full flex items-center justify-center">
            <motion.div className="w-full h-full bg-secondary-700 rounded-lg shadow-lg overflow-hidden">
              <img
                src="https://clientpanel.getmoretraffic.com.au/images/login_bg_dark.svg"
                alt="Login Background"
                className="h-full w-full object-cover"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
