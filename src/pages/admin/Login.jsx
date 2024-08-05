import React, { useState } from "react";

const Login = () => {
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center p-5 bg-dotted bg-cover bg-primary-700 bg-blend-overlay">
      <div className="bg-white rounded-xl shadow-2xl flex flex-col md:flex-row w-full max-w-4xl overflow-hidden">
        {/* Left side with wave */}
        <div className="w-full md:w-1/2 bg-primary-500/90 text-white flex flex-col justify-center relative overflow-hidden">
          <img
            className="h-full w-full bg-transparent rounded"
            src="/login-illu.jpg"
            alt=""
          />
        </div>

        {/* Right side with form */}
        <div className="w-full md:w-1/2 p-12 bg-primary-500">
          {showForgotPassword ? (
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">
                Forgot Password
              </h2>
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="forgot-email"
                    className="block text-sm font-medium text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="forgot-email"
                    name="forgot-email"
                    required
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-300 hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-150 ease-in-out"
                  >
                    Send Reset Link
                  </button>
                </div>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-medium text-white hover:text-primary-100"
                    onClick={() => setShowForgotPassword(false)}
                  >
                    Back to Login
                  </a>
                </div>
              </form>
            </div>
          ) : (
            <div>
              <h2 className="text-3xl font-bold text-white mb-8">Login</h2>
              <form className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-white"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-white"
                  >
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    required
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label
                      htmlFor="remember-me"
                      className="ml-2 block text-sm text-white"
                    >
                      Remember me
                    </label>
                  </div>
                  <div className="text-sm">
                    <a
                      href="#"
                      className="font-medium text-white hover:text-primary-100"
                      onClick={() => setShowForgotPassword(true)}
                    >
                      Forgot your password?
                    </a>
                  </div>
                </div>
                <div>
                  <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-300 hover:bg-primary-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition duration-150 ease-in-out"
                  >
                    Sign in
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
