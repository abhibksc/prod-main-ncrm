import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { CheckCircle, Mail, XCircle } from "lucide-react";
import ModernHeading from "@/lib/ModernHeading";
import { backendApi } from "@/utils/apiClients";
import { useSelector } from "react-redux";

const UserVerify = () => {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [userData, setUserData] = useState("");
  const siteConfig = useSelector((state) => state.user.siteConfig);

  //   enitial UI --------------

  const [cooldownTime, setCooldownTime] = useState(5);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    let timer;
    if (cooldownTime > 0 && isButtonDisabled) {
      timer = setTimeout(() => setCooldownTime(cooldownTime - 1), 1000);
    } else if (cooldownTime === 0 && isButtonDisabled) {
      setIsButtonDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [cooldownTime, isButtonDisabled]);

  const resendHandler = async () => {
    const toastId = toast.loading("Plese wait..");

    try {
      const res = await backendApi.get(`/get-user?id=${id}`);
      await backendApi.post(`/send-link`, {
        userId: id,
        email: res.data.data.email,
      });
      setCooldownTime(60);
      setIsButtonDisabled(true);
      toast.success(`Verification link sent to ${res.data.data.email}`, {
        id: toastId,
      });
    } catch (error) {
      console.log("error in fetching user--", error);
      toast.error("Something went wrong", { id: toastId });
    }
  };

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
      <h1>Account Verified</h1>
    </div>
    <div class="content">
      <p>Dear ${userData?.firstName + " " + userData?.lastName},</p>
        <p style="font-size: 12px;">Your email has been successfully verified. You can now securely log in to your account and access all available features. If you experience any issues during login, please don't hesitate to reach out for assistance. Thank you for completing the verification process.</p>
           <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f8f8f8; border-left: 4px solid #2d6a4f; padding: 20px; margin: 30px 0;">
          <tr>
            <td>
              <p style="margin: 10px 0; font-size: 13px;">Name: <span style="font-weight: bold; color: #0a2342;">${
                userData?.firstName + " " + userData.lastName
              }</span></p>
              <p style="margin: 10px 0; font-size: 13px;">Username: <span style="font-weight: bold; color: #0a2342;">${
                userData?.email
              }</span></p>
            </td>
          </tr>
        </table>

          <p>Thank you for choosing us.</p>
          <p>Happy trading!</p>

          <p>Best regards,<br>${import.meta.env.VITE_WEBSITE_NAME} Team</p>
           <h2 style="text-align: center; color: #19422df2; margin: 10px 0 10px; font-size: 24px;">Download Our Trading App</h2>
        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f0f8ff; margin: 20px 0; border-radius: 15px;">
          <tr>
            <td align="center" style="padding: 20px;">
              <table cellpadding="0" cellspacing="0" border="0" width="100%">
                <tr>
                  <td align="center" width="33%" style="padding: 0 10px;">
                    <a href=${
                      siteConfig?.androidDL
                    } style="display: inline-block; text-decoration: none; color: #ffffff; background-color: #2d6a4f; padding: 15px 20px; border-radius: 8px; font-weight: bold; transition: background-color 0.3s;">
                      <img src="https://cdn-icons-png.flaticon.com/512/14/14415.png" alt="Android" width="24" height="24" style="vertical-align: middle; margin-right: 10px;">
                      <span style="vertical-align: middle;">Android</span>
                    </a>
                  </td>
                  <td align="center" width="33%" style="padding: 0 10px;">
                    <a href=${
                      siteConfig?.iosDL
                    } style="display: inline-block; text-decoration: none; color: #ffffff; background-color: #2d6a4f; padding: 15px 20px; border-radius: 8px; font-weight: bold; transition: background-color 0.3s;">
                      <img src="https://cdn3.iconfinder.com/data/icons/social-media-logos-glyph/2048/5315_-_Apple-512.png" alt="iOS" width="24" height="24" style="vertical-align: middle; margin-right: 10px;">
                      <span style="vertical-align: middle;">iOS</span>
                    </a>
                  </td>
                  <td align="center" width="33%" style="padding: 0 10px;">
                    <a href=${
                      siteConfig?.windowsDL
                    } style="display: inline-block; text-decoration: none; color: #ffffff; background-color: #2d6a4f; padding: 15px 20px; border-radius: 8px; font-weight: bold; transition: background-color 0.3s;">
                      <img src="https://cdn-icons-png.flaticon.com/512/71/71753.png" alt="Windows" width="24" height="24" style="vertical-align: middle; margin-right: 10px;">
                      <span style="vertical-align: middle;">Windows</span>
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

 <div class="risk-warning">
  <strong>Risk Warning:</strong> Trading CFDs carries high risk and may result in losses beyond your initial investment. Trade only with money you can afford to lose and understand the risks.
  <br><br>
  Our services are not for U.S. citizens or in jurisdictions where they violate local laws.
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

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const verifyRes = await backendApi.post(`/verify-link`, {
          userId: id,
          token: token,
        });
        const userRes = await backendApi.get(`/get-user?id=${id}`);
        setUserData(userRes.data.data);

        setVerificationStatus("success");
        setTimeout(() => navigate("/user/login"), 5000); // Redirect to login after 5 seconds
      } catch (error) {
        setVerificationStatus("error");
        console.log("error while verifying--", error);
      } finally {
        setLoading(false);
      }
    };

    if (token !== "000") {
      verifyEmail();
    }
  }, []);

  useEffect(() => {
    if (userData) {
      const sendCustomMail = async () => {
        try {
          const customMailRes = await backendApi.post(`/custom-mail`, {
            email: userData.email,
            content: customContent,
            subject: "Account Verified",
          });
        } catch (error) {
          console.log("Error sending custom mail:", error);
        }
      };

      sendCustomMail();
    }
  }, [userData]); // Runs when userData changes

  if (token === "000") {
    return (
      <div className="flex items-center px-5 justify-center min-h-screen bg-gray-900">
        <Toaster></Toaster>
        <div className="max-w-md w-full bg-gray-800/80 shadow-lg rounded-lg overflow-hidden border border-gray-700">
          <div className="bg-secondary-800/30 p-4 flex items-center justify-center">
            <Mail className="text-secondary-500 w-12 h-12" />
          </div>
          <div className="p-6">
            <div className=" mb-4">
              <ModernHeading text={"Verify Your Email"}></ModernHeading>
            </div>
            <p className="text-gray-300 mb-6">
              We've sent a verification link to your email address. Please check
              your inbox and click the link to activate your account.
            </p>
            <div className="bg-green-700/20 border-l-4 border-green-500 p-4 mb-6">
              <p className="text-white font-medium">
                <CheckCircle className="inline-block w-5 h-5 mr-2" />
                Link sent successfully!
              </p>
            </div>
            <div className="space-y-4">
              <button
                className={`block w-full text-center ${
                  isButtonDisabled
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "border-secondary-500/90 border hover:border-[2px] hover:my-8  transition-all text-gray-100"
                } font-semibold py-2 px-4 rounded transition duration-300 ease-in-out`}
                onClick={resendHandler}
                disabled={isButtonDisabled}
              >
                {isButtonDisabled
                  ? `Resend in ${cooldownTime}s`
                  : "Resend Verification Email"}
              </button>
              <Link className="" to={"/user/login"}>
                <button className="bg-secondary-500-90 block w-full mt-5 hover:bg-secondary-500-70 text-gray-100 font-semibold py-2 px-4 rounded transition duration-300 ease-in-out">
                  Go to Login
                </button>
              </Link>
            </div>
          </div>
          <div className=" bg-gray-900/40 px-6 py-4">
            <p className="text-sm text-gray-400">
              Didn't receive the email? Check your spam folder or contact
              support .
            </p>
          </div>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
          <h2 className="mt-4 text-2xl text-white font-semibold">
            Verifying your email...
          </h2>
          <p className="mt-2 text-gray-300">This may take a few moments.</p>
        </div>
      );
    }

    if (verificationStatus === "success") {
      return (
        <div className="bg-green-100 border-l-4 border-green-500 p-4 sm:p-6 md:p-8 w-full max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-start sm:items-center">
            <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
              <CheckCircle className="h-6 w-6 text-green-500" />
            </div>
            <div className="flex-grow">
              <p className="text-sm sm:text-base font-medium text-green-800">
                Success! Your email has been successfully verified.
              </p>
              <p className="mt-2 text-sm sm:text-base text-green-700">
                You will be redirected to the login page in 5 seconds.
              </p>
              <button
                onClick={() => navigate("/user/login")}
                className="mt-4 w-full sm:w-auto bg-green-600 hover:bg-green-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out text-sm sm:text-base"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-red-100 border-l-4 border-red-500 p-4 sm:p-6 md:p-8 w-full max-w-2xl mx-auto">
        <Toaster />
        <div className="flex flex-col sm:flex-row items-start sm:items-center">
          <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
            <XCircle className="h-6 w-6 text-red-500" />
          </div>
          <div className="flex-grow">
            <p className="text-sm sm:text-base font-medium text-red-800">
              Verification Failed
            </p>
            <p className="mt-2 text-sm sm:text-base text-red-700">
              The verification link may be invalid or expired. Please try again
              or contact support.
            </p>
            <button
              onClick={resendHandler}
              className="mt-4 w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 ease-in-out text-sm sm:text-base"
            >
              Resend Verification Email
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-secondary-900">
      <div className="max-w-md w-full p-8 bg-secondary-800/40 rounded-lg shadow-lg">
        <div className=" mb-8">
          <ModernHeading text={" Email Verification"}></ModernHeading>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default UserVerify;
