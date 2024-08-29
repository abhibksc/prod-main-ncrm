import { useState } from "react";
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { setMasterPassword } from "../../redux/user/userSlice";
import { motion } from "framer-motion";

const UserMasterPassword = () => {
  const [passwords, setPasswords] = useState({
    new: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    new: false,
    confirm: false,
  });
  const [error, setError] = useState("");
  const currentAccount = useSelector((store) => store.user.currentAccount);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    setError(""); // Clear the error when the user starts typing
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Please wait...");
    if (passwords.new !== passwords.confirm) {
      setError("Passwords do not match. Please try again.");
      toast.error("Please try again", { id: toastId });
    } else {
      try {
        const res = await axios.get(
          `http://103.180.121.22/api/web/ChangeMasterPassword?Manager_Index=1&Account=${currentAccount}&password=${passwords.confirm}`
        );
        toast.success(res.data.MESSAGE, { id: toastId });
        dispatch(setMasterPassword(passwords.confirm));
      } catch (error) {
        toast.error("Please try again", { id: toastId });
      }
      // Reset the form and error
      setPasswords({ new: "", confirm: "" });
      setError("");
    }
  };

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto p-6 sm:p-10 bg-gradient-to-br from-secondary-800/40 to-secondary-800/60 rounded-xl shadow-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center">
        Change your master password
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {["new", "confirm"].map((field) => (
          <motion.div
            key={field}
            className="relative"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: field === "new" ? 0 : 0.1 }}
          >
            <label htmlFor={field} className="block text-sm font-medium mb-2">
              {field.charAt(0).toUpperCase() + field.slice(1)} Password
            </label>
            <div className="relative group">
              <input
                type={showPasswords[field] ? "text" : "password"}
                id={field}
                name={field}
                value={passwords[field]}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-none bg-secondary-800 pl-12 pr-10 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-700 focus:border-secondary-700 transition duration-300 ${
                  error && "ring-red-500 border-red-500"
                }`}
                required
              />
              <Lock
                className="absolute left-4 top-1/2 transform -translate-y-1/2 group-focus-within:secondary-700 transition-colors duration-300"
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
          </motion.div>
        ))}
        {error && (
          <motion.div
            className="text-red-500 flex items-center mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle className="mr-2" size={20} />
            {error}
          </motion.div>
        )}
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
          <Link
            to={"/user/dashboard"}
            type="button"
            className="w-full sm:w-auto bg-gray-200 text-gray-800 py-3 px-6 rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Cancel
          </Link>
          <motion.button
            type="submit"
            className="w-full sm:w-auto bg-green-700 hover:bg-green-700/70 text-white py-3 px-6 rounded-lg secondary-700 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <CheckCircle className="mr-2" size={20} />
            Change Password
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default UserMasterPassword;
