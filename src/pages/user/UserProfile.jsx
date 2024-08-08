import React from "react";
import { User, Mail, Phone, MapPin, Flag } from "lucide-react";

const UserProfile = () => {
  return (
    <div className="max-w-4xl mx-auto p-8 bg-gradient-to-br bg-secondary-800/60 rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold mb-8">Profile Information</h1>

      <form className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="First Name"
            icon={<User />}
            value="Awais"
            required
          />
          <InputField
            label="Last Name"
            icon={<User />}
            value="Sharif"
            required
          />
          <ReadOnlyField
            label="E-mail Address"
            icon={<Mail />}
            value="awaissharif17@gmail.com"
          />
          <ReadOnlyField
            label="Mobile Number"
            icon={<Phone />}
            value="923048077771"
          />
          <InputField label="Address" icon={<MapPin />} value="Test" />
          <InputField label="State" icon={<MapPin />} value="Punjab" />
          <InputField label="Zip Code" icon={<MapPin />} value="54000" />
          <InputField label="City" icon={<MapPin />} value="Lahore" />
          <ReadOnlyField label="Country" icon={<Flag />} value="Pakistan" />
        </div>

        <button
          type="submit"
          className="w-full bg-green-700  text-white py-3 rounded-lg font-semibold transition duration-300 ease-in-out transform  hover:bg-green-600 "
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

const InputField = ({ label, icon, value, required = false }) => (
  <div className="relative">
    <label className="block text-sm font-medium mb-1">
      {label}
      {required && "*"}
    </label>
    <div className="relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        {icon}
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white  text-black focus:outline-none focus:ring-2 sm:text-sm"
        defaultValue={value}
        required={required}
      />
    </div>
  </div>
);

const ReadOnlyField = ({ label, icon, value }) => (
  <div className="relative">
    <label className="block text-sm font-medium  mb-1">{label}</label>
    <div className="relative rounded-md shadow-sm">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none cursor-not-allowed text-gray-400">
        {icon}
      </div>
      <input
        type="text"
        className="block w-full pl-10 pr-3 cursor-not-allowed py-2 border border-gray-300 rounded-md leading-5 bg-gray-100 text-gray-700 sm:text-sm"
        value={value}
        readOnly
      />
    </div>
  </div>
);

export default UserProfile;
