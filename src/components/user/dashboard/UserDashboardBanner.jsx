import React from "react";
import { Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const UserDashboardBanner = () => {
  const loggedUser = useSelector((store) => store.user.loggedUser);

  return (
    <div className="bg-gradient-to-br from-secondary-800 to-secondary-800/30 text-white p-8 rounded-xl shadow-xl max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Welcome,{" "}
        <span className="text-secondary-500">
          {loggedUser?.firstName} {loggedUser?.lastName}
        </span>
      </h1>
      <div className="flex items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-semibold mb-2">
            Ready for Your First Challenge?
          </h2>
          <p className="text-sm text-secondary-300 leading-relaxed">
            Before you begin, check out our FAQ section for helpful tips and
            guidance.
          </p>
        </div>
        <div className="flex-shrink-0">
          <Trophy className="w-14 h-14 text-secondary-500 drop-shadow-md" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {loggedUser.phase === 0 && (
          <Link to={"/user/new-challenge"}>
            <button className="bg-secondary-700/80 text-white py-3 px-6 rounded-full font-semibold shadow hover:bg-secondary-500 transition-all duration-300">
              Start New Challenge
            </button>
          </Link>
        )}
        <Link to={"/user/rules"}>
          <button className="bg-secondary-700/90 text-white py-3 px-6 rounded-full font-semibold shadow hover:bg-secondary-700/70 hover:shadow-lg transition-all duration-300">
            Trading Rules
          </button>
        </Link>
      </div>
    </div>
  );
};

export default UserDashboardBanner;
