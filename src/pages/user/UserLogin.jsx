import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setLoggedUser } from "../../redux/user/userSlice";
import { Mail, Lock, LogIn, Loader2, ArrowLeft } from "lucide-react";
import ModernHeading from "@/lib/ModernHeading";
import { backendApi } from "@/utils/apiClients";
import useBlockInCountries from "@/hooks/UseBlockInCountries";
const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loginData, setLoginData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const siteConfig = useSelector((state) => state.user.siteConfig); // Get from Redux
  const blockUi = useBlockInCountries();
  if (blockUi) return blockUi;

  const currentDateTime = new Date();
  const formattedDateTime =
    currentDateTime.toLocaleDateString("en-GB") +
    ", " +
    currentDateTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // 12-hour format with AM/PM
    });
  // dev watermark ---
  const metaTag = document.createElement("meta");
  metaTag.name = "Developer";
  metaTag.content = "Developed by mypixelcode@gmail.com 🎩✨";
  document.head.appendChild(metaTag);

  // login handler ----------------

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await backendApi.post(`/login`, { email, password });
      // setLoginData(res.data);
      if (!res.data.status) {
        toast.error(res.data.message);
        setIsLoading(false);
      } else {
        setTimeout(() => {
          toast.success(`Welcome 👋🏽 ${res.data.user.firstName}`);
        }, 1700);
        dispatch(setLoggedUser(res.data.user));
        setIsLoading(false);
        navigate("/user/dashboard");

        const customContent2 = `<!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Withdrawal Request Confirmation - Arena Trade</title>
          <style>
            body, html {
              margin: 0;
              padding: 0;
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              background-color: #f4f4f4;
            }
            .container {
              max-width: 600px;
              margin: 0 auto;
              padding: 5px;
              background-color: #ffffff;
            }
            .header {
              background-color: #19422df2;
              color: #ffffff;
              padding: 20px 15px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .header h1 {
              margin: 0;
              font-size: 22px;
              letter-spacing: 1px;
            }
            .content {
              padding: 10px 20px;
            }
            .cta-button {
              display: inline-block;
              padding: 12px 24px;
              background-color: #2d6a4f;
              color: #FFFFFF;
              text-decoration: none;
              border-radius: 5px;
              font-weight: bold;
              margin: 10px 0;
            }
            .footer {
              background-color: #19422df2;
              color: #ffffff;
              text-align: center;
              padding: 5px 10px;
              font-size: 12px;
              border-radius: 0 0 10px 10px;
            }
            .footer-info {
              margin-top: 6px;
            }
            .footer-info a {
              color: #B6D0E2;
              text-decoration: none;
            }
            .withdrawal-details {
              background-color: #f8f8f8;
              border-left: 4px solid #2d6a4f;
              padding: 15px;
              margin: 20px 0;
            }
            .withdrawal-details p {
              margin: 5px 0;
            }
            .highlight {
              font-weight: bold;
              color: #0a2342;
            }
            .risk-warning {
              color: #C70039;
              padding: 5px;
              font-size: 12px;
              line-height: 1.4;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>New Login Detected</h1>
            </div>
            <div class="content">
              <p>Dear ${
                res.data?.user?.firstName + " " + res.data?.user?.lastName
              } ,</p>
             <p>We’re writing to inform you that a new login to your account was detected. Please review the details of this activity below:</p>
              <div class="withdrawal-details">
                      <p>Email: <span class="highlight">${
                        res.data?.user?.email
                      }</span></p>
                      <p>IP: <span class="highlight">${
                        res.data?.newUserLog?.ip
                      }</span></p>
                      <p>OS: <span class="highlight">${
                        res.data?.newUserLog?.os
                      }</span></p>
                      <p>Browser: <span class="highlight">${
                        res.data?.newUserLog?.browser
                      }</span></p>
                        <p>Time stamp: <span class="highlight">${
                          formattedDateTime || ""
                        }</span></p>
                    
                    </div>
              <p>Thank you for choosing us.</p>
              <p>Happy trading!</p>
              <p>Best regards,<br>${
                import.meta.env.VITE_WEBSITE_NAME || "Forex"
              } Team</p>
              <hr>
              <div class="risk-warning">
                <strong>Risk Warning:</strong> Trading CFDs carries high risk and may result in losses beyond your initial investment. Trade only with money you can afford to lose and understand the risks. 
                <br><br>
                Our services are not for U.S. citizens or in jurisdictions where they violate local laws.
              </div>
            </div>
            <div class="footer">
              <div class="footer-info">
                  <p>Website: <a href="https://${
                    import.meta.env.VITE_EMAIL_WEBSITE
                  }"> ${
          import.meta.env.VITE_EMAIL_WEBSITE
        } </a> | E-mail: <a href="mailto:${
          import.meta.env.VITE_EMAIL_EMAIL || ""
        }">${import.meta.env.VITE_EMAIL_EMAIL || ""}</a></p>
                  <p>© 2025 ${
                    import.meta.env.VITE_WEBSITE_NAME || ""
                  }. All Rights Reserved</p>
                </div>
            </div>
          </div>
        </body>
        </html>`;

        await backendApi.post(`/custom-mail`, {
          email: res.data.user.email,
          content: customContent2,
          subject: "Login Alert",
        });
      }
    } catch (error) {
      console.log("error in login", error);
      toast.error(error.response?.data?.message || "Login failed!");
      setIsLoading(false);
    }
  };

  // forgot password---------------

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setIsResetLoading(true);
    try {
      const res = await backendApi.post(`/send-reset-link`, {
        email: resetEmail,
      });
      toast.success(res.data.message);
      setResetEmail("");
      setIsResetLoading(false);
      setShowForgotPassword(false);
      navigate("/user/login");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send reset email!"
      );
      console.log(error);
      setIsResetLoading(false);
    }
  };

  useEffect(() => {}, [loginData, isLoading]);

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
          <AnimatePresence mode="wait">
            {!showForgotPassword ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-8 md:p-12">
                  <motion.div
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <a
                      href="/user/dashboard"
                      className=" flex flex-col justify-center mb-5 items-center mr-4"
                    >
                      <img
                        src={siteConfig?.logo}
                        alt="Forex Logo"
                        className=" object-contain w-auto h-[2rem] md:h-[4rem] sm:h-[3rem]"
                      />
                    </a>
                    <ModernHeading text={"Welcome Back"}></ModernHeading>
                    <p className="text-secondary-500 mt-4 mb-8">
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
                        className="absolute top-3 left-3 text-secondary-500"
                        size={20}
                      />
                      <input
                        type="email"
                        id="email"
                        className="w-full pl-10 pr-4 py-3 bg-secondary-700 bg-opacity-50 border border-secondary-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition"
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
                        className="absolute top-3 left-3 text-secondary-500"
                        size={20}
                      />
                      <input
                        type="password"
                        id="password"
                        className="w-full pl-10 pr-4 py-3 bg-secondary-700 bg-opacity-50 border border-secondary-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </motion.div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => setShowForgotPassword(true)}
                        className="text-sm text-blue-500 font-semibold hover:text-blue-400/80  transition-all"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <motion.button
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      type="submit"
                      className="w-full flex gap-2 items-center group justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-secondary-500 hover:bg-secondary-500-80 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-white transition transform hover:scale-105"
                    >
                      <LogIn className="mr-1" size={20} />
                      <p className="group-hover:animate-pulse transition-all">
                        Sign in
                      </p>
                      {isLoading && <Loader2 className="animate-spin" />}
                    </motion.button>
                  </form>
                </div>
                {/* <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="px-8 py-4 bg-secondary-700/30 bg-opacity-50 border-t border-secondary-600"
                >
                  <p className="text-center text-sm text-gray-400">
                    Don't have an account?{" "}
                    <Link
                      to="/user/signup"
                      className="font-medium text-blue-400 hover:text-blue-400/80 transition"
                    >
                      Sign up
                    </Link>
                  </p>
                </motion.div> */}
              </motion.div>
            ) : (
              <motion.div
                key="forgot"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="p-8 md:p-12"
              >
                <button
                  onClick={() => setShowForgotPassword(false)}
                  className="flex items-center text-blue-400 hover:text-blue-400/80 transition mb-6"
                >
                  <ArrowLeft size={20} className="mr-2" />
                  Back to login
                </button>
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <ModernHeading
                    text={"Forgot Password"}
                    className=""
                  ></ModernHeading>
                  <p className="text-gray-300 mt-4 mb-8">
                    Enter your email address, and we’ll send you a secure link
                    to reset your password.
                  </p>
                </motion.div>
                <form onSubmit={handleForgotPassword} className="space-y-6">
                  <motion.div
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative"
                  >
                    <Mail
                      className="absolute top-4 left-3 text-gray-300/80"
                      size={20}
                    />
                    <input
                      type="email"
                      className="w-full pl-10 pr-4 py-3 bg-secondary-700 bg-opacity-50 border border-secondary-600 rounded-lg text-white placeholder-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:border-transparent transition"
                      placeholder="Email address"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                    />
                  </motion.div>
                  <motion.button
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    type="submit"
                    className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-secondary-500 hover:bg-secondary-500-80 focus:outline-none focus:ring-1 focus:ring-offset-1 focus:ring-white   transition transform hover:scale-105"
                  >
                    Send Password
                    {isResetLoading && (
                      <Loader2 className="ml-2 animate-spin" />
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default UserLogin;
