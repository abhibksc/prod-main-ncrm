import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";

const UserInfoForm = ({ userData }) => {
  console.log("userData props--", userData);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [verificationStatuses, setVerificationStatuses] = useState({
    email: false,
    kyc: false,
  });

  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || "",
        phone: userData.phone || "",
        address: userData.address || "",
        city: userData.city || "",
        state: userData.state || "",
        zipCode: userData.zipCode || "",
        country: userData.country || "",
      });
      setVerificationStatuses({
        email: userData.emailVerified || false,
        kyc: userData.kycVerified || false,
      });
    }
  }, [userData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleStatus = (key) => {
    setVerificationStatuses((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement your submit logic here
    console.log("Form submitted:", { ...formData, ...verificationStatuses });
  };

  return (
    <div className="container mx-auto p-10 rounded-lg bg-primary-700 shadow-lg text-white">
      <h1 className="text-xl font-bold mb-6">Information of User</h1>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div>
          <label className="block mb-2">First Name *</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-primary-600 border border-primary-500"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Last Name *</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-primary-600 border border-primary-500"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-primary-600 border border-primary-500"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Mobile Number *</label>
          <div className="flex">
            <select className="p-2 rounded-l bg-primary-600 border border-primary-500">
              <option>+91</option>
            </select>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full p-2 rounded-r bg-primary-600 border border-l-0 border-primary-500"
              required
            />
          </div>
        </div>
        <div className="md:col-span-2">
          <label className="block mb-2">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-primary-600 border border-primary-500"
          />
        </div>
        <div>
          <label className="block mb-2">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-primary-600 border border-primary-500"
          />
        </div>
        <div>
          <label className="block mb-2">State</label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-primary-600 border border-primary-500"
          />
        </div>
        <div>
          <label className="block mb-2">Zip/Postal</label>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-primary-600 border border-primary-500"
          />
        </div>
        <div>
          <label className="block mb-2">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-primary-600 border border-primary-500"
          />
        </div>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2  max-w-2xl mx-auto gap-4 mt-8">
        <VerificationStatus
          label="Email Verification"
          isVerified={verificationStatuses.email}
          onToggle={() => toggleStatus("email")}
        />
        <VerificationStatus
          label="KYC"
          isVerified={verificationStatuses.kyc}
          onToggle={() => toggleStatus("kyc")}
        />
      </div>

      <button
        type="submit"
        onClick={handleSubmit}
        className="w-full mt-8 p-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition-colors"
      >
        Update
      </button>
    </div>
  );
};

const VerificationStatus = ({ label, isVerified, onToggle }) => {
  return (
    <div
      className={`p-3 py-6 rounded ${
        isVerified ? "bg-green-500" : "bg-red-500"
      } flex items-center justify-between`}
    >
      <span>{label}</span>
      <div className="flex items-center">
        <span className="mr-2 capitalize">
          {isVerified ? "Verified" : "Disabled"}
        </span>
        {isVerified ? <Check size={18} /> : <X size={18} />}
        <label className="inline-flex items-center cursor-pointer ml-2">
          <div className="relative">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={isVerified}
              onChange={onToggle}
            />
            <div className="w-11 h-6 bg-gray-200 whitespace-nowrap peer-focus:outline-none  rounded-full peer dark:bg-red-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-green-600"></div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default UserInfoForm;
