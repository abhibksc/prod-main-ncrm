import React, { useState } from "react";
import { Send, Mail, Clock, ArrowRight } from "lucide-react";

export default function UserCustomerSupport() {
  const [isHovered, setIsHovered] = useState(false);

  const handleSendMail = () => {
    const mailtoLink = `mailto:${
      import.meta.env.VITE_EMAIL_EMAIL
    }?subject=Customer%20Support%20Inquiry&body=Hello%20Support%20Team,`;
    window.location.href = mailtoLink;
  };

  return (
    <div className="flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-secondary-900/10 backdrop-blur-sm">
        <div className="absolute top-0 right-0 w-48 md:w-96 h-48 md:h-96 bg-secondary-500-20 rounded-full blur-3xl -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-48 md:w-96 h-48 md:h-96 bg-secondary-500-20 rounded-full blur-3xl translate-y-1/2"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        <div
          className="bg-gray-600/10 backdrop-blur-lg border border-gray-500/20 rounded-3xl shadow-2xl overflow-hidden transition-all duration-500"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="p-4 md:p-8">
            <div className="flex justify-center mb-6">
              <div className="bg-secondary-500-10 p-4 rounded-full">
                <Mail className="w-8 md:w-12 h-8 md:h-12 text-secondary-500/80" />
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-300 mb-4 text-center">
              Customer Support Center
            </h1>

            <p className="text-sm md:text-base text-gray-500 mb-8 text-center">
              Our dedicated email support team is committed to providing
              comprehensive and timely assistance for all your inquiries.
            </p>

            <div className="space-y-4 mb-6">
              <div className="bg-black/10 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                <div className="text-center sm:text-left">
                  <h3 className="text-base md:text-lg font-semibold text-gray-300">
                    Support Email
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500">
                    {import.meta.env.VITE_EMAIL_EMAIL}
                  </p>
                </div>
                <Mail className="w-6 md:w-8 h-6 md:h-8 text-blue-500 mt-2 sm:mt-0" />
              </div>

              <div className="bg-black/10 border border-white/10 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                <div className="text-center sm:text-left">
                  <h3 className="text-base md:text-lg font-semibold text-gray-300">
                    Response Times
                  </h3>
                  <p className="text-xs md:text-sm text-gray-500">
                    Weekdays (Mon-Sat): 8 AM to 8 PM
                  </p>
                </div>
                <Clock className="w-6 md:w-8 h-6 md:h-8 text-green-500 mt-2 sm:mt-0" />
              </div>

              <div className="bg-black/10 border border-white/10 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-base md:text-lg font-semibold text-gray-300">
                    How to Get Effective Support
                  </h3>
                </div>
                <ul className="list-disc list-inside text-gray-500 text-xs md:text-sm space-y-1">
                  <li>Provide a clear and concise description of your issue</li>
                  <li>Include any error messages or screenshots</li>
                  <li>
                    Describe steps you've already taken to resolve the problem
                  </li>
                  <li>Mention your system or product details</li>
                </ul>
              </div>
            </div>

            <a
              href={`mailto:${import.meta.env.VITE_EMAIL_EMAIL}`}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                w-full py-3 md:py-4 rounded-xl transition-all duration-500 flex items-center justify-center
                ${
                  isHovered
                    ? "bg-secondary-500-10 text-secondary-500/80"
                    : "bg-secondary-500-10 text-white/90"
                }
              `}
            >
              <Send
                className={`w-5 h-5 md:w-6 md:h-6 mr-3 transition-transform ${
                  isHovered ? "rotate-12" : ""
                }`}
              />
              Send Support Email
              {isHovered && (
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6 ml-2 opacity-0 animate-pulse" />
              )}
            </a>
          </div>
        </div>

        <div className="text-center text-gray-500 mt-4 text-xs md:text-sm">
          We strive to provide the most helpful support possible
          <div className="text-xs mt-1">
            Your satisfaction is our top priority
          </div>
        </div>
      </div>
    </div>
  );
}
