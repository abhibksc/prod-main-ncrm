import React from "react";
import { Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const UserDashboardBanner = () => {
  const loggedUser = useSelector((store) => store.user.loggedUser);
  return (
    <div className="bg-gradient-to-br from-secondary-700 to-secondary-800 text-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-4">
        Welcome {loggedUser?.firstName + " " + loggedUser?.lastName}
      </h1>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">
            Ready for Your First Challenge?
          </h2>
          <p className="text-sm opacity-80">
            We recommend checking the FAQ section before starting a challenge.
          </p>
        </div>
        <Trophy className="w-12 h-12 text-yellow-300" />
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {loggedUser.phase === 0 && (
          <Link to={"/user/new-challenge"}>
            <button className="bg-white text-secondary-600 py-2 px-4 rounded-full font-medium hover:bg-opacity-90 transition-colors">
              New Challenge
            </button>
          </Link>
        )}
        <Link to={"/user/rules"}>
          <button className="bg-secondary-600 py-2 px-4 rounded-full font-medium hover:bg-secondary-600/80 transition-colors">
            Trading Rules
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UserDashboardBanner;
