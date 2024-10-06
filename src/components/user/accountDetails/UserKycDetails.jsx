import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  X,
  Maximize,
  Minimize,
  Images,
  Loader,
  CheckCircle2,
} from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import UseUserHook from "@/hooks/user/UseUserHook";
import toast from "react-hot-toast";

// Dropdown Field Component
const DropdownField = ({ label, options, value, onChange }) => (
  <div className="mb-6 w-full">
    <label className="block text-sm font-medium text-white mb-2">{label}</label>
    <select
      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-secondary-400 focus:border-secondary-400 transition-all duration-300 bg-white text-secondary-800"
      value={value}
      onChange={(e) => onChange(e.target.value)} // Remove the label parameter
    >
      <option value="">Select {label}</option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  </div>
);

// Image Upload Field Component
const ImageUploadField = ({ label, onFileChange }) => {
  const fieldNameMap = {
    "Front Side of Document": "frontSideOfDocument",
    "Back Side of Document": "backSideOfDocument",
    "Selfie with Document": "selfieWithDocument",
  };

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
              reader.onloadend = () => {
                onFileChange(fieldNameMap[label], {
                  file: file,
                  preview: reader.result,
                  label: label,
                });
              };
              reader.readAsDataURL(file);
            }
          }}
          accept="image/*"
        />
        <label
          htmlFor={`file-${label}`}
          className="flex items-center justify-center w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-secondary-800 cursor-pointer hover:bg-gray-50"
        >
          <Upload className="mr-2" size={18} />
          Choose file
        </label>
      </div>
    </div>
  );
};

// Image Preview Component
const ImagePreview = ({ label, preview, onRemove, onFullScreen }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative group"
    >
      <div className="w-full aspect-w-3 aspect-h-4 rounded-lg overflow-hidden shadow-lg">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
        <img
          src={preview}
          alt={`Preview of ${label}`}
          className={`w-full h-full object-cover transform transition-transform duration-300 group-hover:scale-105 ${
            isLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
        />
      </div>
      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
        <button
          onClick={onFullScreen}
          className="p-2 bg-white rounded-full text-gray-800 hover:bg-gray-200 transition-colors duration-300 mr-2"
          type="button"
        >
          <Maximize size={20} />
        </button>
        <button
          onClick={onRemove}
          className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors duration-300"
          type="button"
        >
          <X size={20} />
        </button>
      </div>
      <p className="mt-2 text-sm text-white text-center">{label}</p>
    </motion.div>
  );
};

// Full Screen Modal Component
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
        type="button"
      >
        <Minimize size={24} />
      </button>
    </div>
  </motion.div>
);

// Main Component
const UserKycDetails = () => {
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const { getUpdateLoggedUser } = UseUserHook();

  // Form Data State
  const [formData, setFormData] = useState({
    documentType: loggedUser?.kycDetails?.documentType || "",
    countryOfIssue: loggedUser?.kycDetails?.countryOfIssue || "",
    purpose: loggedUser?.kycDetails?.purpose || "",
    occupation: loggedUser?.kycDetails?.occupation || "",
  });

  // Image States
  const [imageFiles, setImageFiles] = useState({
    frontSideOfDocument: null,
    backSideOfDocument: null,
    selfieWithDocument: null,
  });
  const getFullImageUrl = (path) => {
    if (!path) return "";
    return path.startsWith("http")
      ? path
      : `${import.meta.env.VITE_BECKEND_END_POINT}/${path.replace(/\\/g, "/")}`;
  };

  const [imagePreviews, setImagePreviews] = useState({
    "Front Side of Document": "",
    "Back Side of Document": "",
    "Selfie with Document": "",
  });

  // console.log("preview image ############", imagePreviews);

  const [fullScreenImage, setFullScreenImage] = useState(null);

  // Options for dropdown fields
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

  // Handlers
  const handleDropdownChange = (field, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleFileChange = (fieldName, { file, preview, label }) => {
    setImageFiles((prev) => ({
      ...prev,
      [fieldName]: file,
    }));

    setImagePreviews((prev) => ({
      ...prev,
      [label]: preview, // This is already a full URL for file previews
    }));
  };

  const handleRemove = (label) => {
    const fieldNameMap = {
      "Front Side of Document": "frontSideOfDocument",
      "Back Side of Document": "backSideOfDocument",
      "Selfie with Document": "selfieWithDocument",
    };

    setImageFiles((prev) => ({
      ...prev,
      [fieldNameMap[label]]: null,
    }));

    setImagePreviews((prev) => ({
      ...prev,
      [label]: "",
    }));
  };
  //   const customContent = `<!DOCTYPE html>
  //   <html lang="en">
  //   <head>
  //     <meta charset="UTF-8">
  //     <meta name="viewport" content="width=device-width, initial-scale=1.0">
  //     <title>Withdrawal Request Confirmation - Arena Trade</title>
  //     <style>
  //       body, html {
  //         margin: 0;
  //         padding: 0;
  //         font-family: 'Arial', sans-serif;
  //         line-height: 1.6;
  //         color: #333;
  //         background-color: #f4f4f4;
  //       }
  //       .container {
  //         max-width: 600px;
  //         margin: 0 auto;
  //         padding: 8px;
  //         background-color: #ffffff;
  //       }
  //       .header {
  //         background-color: #0a2342;
  //         color: #ffffff;
  //         padding: 20px 15px;
  //         text-align: center;
  //         border-radius: 10px 10px 0 0;
  //       }
  //       .header h1 {
  //         margin: 0;
  //         font-size: 22px;
  //         letter-spacing: 1px;
  //       }
  //       .content {
  //         padding: 10px 20px;
  //       }
  //       .cta-button {
  //         display: inline-block;
  //         padding: 12px 24px;
  //         background-color: #ffa500;
  //         color: #FFFFFF;
  //         text-decoration: none;
  //         border-radius: 5px;
  //         font-weight: bold;
  //         margin: 10px 0;
  //       }
  //       .footer {
  //         background-color: #0a2342;
  //         color: #ffffff;
  //         text-align: center;
  //         padding: 10px 15px;
  //         font-size: 12px;
  //         border-radius: 0 0 10px 10px;
  //       }
  //       .footer-info {
  //         margin-top: 10px;
  //         line-height: 1.8;
  //       }
  //       .footer-info a {
  //         color: #ffa500;
  //         text-decoration: none;
  //       }
  //      .download-section {
  //         display: flex;
  //         justify-content: space-between;
  //         align-items: center;
  //         margin-top: 20px;
  //         background-color: #f0f8ff;
  //         padding: 20px;
  //         border-radius: 15px;
  //       }
  //       .download-button {
  //         display: flex;
  //           flex-direction: column;

  //         align-items: center;
  //         justify-content: center;
  //         text-decoration: none;
  //         color: #0a2342;
  //         background-color: #ffffff;
  //         padding: 10px 10px;
  //         border-radius: 8px;
  //         box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  //         transition: all 0.3s ease;
  //         width: 30%;
  //         max-width: 80px;
  //       }
  //       .download-button:hover {
  //         transform: translateY(-2px);
  //         box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
  //       }
  //       .download-button img {
  //         width: 24px;
  //         height: 24px;
  //         margin-right: 8px;
  //       }
  //       .download-button span {
  //         font-weight: bold;
  //         font-size: 14px;
  //       }
  //       @media (max-width: 480px) {
  //         .download-section {
  //           flex-direction: column;
  //           align-items: stretch;
  //           gap: 10px;
  //         }
  //         .download-button {
  //           width: 60%;
  //           max-width: none;
  //         }
  //       }
  //       .withdrawal-details {
  //         background-color: #f8f8f8;
  //         border-left: 4px solid #ffa500;
  //         padding: 15px;
  //         margin: 20px 0;
  //       }
  //       .withdrawal-details p {
  //         margin: 5px 0;
  //       }
  //       .highlight {
  //         font-weight: bold;
  //         color: #0a2342;
  //       }
  //       .risk-warning {
  //         color: #C70039;
  //         padding: 15px;
  //         font-size: 12px;
  //         line-height: 1.4;
  //       }
  //     </style>
  //   </head>
  //   <body>
  //     <div class="container">
  //       <div class="header">
  //         <h1>KYC submitted</h1>
  //       </div>
  //       <div class="content">
  //         <p>Dear ${loggedUser?.firstName + " " + loggedUser?.lastName},</p>
  // <p>Your KYC has been successfully submitted. We will notify you when it gets verified!</p>
  //         <div class="withdrawal-details">

  //           <p>Account No: <span class="highlight">${
  //             loggedUser?.mt5Account
  //           }</span></p>
  //           <p>Document Type: <span class="highlight">${
  //             formData?.documentType
  //           }</span></p>
  //           <p>Country of issue: <span class="highlight">${
  //             formData.countryOfIssue
  //           }</span></p>
  //           <p>Purpose: <span class="highlight">${formData.purpose}</span></p>
  //           <p>Occupation: <span class="highlight">${
  //             formData.occupation
  //           }</span></p>
  //         </div>
  //   <p>Thank you for choosing us.</p>

  //         <p>Happy trading!</p>

  //         <p>Best regards,<br>The Arena Trade Team</p>
  //         <hr>
  //    <div class="risk-warning">
  //     <strong>Risk Warning:</strong> Trading CFDs carries high risk and may result in losses beyond your initial investment. Trade only with money you can afford to lose and understand the risks.
  //     <br><br>
  //     Arena Trade’s services are not for U.S. citizens or in jurisdictions where they violate local laws.
  //   </div>

  //       </div>
  //       <div class="footer">
  //         <div class="footer-info">
  //           <p>Company License Name</p>

  //           <p>35-37, Ludgate Hill, London Post Box: EC4M7JN United Kingdom | P.O. Box 151</p>
  //           <p>Website: <a href="http://www.capitalstreetfx.com">www.capitalstreetfx.com</a> | E-mail: <a href="mailto:support@capitalstreetfx.com">support@capitalstreetfx.com</a></p>
  //           <p>WHATSAPP US: +760-7500-0197 | SKYPE US: dfhhgffdfdgfgx.support</p>
  //           <p>We sent out this message to all existing Alena Traders. Please visit this page to know more about our Privacy Policy.</p>
  //           <p>&copy; 2024 Arena Trade 2012-2021. All Rights Reserved</p>
  //         </div>
  //       </div>
  //     </div>
  //   </body>
  //   </html>`;

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
        <h1>Kyc submitted</h1>
      </div>
      <div class="content">
        <p>Dear ${loggedUser?.firstName + " " + loggedUser?.lastName},</p>
<p>Your KYC has been successfully submitted. We will notify you when it gets verified!</p>
        <div class="withdrawal-details">
        <p>Username: <span class="highlight">${loggedUser.email}</span></p>
         <p>Document Type: <span class="highlight">${
           formData?.documentType
         }</span></p>
          <p>Country of issue: <span class="highlight">${
            formData.countryOfIssue
          }</span></p>
          <p>Purpose: <span class="highlight">${formData.purpose}</span></p>
          <p>Occupation: <span class="highlight">${
            formData.occupation
          }</span></p>
        </div>
  
  <p>Thank you for choosing us.</p>
  <p>Happy trading!</p>
        
        <p>Best regards,<br>The Arena Trade Team</p>
        <hr>
   <div class="risk-warning">
    <strong>Risk Warning:</strong> Trading CFDs carries high risk and may result in losses beyond your initial investment. Trade only with money you can afford to lose and understand the risks.  
    <br><br>
    Arena Trade’s services are not for U.S. citizens or in jurisdictions where they violate local laws.
  </div>
      
  
      </div>
      <div class="footer">
        <div class="footer-info">    
          <p>35-37, Ludgate Hill, London Post Box: EC4M7JN United Kingdom | P.O. Box 151</p>
          <p>Website: <a href="http://www.capitalstreetfx.com">www.capitalstreetfx.com</a> | E-mail: <a href="mailto:support@capitalstreetfx.com">support@capitalstreetfx.com</a></p>
          <p>WHATSAPP US: +760-7500-0197 | SKYPE US: dfhhgffdfdgfgx.support</p>
          <p>We sent out this message to all existing Alena Traders. Please visit this page to know more about our Privacy Policy.</p>
          <p>&copy; 2024 Arena Trade 2012-2021. All Rights Reserved</p>
        </div>
      </div>
    </div>
  </body>
  </html>`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Please wait..");

    try {
      const formDataToSend = new FormData();

      // Append form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Append files
      Object.entries(imageFiles).forEach(([key, file]) => {
        if (file) {
          formDataToSend.append(key, file);
        }
      });

      const res = await axios.put(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/${
          loggedUser._id
        }/kyc-details`,
        {
          documentType: formData.documentType,
          countryOfIssue: formData.countryOfIssue,
          purpose: formData.purpose,
          occupation: formData.occupation,
          frontSideOfDocument: imageFiles.frontSideOfDocument,
          backSideOfDocument: imageFiles.backSideOfDocument,
          selfieWithDocument: imageFiles.selfieWithDocument,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const customMailRes = await axios.post(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/custom-mail`,
        {
          email: loggedUser.email,
          content: customContent,
          subject: "Kyc Submitted",
        }
      );

      console.log("res--", res.data);
      getUpdateLoggedUser();
      toast.success("Details updated", { id: toastId });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong!!", { id: toastId });
    }
  };

  useEffect(() => {
    const getFullImageUrl = (path) => {
      if (!path) return "";
      return path.startsWith("http")
        ? path
        : `${import.meta.env.VITE_BECKEND_END_POINT}/${path.replace(
            /\\/g,
            "/"
          )}`;
    };

    setImagePreviews({
      "Front Side of Document": getFullImageUrl(
        loggedUser?.kycDetails?.frontSideOfDocument || ""
      ),
      "Back Side of Document": getFullImageUrl(
        loggedUser?.kycDetails?.backSideOfDocument || ""
      ),
      "Selfie with Document": getFullImageUrl(
        loggedUser?.kycDetails?.selfieWithDocument || ""
      ),
    });
  }, [loggedUser]);

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-7xl mx-auto bg-secondary-700/30 rounded-2xl"
    >
      {loggedUser.kycDetails && (
        <div className=" flex gap-2  font-semibold pt-5 items-center justify-center">
          <h1 className=" text-lg">Status :</h1>
          {loggedUser?.kycVerified === false ? (
            <div className=" flex gap-1 bg-yellow-600/10 text-yellow-500 px-5 py-2 rounded-full ">
              <Loader></Loader>
              <p>Pending</p>
            </div>
          ) : (
            <div className=" flex gap-1 bg-green-600/10 text-green-500 px-5 py-2 rounded-full ">
              <CheckCircle2></CheckCircle2>
              <p>Approved</p>
            </div>
          )}
        </div>
      )}
      <div className="text-white p-6 rounded-xl">
        {/* Dropdown Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <DropdownField
            label="Purpose"
            options={purposes}
            value={formData.purpose}
            onChange={(value) => handleDropdownChange("purpose", value)}
          />
          <DropdownField
            label="Occupation"
            options={occupations}
            value={formData.occupation}
            onChange={(value) => handleDropdownChange("occupation", value)}
          />
          <DropdownField
            label="Document Type"
            options={documentTypes}
            value={formData.documentType}
            onChange={(value) => handleDropdownChange("documentType", value)}
          />
          <DropdownField
            label="Country of Issue"
            options={countries}
            value={formData.countryOfIssue}
            onChange={(value) => handleDropdownChange("countryOfIssue", value)}
          />
        </div>

        {/* Image Upload Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
          {Object.keys(imagePreviews).map((label) => (
            <ImageUploadField
              key={label}
              label={label}
              onFileChange={handleFileChange}
            />
          ))}
        </div>

        {/* Image Previews */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-6">
          <AnimatePresence>
            {Object.entries(imagePreviews).map(([label, preview]) =>
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

        {/* Submit Button */}
        <div className="flex items-center justify-center mt-8">
          <motion.button
            type="submit"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors duration-300 shadow-lg"
          >
            Update KYC Verification
          </motion.button>
        </div>
      </div>

      {/* Full Screen Modal */}
      <AnimatePresence>
        {fullScreenImage && (
          <FullScreenModal
            image={fullScreenImage}
            onClose={() => setFullScreenImage(null)}
          />
        )}
      </AnimatePresence>
    </form>
  );
};

export default UserKycDetails;
