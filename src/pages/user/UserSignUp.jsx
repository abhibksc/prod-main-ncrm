import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  Mail,
  Lock,
  User,
  Globe,
  Phone,
  Check,
  LucideMapPinMinusInside,
} from "lucide-react";

const phoneInputCustomStyles = `
  .react-tel-input .country-list {
    background-color: #1f2937;
    color: #fff;
  }
  .react-tel-input .form-control {
    background-color: #23543F;
    border-color: #23543F;
    color: #fff;
    padding-left: 48px !important;
  }
  .react-tel-input .selected-flag {
    background-color: #23543F;
    border:none
  }
  .react-tel-input .country-list .country:hover {
    background-color: #374151;
  }
`;

const UserSignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const toastId = toast.loading("Creating your account...");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/signup`,
        { name, email, password, country, phone }
      );
      if (res.data.status) {
        toast.success("Account created successfully!", { id: toastId });
        navigate("/user/login");
      } else {
        setError("email");
        toast.error("Signup failed. Please try again.", { id: toastId });
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setError(error.response.data.msg);
      toast.error(error.response.data.msg || "Signup failed", { id: toastId });
    }
  };

  return (
    <div className="min-h-screen bg-secondary-900 flex items-center justify-center p-4 relative overflow-hidden">
      <style>{phoneInputCustomStyles}</style>
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
        className="w-full max-w-4xl relative z-10"
      >
        <div className="bg-secondary-800 bg-opacity-80 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden">
          <div className="p-8 md:p-12">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-4xl font-bold mb-2 text-white">
                Create Your Account
              </h2>
              <p className="text-secondary-300 mb-8">
                Join Forex-ZX and start your trading journey today.
              </p>
            </motion.div>

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-6 text-red-500 text-lg bg-red-500 bg-opacity-10 border border-red-500 rounded-lg p-4"
              >
                <p>{error}</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                <User
                  className="absolute top-3 left-3 text-secondary-400"
                  size={20}
                />
                <input
                  type="text"
                  id="name"
                  className="w-full pl-10 pr-4 py-3 bg-secondary-700 bg-opacity-50 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="First Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                <User
                  className="absolute top-3 left-3 text-secondary-400"
                  size={20}
                />
                <input
                  type="text"
                  id="name"
                  className="w-full pl-10 pr-4 py-3 bg-secondary-700 bg-opacity-50 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Last Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </motion.div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
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
                  className="w-full pl-10 pr-4 py-3 bg-secondary-700 bg-opacity-50 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </motion.div>
              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <Phone
                  className="absolute top-3 left-3 text-secondary-400 z-10"
                  size={20}
                />
                <PhoneInput
                  country={country.toLowerCase()}
                  value={phone}
                  onChange={(phone) => setPhone(phone)}
                  inputProps={{
                    required: true,
                    className:
                      "w-full pl-10 pr-4 py-3 bg-secondary-700  border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition",
                  }}
                  containerClass="react-tel-input"
                />
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="relative"
              >
                <Globe
                  className="absolute top-3 left-3 text-secondary-400"
                  size={20}
                />
                <select
                  id="country"
                  className="w-full pl-10 pr-4 py-3 bg-secondary-700 bg-opacity-50 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  required
                >
                  <option value="">Select a country</option>
                  <option value="IN">India</option>
                  <option value="US">United States</option>
                  {/* Add more countries as needed */}
                </select>
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                <LucideMapPinMinusInside
                  className="absolute top-3 left-3 text-secondary-400"
                  size={20}
                />
                <input
                  type="text"
                  id="name"
                  className="w-full pl-10 pr-4 py-3 bg-secondary-700 bg-opacity-50 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Address"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                <LucideMapPinMinusInside
                  className="absolute top-3 left-3 text-secondary-400"
                  size={20}
                />
                <input
                  type="text"
                  id="name"
                  className="w-full pl-10 pr-4 py-3 bg-secondary-700 bg-opacity-50 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="State"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </motion.div>

              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                <LucideMapPinMinusInside
                  className="absolute top-3 left-3 text-secondary-400"
                  size={20}
                />
                <input
                  type="text"
                  id="name"
                  className="w-full pl-10 pr-4 py-3 bg-secondary-700 bg-opacity-50 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="City"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="relative"
              >
                <LucideMapPinMinusInside
                  className="absolute top-3 left-3 text-secondary-400"
                  size={20}
                />
                <input
                  type="text"
                  id="name"
                  className="w-full pl-10 pr-4 py-3 bg-secondary-700 bg-opacity-50 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Zip code"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </motion.div>
              <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="relative"
              >
                <Lock
                  className="absolute top-3 left-3 text-secondary-400"
                  size={20}
                />
                <input
                  type="password"
                  id="password"
                  className="w-full pl-10 pr-4 py-3 bg-secondary-700 bg-opacity-50 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </motion.div>

              <motion.div
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="relative"
              >
                <Lock
                  className="absolute top-3 left-3 text-secondary-400"
                  size={20}
                />
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full pl-10 pr-4 py-3 bg-secondary-700 bg-opacity-50 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </motion.div>

              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="md:col-span-2"
              >
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="mr-2 form-checkbox text-green-500 rounded"
                    required
                  />
                  <span className="text-sm text-secondary-300">
                    I agree with the{" "}
                    <a
                      href="#"
                      className="text-green-500 hover:text-green-400 transition"
                    >
                      Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a
                      href="#"
                      className="text-green-500 hover:text-green-400 transition"
                    >
                      Terms of Service
                    </a>
                  </span>
                </label>
              </motion.div>

              <motion.button
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7 }}
                type="submit"
                className="md:col-span-2 w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition transform hover:scale-105"
              >
                <Check className="mr-2" size={20} />
                Create Account
              </motion.button>
            </form>
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="px-8 py-4 bg-secondary-700 bg-opacity-50 border-t border-secondary-600"
          >
            <p className="text-center text-sm text-secondary-300">
              Already have an account?{" "}
              <Link
                to="/user/login"
                className="font-medium text-green-500 hover:text-green-400 transition"
              >
                Log in here
              </Link>
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default UserSignUp;
