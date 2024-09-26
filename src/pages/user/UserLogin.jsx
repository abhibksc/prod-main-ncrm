import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { setLoggedUser } from "../../redux/user/userSlice";
import { Mail, Lock, LogIn, Rss } from "lucide-react";
import Cookies from "js-cookie";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Please wait..");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/login`,
        { email, password }
      );

      if (!res.data.status) {
        toast.error(res.data.message, { id: toastId });
      } else {
        toast.success("Login successful!", { id: toastId });
        // Cookies.set("userInfo", JSON.stringify(res.data.user), {
        //   expires: 7,
        //   secure: true,
        //   sameSite: "Strict",
        // });

        dispatch(setLoggedUser(res.data.user));
        navigate("/user/dashboard");
        console.log("login res", res.data);
      }
    } catch (error) {
      console.log("error in login", error);
      toast.error(error.response?.data?.message || "Login failed!", {
        id: toastId,
      });
    }
  };

  return (
    <div className="min-h-screen bg-secondary-900 flex items-center justify-center p-4 relative overflow-hidden">
      <Toaster />
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-50">
        <div className="absolute inset-0 bg-gradient-to-br from-secondary-800 to-secondary-900" />
        <svg
          className="absolute inset-0 w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <pattern
            id="pattern"
            x="0"
            y="0"
            width="40"
            height="40"
            patternUnits="userSpaceOnUse"
          >
            <rect
              x="0"
              y="0"
              width="4"
              height="4"
              fill="rgba(255,255,255,0.1)"
            />
          </pattern>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#pattern)" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md md:max-w-lg relative z-10"
      >
        <div className="bg-secondary-800 bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-4xl font-bold mb-2 text-white">
                Welcome back
              </h2>
              <p className="text-secondary-300 mb-8">
                Enter your credentials to access your account
              </p>
            </motion.div>
            <form onSubmit={handleLogin} className="space-y-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                <Mail
                  className="absolute top-3 left-3 text-secondary-400"
                  size={20}
                />
                <input
                  type="email"
                  id="email"
                  className="w-full pl-10 pr-4 py-3 bg-secondary-700 bg-opacity-50 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <Lock
                  className="absolute top-3 left-3 text-secondary-400"
                  size={20}
                />
                <input
                  type="password"
                  id="password"
                  className="w-full pl-10 pr-4 py-3 bg-secondary-700 bg-opacity-50 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </motion.div>
              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                type="submit"
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-green-600 hover:bg-green-600/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition transform hover:scale-105"
              >
                <LogIn className="mr-2" size={20} />
                Sign in
              </motion.button>
            </form>
          </div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="px-8 py-4 bg-secondary-700/30 bg-opacity-50 border-t border-secondary-600"
          >
            <p className="text-center text-sm text-secondary-300">
              Don't have an account?{" "}
              <Link
                to="/user/signup"
                className="font-medium text-green-500 hover:text-green-400 transition"
              >
                Sign up
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserLogin;
