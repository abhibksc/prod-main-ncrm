import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";

const UserVerifyEmail = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0].focus();
  }, []);

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary-700 to-secondary-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-secondary-700/80 text-white p-10 rounded-xl shadow-2xl backdrop-blur-sm"
      >
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-6 text-3xl font-extrabold"
          >
            Verify Your Account
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-2 text-sm text-gray-200"
          >
            We've sent a code to your email
          </motion.p>
        </div>
        <form className="mt-8 space-y-6">
          <div className="flex flex-row justify-center items-center space-x-2">
            {otp.map((data, index) => (
              <motion.input
                key={index}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * index, duration: 0.3 }}
                type="text"
                ref={(ref) => (inputRefs.current[index] = ref)}
                maxLength="1"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className="w-12 h-12 border-2 rounded-lg text-center text-xl font-semibold bg-black/10 focus:border-green-500 focus:ring-2 focus:ring-green-500 focus:outline-none transition-all duration-300"
              />
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium hover:py-4 rounded-md text-white bg-green-600 hover:bg-green-600/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300"
            >
              Verify
            </button>
          </motion.div>
        </form>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-center"
        >
          <a
            href="#"
            className="font-medium text-blue-400 hover:text-blue-300 transition-all duration-300"
          >
            Didn't receive the code? Resend
          </a>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default UserVerifyEmail;
