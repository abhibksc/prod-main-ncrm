import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info } from "lucide-react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ModernHeading from "@/lib/ModernHeading";

const UserChallenges = () => {
  const [selectedchallenge, setSelectedChallenge] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const logggedUser = useSelector((store) => store.user.loggedUser);
  // format date ---------------------

  function formatDate(isoDateString) {
    const date = new Date(isoDateString);

    const formattedDate = date.toLocaleDateString("en-GB", {
      year: "numeric",
      day: "2-digit",
      month: "2-digit",
    });

    const formattedTime = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true, // 12-hour format with AM/PM
    });

    return `${formattedDate}, ${formattedTime}`;
  }
  // since joined ---------------

  function calculateTimeSinceJoined(isoDateString) {
    const joinDate = new Date(isoDateString);
    const today = new Date();

    // Calculate the difference in time (in milliseconds)
    const timeDifference = today - joinDate;

    // Calculate different time units
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (timeDifference % (1000 * 60 * 60)) / (1000 * 60)
    );

    // Build the time string
    let timeString = [];

    if (days > 0) {
      timeString.push(`${days} day${days !== 1 ? "s" : ""}`);
    }
    if (hours > 0) {
      timeString.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
    }
    if (minutes > 0) {
      timeString.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
    }

    // Handle case when less than a minute
    if (timeString.length === 0) {
      return "less than a minute ago";
    }

    return timeString.join(", ") + " ago";
  }

  const handleMoreInfo = (value) => {
    setIsDialogOpen(true);
    setSelectedChallenge(value);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="mx-auto rounded-lg shadow-lg overflow-x-auto user-custom-scrollbar "
    >
      <div className="mb-6">
        <ModernHeading text={"MT5 Accounts"}></ModernHeading>
      </div>
      <motion.table
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="w-full border-collapse min-w-[640px]"
      >
        <thead>
          <tr className="bg-secondary-500/50 whitespace-nowrap rounded text-white">
            {/* Table headers remain the same */}
            <th className="p-2 sm:p-3 text-left font-semibold rounded-tl-lg">
              AC NO:
            </th>
            <th className="p-2 sm:p-3 text-center font-semibold">Type</th>
            <th className="p-2 sm:p-3 text-center font-semibold">Leverage</th>
            <th className="p-2 sm:p-3 text-center font-semibold">
              MasterPassword
            </th>
            <th className="p-2 sm:p-3 text-center font-semibold">
              InvestorPassword
            </th>
            <th className="p-2 sm:p-3 text-center font-semibold">Platform</th>
            <th className="p-2 sm:p-3 text-center font-semibold">Timestamp</th>
            <th className="p-2 sm:p-3 text-left font-semibold rounded-tr-lg">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {logggedUser.accounts?.map((value, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{
                  delay: index * 0.1,
                  duration: 0.3,
                }}
                className="border-b whitespace-nowrap border-secondary-700/50 hover:bg-secondary-700/40 transition-colors"
              >
                {/* Table row content remains the same */}
                <td className="p-2 sm:p-3 text-sm sm:text-base">
                  {value?.accountNumber}
                </td>
                <td className="p-2 sm:p-3 text-sm sm:text-base text-center ">
                  {value?.accountType}
                </td>
                <td className="p-2 text-center sm:p-3 text-sm sm:text-base">
                  {value?.leverage}
                </td>
                <td className="p-2 text-center sm:p-3 text-sm sm:text-base">
                  {value?.masterPassword}
                </td>
                <td className="p-2 text-center sm:p-3 text-sm sm:text-base">
                  {value?.investorPassword}
                </td>
                <td className="p-2 text-center sm:p-3 text-sm sm:text-base">
                  {value?.platform || "NULL"}
                </td>
                <td className="py-3 text-center px-4">
                  <div>{formatDate(value?.createdAt)}</div>
                  <div className="text-sm text-gray-400">
                    {calculateTimeSinceJoined(value?.createdAt)}
                  </div>
                </td>
                <td className="p-2 sm:p-3 text-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <button
                      onClick={() => handleMoreInfo(value)}
                      className="text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      <Info />
                    </button>
                  </motion.div>
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </motion.table>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AnimatePresence>
          {isDialogOpen && (
            <AlertDialogContent
              as={motion.div}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              {/* Dialog content remains the same */}
              <AlertDialogHeader>
                <AlertDialogTitle className=" ">{"More info"}</AlertDialogTitle>
                <AlertDialogDescription>
                  {true && (
                    <div className=" flex gap-[2px] font-semibold flex-col">
                      <p>Mt5 Amount - {selectedchallenge?.accountNumber}</p>
                      <p>Leverage - {selectedchallenge?.leverage}</p>
                      <div className=" flex gap-4">
                        <p>
                          Master password - {selectedchallenge?.masterPassword}
                        </p>
                        <Link
                          to={"/user/master-password"}
                          className=" text-blue-500 hover:text-blue-700 hover:scale-110 transition-all"
                        >
                          change
                        </Link>
                      </div>
                      <div className=" flex gap-4">
                        <p>
                          Investar password -{" "}
                          {selectedchallenge?.investorPassword}
                        </p>
                        <Link
                          to={"/user/investor-password"}
                          className=" text-blue-500 hover:text-blue-700 hover:scale-110 transition-all"
                        >
                          change
                        </Link>
                      </div>
                    </div>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          )}
        </AnimatePresence>
      </AlertDialog>
    </motion.div>
  );
};

export default UserChallenges;
