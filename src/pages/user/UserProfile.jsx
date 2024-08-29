import React from "react";
import { User, Mail, Phone, MapPin, Flag } from "lucide-react";
import { motion } from "framer-motion";

const UserProfile = () => {
  return (
    <motion.div
      className="max-w-4xl mx-auto p-8 bg-gradient-to-br bg-secondary-800/60 rounded-xl shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="text-3xl font-bold mb-5">Profile Information</h1>

      <motion.form
        className="space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ staggerChildren: 0.1 }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              label: "First Name",
              icon: <User />,
              value: "Awais",
              required: true,
            },
            {
              label: "Last Name",
              icon: <User />,
              value: "Sharif",
              required: true,
            },
            {
              label: "E-mail Address",
              icon: <Mail />,
              value: "awaissharif17@gmail.com",
              readOnly: true,
            },
            {
              label: "Mobile Number",
              icon: <Phone />,
              value: "923048077771",
              readOnly: true,
            },
            { label: "Address", icon: <MapPin />, value: "Test" },
            { label: "State", icon: <MapPin />, value: "Punjab" },
            { label: "Zip Code", icon: <MapPin />, value: "54000" },
            { label: "City", icon: <MapPin />, value: "Lahore" },
            {
              label: "Country",
              icon: <Flag />,
              value: "Pakistan",
              readOnly: true,
            },
          ].map((field, index) => (
            <motion.div
              key={index}
              className="relative"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              {field.readOnly ? (
                <ReadOnlyField
                  label={field.label}
                  icon={field.icon}
                  value={field.value}
                />
              ) : (
                <InputField
                  label={field.label}
                  icon={field.icon}
                  value={field.value}
                  required={field.required}
                />
              )}
            </motion.div>
          ))}
        </div>

        <motion.button
          type="submit"
          className="w-full bg-green-700 text-white py-3 rounded-lg font-semibold transition duration-300 ease-in-out transform hover:bg-green-600"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          Update Profile
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

const InputField = ({ label, icon, value, required = false }) => (
  <motion.div
    className="relative"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <label className="block text-sm font-medium mb-1">
      {label}
      {required && "*"}
    </label>
    <div className="relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-secondary-200">
        {icon}
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-3 rounded-md leading-5 bg-secondary-700 outline-none sm:text-sm focus:ring-2 focus:ring-secondary-500 focus:border-secondary-500"
        defaultValue={value}
        required={required}
      />
    </div>
  </motion.div>
);

const ReadOnlyField = ({ label, icon, value }) => (
  <motion.div
    className="relative"
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    <label className="block text-sm font-medium mb-1">{label}</label>
    <div className="relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none cursor-not-allowed text-gray-500">
        {icon}
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 cursor-not-allowed py-3 border-none outline-none rounded-md leading-5 bg-secondary-700 text-gray-400 sm:text-sm"
        value={value}
        readOnly
      />
    </div>
  </motion.div>
);

export default UserProfile;
