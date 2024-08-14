import React, { useState } from "react";
import { Eye, EyeOff, Lock, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const UserChnagePassword = () => {
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add password change logic here
    console.log("Password change submitted:", passwords);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 sm:p-10 bg-gradient-to-br from-secondary-800/40 to-secondary-800/60 rounded-xl shadow-2xl">
      <h2 className="text-3xl sm:text-4xl font-bold  mb-8 text-center">
        Change Password
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {["current", "new", "confirm"].map((field) => (
          <div key={field} className="relative">
            <label htmlFor={field} className="block text-sm font-medium  mb-2">
              {field.charAt(0).toUpperCase() + field.slice(1)} Password
            </label>
            <div className="relative group">
              <input
                type={showPasswords[field] ? "text" : "password"}
                id={field}
                name={field}
                value={passwords[field]}
                onChange={handleChange}
                className="w-full px-4 py-3 border-none bg-secondary-800 pl-12 pr-10 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-700 focus:border-secondary-700 transition duration-300"
                required
              />
              <Lock
                className="absolute left-4 top-1/2 transform -translate-y-1/2  group-focus-within:secondary-700 transition-colors duration-300"
                size={20}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility(field)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-200 hover:secondary-700 focus:outline-none"
              >
                {showPasswords[field] ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}
              </button>
            </div>
          </div>
        ))}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
          <Link
            to={"/user/dashboard"}
            type="button"
            className="w-full sm:w-auto bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="w-full sm:w-auto bg-secondary-600/70 text-white py-3 px-6 rounded-lg secondary-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50 flex items-center justify-center"
          >
            <CheckCircle className="mr-2" size={20} />
            Change Password
          </button>
        </div>
      </form>
    </div>
  );
};

export default UserChnagePassword;
