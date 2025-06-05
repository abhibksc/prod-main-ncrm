import { useState } from "react";
import { Eye, EyeOff, Lock, CheckCircle, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import UseUserHook from "@/hooks/user/UseUserHook";
import { backendApi } from "@/utils/apiClients";
import ModernHeading from "@/lib/ModernHeading";

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
  const [error, setError] = useState("");

  const loggedUser = useSelector((store) => store.user.loggedUser);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
    setError(""); // Clear the error when the user starts typing
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };
  const { getUpdateLoggedUser } = UseUserHook();

  const currentDateTime = new Date();
  const formattedDateTime =
    currentDateTime.toLocaleDateString("en-GB") +
    ", " +
    currentDateTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
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
          <h1>Account password updated</h1>
        </div>
        <div class="content">
          <p>Dear ${loggedUser?.firstName + " " + loggedUser?.lastName},</p>
  <p>Your account password has been successfully updated.</p>
         <div class="withdrawal-details">
            <p>New password: <span class="highlight">${
              passwords.confirm
            }</span></p>
            <p>Updated Date: <span class="highlight">${formattedDateTime}</span></p>
          </div>
    
    <p>Thank you for choosing us.</p>
    <p>Happy trading!</p>
          
          <p>Best regards,<br>The ${
            import.meta.env.VITE_WEBSITE_NAME || "Forex"
          }  Team</p>
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
  } </a> | E-mail: <a href="mailto:${import.meta.env.VITE_EMAIL_EMAIL || ""}">${
    import.meta.env.VITE_EMAIL_EMAIL || ""
  }</a></p>
                  <p>We sent out this message to all existing ${
                    import.meta.env.VITE_WEBSITE_NAME || ""
                  } traders. Please visit this page to know more about our Privacy Policy.</p>
                  <p>© 2025 ${
                    import.meta.env.VITE_WEBSITE_NAME || ""
                  }. All Rights Reserved</p>
                </div>
        </div>
      </div>
    </body>
    </html>`;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const toastId = toast.loading("Please wait..");
    if (passwords.new !== passwords.confirm) {
      setError("Passwords do not match. Please try again.");
      toast.error("Passwords do not match", { id: toastId });
    } else {
      try {
        const res = await backendApi.post(`/update-password`, {
          userId: loggedUser._id,
          currentPassword: passwords.current,
          newPassword: passwords.confirm,
        });
        const customMailRes = await backendApi.post(`/custom-mail`, {
          email: loggedUser.email,
          content: customContent,
          subject: "Account Password Changed",
        });
        toast.success(res.data.msg, { id: toastId });
        navigate("/user/dashboard");
        getUpdateLoggedUser();
      } catch (error) {
        console.log("error while changing password--", error);
        toast.error(error.response.data.message, { id: toastId });
      }
    }
  };

  return (
    <motion.div
      className="w-full max-w-4xl mx-auto p-6 sm:p-10 bg-secondary-800/30 rounded-xl shadow-2xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <ModernHeading text={"Change Password"}></ModernHeading>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {["current", "new", "confirm"].map((field) => (
          <motion.div
            key={field}
            className="relative"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
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
                className="w-full px-4 py-3 border-none bg-secondary-800/50 pl-12 pr-10 border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary-500 transition duration-300"
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
          </motion.div>
        ))}
        {error && (
          <motion.div
            className="text-red-500 flex items-center mt-2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <AlertCircle className="mr-2" size={20} />
            {error}
          </motion.div>
        )}
        <div className="flex flex-col-reverse gap-4 sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8">
          <Link
            to={"/user/dashboard"}
            type="button"
            className="w-full sm:w-auto text-center bg-gray-500/40 text-gray-200 py-3 px-6 rounded-lg hover:bg-gray-300/10 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
          >
            Cancel
          </Link>
          <motion.button
            type="submit"
            className="w-full sm:w-auto bg-secondary-500 text-white py-3 px-6 rounded-lg hover:bg-secondary-500-80 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-white/60 focus:ring-opacity-50 flex items-center justify-center"
            initial={{ scale: 0.99 }}
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <CheckCircle className="mr-2" size={20} />
            Update Password
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default UserChnagePassword;
