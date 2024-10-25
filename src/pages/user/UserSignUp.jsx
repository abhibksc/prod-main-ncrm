import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast, Toaster } from "react-hot-toast";
import "react-phone-input-2/lib/style.css";
import { Mail, Lock, User, Globe, Phone, Check, MapPin } from "lucide-react";
import { useDispatch } from "react-redux";
import { getData } from "country-list";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "../../css/phone-input.css";

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
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    state: "",
    city: "",
    address: "",
    zipCode: "",
    country: "",
    password: "",
    confirmPassword: "",
  });
  const { id } = useParams();
  console.log("params id ----", id);

  const countries = getData();
  const dispatch = useDispatch();
  const countriesArray = getData();

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handlePhoneChange = (phone) => {
    setFormData((prevState) => ({
      ...prevState,
      phone,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const toastId = toast.loading("Creating account..");
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/signup/${id}`,
        formData
      );
      if (res.data.status) {
        const sendLinkRes = await axios.post(
          `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/send-link`,
          {
            userId: res.data.user._id,
            email: res.data.user.email,
          }
        );
        toast.success("Varification link sent to your mail", { id: toastId });
        // dispatch(setSignUpData(formData));
        console.log("SignUp user res--", res.data);
        console.log("Send link res--", sendLinkRes.data);
        navigate(`/user/verify/${res.data.user._id}/000`);
      } else {
        setError("Signup failed. Please try again.");
        toast.error("Signup failed. Please try again.", { id: toastId });
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setError(error.response?.data?.msg || "Signup failed");
      toast.error(error.response?.data?.msg || "Signup failed", {
        id: toastId,
      });
    }
  };

  return (
    <div className=" overflow-scroll user-custom-scrollbar h-screen w-full">
      <div className="min-h-screen overflow-scroll user-custom-scrollbar bg-secondary-900 flex items-center justify-center p-4 relative ">
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
                  Join Beta Funded and start your trading journey today.
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

              <form
                onSubmit={handleSubmit}
                className="grid md:grid-cols-2 gap-6"
              >
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
                    name="firstName"
                    className="w-full pl-10 pr-4 py-3 bg-secondary-700 bg-opacity-50 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleChange}
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
                    name="lastName"
                    className="w-full pl-10 pr-4 py-3 bg-secondary-700 bg-opacity-50 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleChange}
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
                    name="email"
                    className="w-full pl-10 pr-4 py-3 bg-secondary-700 bg-opacity-50 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </motion.div>
                <motion.div
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="relative"
                >
                  <PhoneInput
                    placeholder="Enter phone number"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    defaultCountry="IN"
                    international
                    inputClass="w-full pl-10 py-6 pr-4 py-3 bg-secondary-700 bg-opacity-50 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    className="react-tel-input"
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
                    name="country"
                    className="w-full pl-10 pr-4 py-3 bg-secondary-700 bg-opacity-50 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    value={formData.country}
                    onChange={handleChange}
                    required
                  >
                    {countriesArray.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c?.name}
                      </option>
                    ))}
                  </select>
                </motion.div>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="relative"
                >
                  <MapPin
                    className="absolute top-3 left-3 text-secondary-400"
                    size={20}
                  />
                  <input
                    type="text"
                    name="address"
                    className="w-full pl-10 pr-4 py-3 bg-secondary-700 bg-opacity-50 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="Address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </motion.div>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="relative"
                >
                  <MapPin
                    className="absolute top-3 left-3 text-secondary-400"
                    size={20}
                  />
                  <input
                    type="text"
                    name="state"
                    className="w-full pl-10 pr-4 py-3 bg-secondary-700 bg-opacity-50 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="State"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </motion.div>

                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="relative"
                >
                  <MapPin
                    className="absolute top-3 left-3 text-secondary-400"
                    size={20}
                  />
                  <input
                    type="text"
                    name="city"
                    className="w-full pl-10 pr-4 py-3 bg-secondary-700 bg-opacity-50 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                  />
                </motion.div>
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="relative"
                >
                  <MapPin
                    className="absolute top-3 left-3 text-secondary-400"
                    size={20}
                  />
                  <input
                    type="text"
                    name="zipCode"
                    className="w-full pl-10 pr-4 py-3 bg-secondary-700 bg-opacity-50 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="Zip code"
                    value={formData.zipCode}
                    onChange={handleChange}
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
                    name="password"
                    className="w-full pl-10 pr-4 py-3 bg-secondary-700 bg-opacity-50 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
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
                    name="confirmPassword"
                    className="w-full pl-10 pr-4 py-3 bg-secondary-700 bg-opacity-50 border border-secondary-600 rounded-lg text-white placeholder-secondary-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                    placeholder="Confirm Password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
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
                      I agree with the
                      <a
                        href="https://drive.google.com/file/d/14CXOGtA6ZznDDt3KiPNuYa5GXE8VjHoY/view?usp=drivesdk"
                        className="text-blue-400 mx-1 cursor-pointer"
                        target="_blank"
                      >
                        Privacy policy
                      </a>
                      and
                      <a
                        href="https://drive.google.com/file/d/14CXOGtA6ZznDDt3KiPNuYa5GXE8VjHoY/view?usp=drivesdk"
                        className="text-blue-400 mx-1 cursor-pointer"
                        target="_blank"
                      >
                        Terms & Conditions
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
    </div>
  );
};

export default UserSignUp;
