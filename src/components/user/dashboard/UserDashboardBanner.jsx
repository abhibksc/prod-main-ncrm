import React from "react";
import { Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const circleVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: { scale: 1, opacity: 1, transition: { duration: 0.4, delay: 0.1 } },
};

const buttonVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (delay) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, delay },
  }),
};

const UserDashboardBanner = () => {
  const loggedUser = useSelector((store) => store.user.loggedUser);

  return (
    <motion.div
      className="bg-secondary-800/30 p-6 rounded-3xl shadow-lg w-full max-w-2xl mx-auto flex flex-col items-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="relative p-2 flex items-center justify-center w-40 h-40 bg-secondary-800/20 shadow-lg rounded-full mb-2"
        variants={circleVariants}
      >
        <Trophy className="absolute top-8 w-8 h-8 text-secondary-500 drop-shadow-md" />
        <div className="text-center mt-8">
          <h1 className="text-lg font-semibold text-white">
            Welcome{" "}
            <span className="text-secondary-500">
              {loggedUser?.firstName} {loggedUser?.lastName}
            </span>
          </h1>
        </div>
      </motion.div>

      <div className="flex flex-col items-center mb-4">
        <p className="text-sm text-secondary-300 font-medium text-center max-w-md">
          We’re excited to have you here! Visit our FAQ for helpful guidance.
        </p>
      </div>

      <motion.div
        className="flex flex-col sm:flex-row gap-3 justify-center"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.1 } },
        }}
      >
        <Link to={"/user/new-challenge"}>
          <motion.button
            className="bg-secondary-500 text-white py-2 px-5 rounded-full text-sm font-medium hover:bg-secondary-500/70 transition-all duration-300"
            variants={buttonVariants}
            custom={0.2}
          >
            Create An Account
          </motion.button>
        </Link>
        <Link to={"/user/challenges"}>
          <motion.button
            className="border border-secondary-500 text-white py-2 px-5 rounded-full text-sm font-medium hover:text-secondary-500 hover:bg-secondary-800/20 transition-all duration-300"
            variants={buttonVariants}
            custom={0.3}
          >
            Account Details
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default UserDashboardBanner;
