import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const phoneInputCustomStyles = `
  .react-tel-input .country-list {
    color: black;
  }
  .react-tel-input .form-control {
    padding-left: 48px !important;
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
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/signup`,
        {
          name,
          email,
          password,
          country,
          phone,
        }
      );
      if (res.data.status) {
        console.log("User created successfully", res.data);
        toast.success(res.data.msg);
        navigate("/user/login");
      } else {
        setError("email");
      }
    } catch (error) {
      console.error("Error during signup:", error);
      setError(error.response.data.msg);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-secondary-900 p-4">
      <style>{phoneInputCustomStyles}</style>
      <Toaster />
      <div className="w-full max-w-6xl flex flex-col md:flex-row bg-secondary-800 shadow-lg rounded-lg overflow-hidden">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-2/5 p-8 flex flex-col bg-secondary-900 justify-center i text-white relative bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://png.pngtree.com/background/20230109/original/pngtree-white-abstract-carbon-fiber-texture-background-picture-image_1996167.jpg')",
            backgroundBlendMode: "overlay",
          }}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Welcome To Forex-ZX
          </h2>
          <p className="mb-6 text-lg">Already have an account?</p>
          <Link to={"/user/login"}>
            <button className="bg-white  text-secondary-800 hover:bg-secondary-700/60 transition-all duration-300 hover:text-white px-8 py-3 rounded-full font-semibold text-lg">
              Login here
            </button>
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full md:w-3/5 bg-secondary-800/60 text-white p-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-6">
            Create Your Account
          </h1>
          <p className="mb-8 text-lg">
            Haven't registered yet? Don't worry just fill up all the information
            below and get your account now.
          </p>
          {error && (
            <div className="mb-6 text-red-500 text-lg">
              <p>{error}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block mb-2 text-lg">
                First name
              </label>
              <input
                type="text"
                id="name"
                className="w-full p-3 text-black rounded-lg"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-lg">
                Email*
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-3 text-black rounded-lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="country" className="block mb-2 text-lg">
                Country
              </label>
              <select
                id="country"
                className="w-full p-3 text-black rounded-lg"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              >
                <option value="">Select a country</option>
                <option value="IN">India</option>
                <option value="US">United States</option>
                {/* Add more countries as needed */}
              </select>
            </div>
            <div>
              <label htmlFor="phone" className="block mb-2 text-lg">
                Mobile*
              </label>
              <PhoneInput
                country={country.toLowerCase()}
                value={phone}
                onChange={(phone) => setPhone(phone)}
                inputProps={{
                  required: true,
                  className: "w-full px-14 py-3 text-black rounded-lg",
                }}
                containerClass="react-tel-input"
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-lg">
                Password*
              </label>
              <input
                type="password"
                id="password"
                className="w-full p-3 text-black rounded-lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="block mb-2 text-lg">
                Confirm password*
              </label>
              <input
                type="password"
                id="confirmPassword"
                className="w-full p-3 text-black rounded-lg"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" required />
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
              className="md:col-span-2 w-full bg-secondary-700 text-white py-4 rounded-lg font-semibold text-lg hover:bg-secondary-600 transition-colors duration-300"
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
