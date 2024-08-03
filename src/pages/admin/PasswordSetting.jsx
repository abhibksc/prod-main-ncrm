import { UserCog2 } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const PasswordSetting = () => {
  return (
    <div className="container mx-auto px-10 py-5">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Password Setting</h1>
        <Link
          to={"/admin/profile-setting"}
          className="text-white border border-primary-400 px-4 py-2 rounded-md hover:bg-primary-400"
        >
          Profile Setting
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="bg-primary-700 text-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-primary-500 p-2">
              <h2 className="text-white text-center text-xl font-semibold">
                Super Admin
              </h2>
            </div>
            <div className="p-4">
              <div className="mb-2">
                <span className=" text-sm">Name</span>
                <p className="font-semibold">: Super Admin</p>
              </div>
              <div className="mb-2">
                <span className=" text-sm">Username</span>
                <p className="font-semibold">: admin</p>
              </div>
              <div>
                <span className=" text-sm">Email</span>
                <p className="font-semibold">: admin@gmail.com</p>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-2">
          <div className="bg-primary-700 text-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Change Password</h2>
            <form>
              <div className="mb-4">
                <label
                  className="block  text-sm font-bold mb-2"
                  htmlFor="password"
                >
                  Password *
                </label>
                <input
                  className="shadow text-black appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  type="password"
                  placeholder="Enter current password"
                />
              </div>
              <div className="mb-4">
                <label
                  className="block  text-sm font-bold mb-2"
                  htmlFor="newPassword"
                >
                  New Password *
                </label>
                <input
                  className="shadow text-black appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                />
              </div>
              <div className="mb-6">
                <label
                  className="block  text-sm font-bold mb-2"
                  htmlFor="confirmPassword"
                >
                  Confirm Password *
                </label>
                <input
                  className="shadow appearance-none border text-black rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline"
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                />
              </div>
              <button
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                type="submit"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordSetting;
