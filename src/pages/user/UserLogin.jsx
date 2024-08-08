import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const UserLogin = () => {
  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-secondary-900 p-4">
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
            Don't have an <br /> Forex-ZX account
          </h2>
          <Link
            to={"/user/signup"}
            className="bg-white text-secondary-800 hover:bg-secondary-700/60 transition-all duration-300 hover:text-white px-6 py-2 rounded-full font-semibold"
          >
            Sign up here
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-1/2 bg-secondary-800/60 text-white p-8"
        >
          <h1 className="text-2xl md:text-3xl font-bold mb-4">
            Login into Your Account
          </h1>
          <p className="mb-6">Just fill in your details below to log in.</p>
          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2">
                Email*
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 text-black rounded"
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
                required
              />
            </div>
            <Link to={"/user/dashboard"}>
              <button
                type="submit"
                className="w-full bg-secondary-700 text-white py-3 rounded-lg font-semibold"
              >
                Login
              </button>
            </Link>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default UserLogin;
