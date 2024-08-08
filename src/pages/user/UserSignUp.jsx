import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
// import { Toast } from "react-toastify/dist/components";

console.log("env", import.meta.env.VITE_BECKEND_END_POINT);

const UserSignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/signup`,
        {
          name: name,
          email: email,
          password: password,
        }
      );
      if (res.data.status) {
        console.log("User created successfully", res.data);
        toast.success(res.data.msg);
        navigate("/user/login");
      } else {
        setError("email");
      }
      // setError(res.response.data.msg);
    } catch (error) {
      console.error("Error during signup:", error);
      setError(error.response.data.msg);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-secondary-900 p-4">
      <Toaster></Toaster>
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-secondary-800 shadow-lg rounded-lg overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2 p-8 flex flex-col bg-secondary-900 justify-center items-center text-white relative bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://png.pngtree.com/background/20230109/original/pngtree-white-abstract-carbon-fiber-texture-background-picture-image_1996167.jpg')",
            backgroundBlendMode: "overlay",
          }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome To Forex-ZX
          </h2>
          <p className="mb-4">Already have an account?</p>
          <Link
            onClick={() => toast.success("hello")}
            to={"/user/login"}
            className="bg-white text-secondary-800 hover:bg-secondary-700/60 transition-all duration-300 hover:text-white px-6 py-2 rounded-full font-semibold"
          >
            Login here
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2 bg-secondary-800/60 text-white p-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            Create Your Account
          </h1>
          <p className="mb-6">
            Haven't registered yet? Don't worry just fill up all the information
            below and get your account now.
          </p>
          {error && (
            <div className="mb-4 text-red-500">
              <p>{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="referral" className="block mb-2">
                Name
              </label>
              <input
                type="text"
                id="referral"
                className="w-full p-3 text-black rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2">
                Email*
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 text-black rounded"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2">
                Password*
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-3 text-black rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block mb-2">
                Confirm password*
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full p-3 text-black rounded"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm">
                  I agree with{" "}
                  <a href="#" className="text-blue-400">
                    Privacy Policy
                  </a>
                  ,{" "}
                  <a href="#" className="text-blue-400">
                    Terms of Service
                  </a>
                </span>
              </label>
            </div>
            <button
              type="submit"
              className="w-full bg-secondary-700 text-white py-3 rounded-lg font-semibold"
            >
              Create an Account
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default UserSignUp;
