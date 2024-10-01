import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, X, Maximize, Minimize } from "lucide-react";

const DropdownField = ({ label, options }) => (
  <div className="mb-6 w-full">
    <label className="block text-sm font-medium text-white mb-2">{label}</label>
    <select className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-800">
      <option value="">Select {label}</option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

const ImageUploadField = ({ label, onFileChange }) => {
  return (
    <div className="mb-6 w-full">
      <label className="block text-sm font-medium text-white mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type="file"
          className="hidden"
          id={`file-${label}`}
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) {
              const reader = new FileReader();
              reader.onloadend = () => onFileChange(label, reader.result);
              reader.readAsDataURL(file);
            }
          }}
          accept="image/*"
        />
        <label
          htmlFor={`file-${label}`}
          className="flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-800 cursor-pointer hover:bg-gray-50"
        >
          <Upload className="mr-2" size={18} />
          Choose file
        </label>
      </div>
    </div>
  );
};

const ImagePreview = ({ label, preview, onRemove, onFullScreen }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="relative group"
  >
    <div className="w-full aspect-w-3 aspect-h-4 rounded-lg overflow-hidden shadow-lg">
      <img
        src={preview}
        alt={`Preview of ${label}`}
        className="w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
      <button
        onClick={onFullScreen}
        className="p-2 bg-white rounded-full text-gray-800 hover:bg-gray-200 transition-colors duration-300 mr-2"
      >
        <Maximize size={20} />
      </button>
      <button
        onClick={onRemove}
        className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors duration-300"
      >
        <X size={20} />
      </button>
    </div>
    <p className="mt-2 text-sm text-white text-center">{label}</p>
  </motion.div>
);

const FullScreenModal = ({ image, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
  >
    <div className="relative w-full h-full flex items-center justify-center">
      <img
        src={image}
        alt="Full screen preview"
        className="max-w-full max-h-full object-contain"
      />
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 bg-white rounded-full text-gray-800 hover:bg-gray-200 transition-colors duration-300"
      >
        <Minimize size={24} />
      </button>
    </div>
  </motion.div>
);

const KYCVerification = () => {
  const [images, setImages] = useState({
    "Front Side of Document": "",
    "Back Side of Document": "",
    "Selfie with Document": "",
  });
  const [fullScreenImage, setFullScreenImage] = useState(null);

  const documentTypes = ["Passport", "Driver's License", "National ID"];
  const countries = [
    "United States",
    "United Kingdom",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Japan",
  ];
  const purposes = ["Personal", "Business", "Investment"];
  const occupations = [
    "Employee",
    "Self-Employed",
    "Student",
    "Retired",
    "Unemployed",
  ];

  const handleFileChange = (label, preview) => {
    setImages((prevImages) => ({
      ...prevImages,
      [label]: preview,
    }));
  };

  const handleRemove = (label) => {
    setImages((prevImages) => ({
      ...prevImages,
      [label]: "",
    }));
  };

  return (
    <div className="max-w-7xl mx-auto bg-secondary-700/30 rounded-2xl">
      <div className="text-white p-6 rounded-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <DropdownField label="Document Type" options={documentTypes} />
          <DropdownField label="Country of Issue" options={countries} />
          <DropdownField label="Purpose" options={purposes} />
          <DropdownField label="Occupation" options={occupations} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
          {Object.keys(images).map((label) => (
            <ImageUploadField
              key={label}
              label={label}
              onFileChange={handleFileChange}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
          <AnimatePresence>
            {Object.entries(images).map(([label, preview]) =>
              preview ? (
                <ImagePreview
                  key={label}
                  label={label}
                  preview={preview}
                  onRemove={() => handleRemove(label)}
                  onFullScreen={() => setFullScreenImage(preview)}
                />
              ) : null
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-center mt-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-lg"
          >
            Update KYC Verification
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {fullScreenImage && (
          <FullScreenModal
            image={fullScreenImage}
            onClose={() => setFullScreenImage(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default KYCVerification;
