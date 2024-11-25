import { useState } from "react";
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
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
  const navigate = useNavigate();
  // const currentAccount = useSelector((store) => store.user.currentAccount);
  const loggedUser = useSelector((store) => store.user.loggedUser);
  // const userInfo = useSelector((store) => store.user.userInfo);

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    setError(""); // Clear the error when the user starts typing
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

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

  const customContent = `<!DOCTYPE html>
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
          <h1>Master password updated</h1>
        </div>
        <div class="content">
          <p>Dear ${loggedUser?.firstName + " " + loggedUser?.lastName},</p>
  <p>Your account's master password has been successfully updated.</p>
         <div class="withdrawal-details">
          
          <p>Account No: <span class="highlight">${
            loggedUser.mt5Account
          }</span></p>
            <p>Old password: <span class="highlight">${
              loggedUser.masterPassword
            }</span></p>
            <p>New password: <span class="highlight">${
              passwords.confirm
            }</span></p>
            <p>Updated Date: <span class="highlight">${formattedDateTime}</span></p>
          </div>
    
    <p>Thank you for choosing us.</p>
    <p>Happy trading!</p>
          
          <p>Best regards,<br>${import.meta.env.VITE_WEBSITE_NAME} Team</p>
          <hr>
     <div class="risk-warning">
      <strong>Risk Warning:</strong> Trading CFDs carries high risk and may result in losses beyond your initial investment. Trade only with money you can afford to lose and understand the risks.  
      <br><br>
      ${
        import.meta.env.VITE_WEBSITE_NAME
      } Trade’s services are not for U.S. citizens or in jurisdictions where they violate local laws.
    </div>
        
    
        </div>
      <div class="footer">
          <div class="footer-info">    
            <p>${import.meta.env.VITE_EMAIL_ADDRESS}</p>
            <p>Website: <a href=${import.meta.env.VITE_EMAIL_WEBSITE}>${
    import.meta.env.VITE_WEBSITE_NAME
  }</a> | E-mail: <a href="mailto:${import.meta.env.VITE_EMAIL_EMAIL}">${
    import.meta.env.VITE_EMAIL_EMAIL
  }</a></p>
            <p>We sent out this message to all existing traders. Please visit this page to know more about our Privacy Policy.</p>
            <p>&copy; 2024 ${
              import.meta.env.VITE_WEBSITE_NAME
            }. All Rights Reserved</p>
          </div>
        </div>
      </div>
    </body>
    </html>`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Please wait...");
    if (passwords.new !== passwords.confirm) {
      setError("Passwords do not match. Please try again.");
      toast.error("Please try again", { id: toastId });
    } else {
      try {
        const res = await axios.get(
          `${
            import.meta.env.VITE_API_END_POINT
          }/ChangeMasterPassword?Manager_Index=${
            import.meta.env.VITE_MANAGER_INDEX
          }&Account=${loggedUser.mt5Account}&password=${passwords.confirm}`
        );

        const updateChallengeDB = await axios.put(
          `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/update-challenge`,
          {
            mt5Account: loggedUser.mt5Account,
            masterPassword: passwords.confirm,
          }
        );
        const updateUser = await axios.put(
          `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/update-user`,
          {
            id: loggedUser._id,
            masterPassword: passwords.confirm,
          }
        );
        const customMailRes = await axios.post(
          `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/custom-mail`,
          {
            email: loggedUser.email,
            content: customContent,
            subject: "Master password changed",
          }
        );

        // console.log("update master password ---", updateChallengeDB);
        toast.success(res.data.MESSAGE, { id: toastId });
        // dispatch(setMasterPassword(passwords.confirm));
        navigate("/user/dashboard");
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
