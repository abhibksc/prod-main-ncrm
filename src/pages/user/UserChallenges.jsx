import React, { useEffect, useState } from "react";
import { CheckCircle, Edit, Info } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import axios from "axios";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import DynamicLoder from "@/components/Loader/DynamicLoder";

const UserChallenges = () => {
  const [challengesData, setChallengesData] = useState();
  const [selectedchallenge, setSelectedChallenge] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loader, setLoader] = useState(false);
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

  const fetchChallengesData = async () => {
    setLoader(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/get-challenges`
      );
      // console.log("challenges res--", res.data.data);
      const loggedUserData = res.data.data
        .reverse()
        .filter((value) => value?.userId?._id === logggedUser?._id);

      setChallengesData(loggedUserData);
      setLoader(false);
    } catch (error) {
      console.log("error in fetch user challenges", error);
      toast.error("Data fetching failed!!");
      setLoader(false);
    }
  };
  console.log("challenges data --", challengesData);

  const handleMoreInfo = (value) => {
    setIsDialogOpen(true);
    setSelectedChallenge(value);
  };
  useEffect(() => {
    fetchChallengesData();
  }, []);

  return (
    <div className=" mx-auto sm:p-6 bg-secondary-800/20 rounded-lg shadow-lg overflow-x-auto">
      <table className="w-full border-collapse min-w-[640px]">
        <thead>
          <tr className="bg-secondary-700 rounded text-white">
            <th className="p-2 sm:p-3 text-left font-semibold rounded-tl-lg">
              AC NO:
            </th>
            <th className="p-2 sm:p-3 text-center font-semibold">Type</th>
            <th className="p-2 sm:p-3 text-center font-semibold">Deposit</th>
            <th className="p-2 sm:p-3 text-center font-semibold">
              Account Size
            </th>
            {/* <th className="p-2 sm:p-3 text-center font-semibold">Balance</th> */}
            <th className="p-2 sm:p-3 text-center font-semibold">Phase</th>
            <th className="p-2 sm:p-3 text-center font-semibold">
              Dropdown status
            </th>
            <th className="p-2 sm:p-3 text-center font-semibold">Updated At</th>
            <th className="p-2 sm:p-3 text-center font-semibold">Status</th>
            <th className="p-2 sm:p-3 text-left font-semibold rounded-tr-lg">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {loader && (
            <tr>
              <td colSpan="9" className="p-4">
                <DynamicLoder></DynamicLoder>
              </td>
            </tr>
          )}

          {challengesData?.map((value, index) => (
            <tr
              key={index}
              className="border-b border-secondary-700/50 hover:bg-secondary-700/40 transition-colors"
            >
              <td className="p-2 sm:p-3 text-sm sm:text-base">
                {value?.mt5Account}
              </td>
              <td className="p-2 sm:p-3 text-sm sm:text-base text-center ">
                {value?.type}
              </td>
              <td className="p-2 text-center sm:p-3 text-sm sm:text-base">
                {value?.deposit}
              </td>
              <td className="p-2 text-center sm:p-3 text-sm sm:text-base">
                {value?.accountSize}
              </td>
              {/* <td className="p-2 text-center sm:p-3 text-sm sm:text-base">
                {value?.balance}
              </td> */}
              <td className="p-2 text-center sm:p-3 text-sm sm:text-base">
                {value?.phase}
              </td>
              <td className="p-2 first-letter:capitalize text-center whitespace-nowrap sm:p-3 text-sm sm:text-base">
                {value?.reason}
              </td>
              <td className="py-3 text-center px-4">
                <div>{formatDate(value?.updatedAt)}</div>
                <div className="text-sm text-gray-400">
                  {calculateTimeSinceJoined(value?.updatedAt)}
                </div>
              </td>
              <td className="text-center py-2 px-2">
                <div
                  className={`inline-block px-2 py-1 font-semibold rounded-full ${
                    value?.status === "active"
                      ? "bg-green-500/20 text-green-500"
                      : " bg-red-500/20  text-red-400"
                  }`}
                >
                  <p className="first-letter:capitalize">{value?.status}</p>
                </div>
              </td>{" "}
              <td className="p-2 sm:p-3 text-center">
                <button
                  onClick={() => handleMoreInfo(value)}
                  className="text-blue-500 hover:text-blue-600 transition-colors"
                >
                  <Info></Info>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className=" ">{"More info"}</AlertDialogTitle>
              <AlertDialogDescription>
                {true && (
                  <div className=" flex gap-[2px] font-semibold flex-col">
                    <p>Mt5 Amount - {selectedchallenge?.mt5Account}</p>
                    <p>Leverage - {selectedchallenge?.leverage}</p>
                    <div className=" flex gap-4">
                      <p>
                        Master password - {selectedchallenge?.masterPassword}
                      </p>
                      {(selectedchallenge?.phase === "1") &
                      (selectedchallenge.status === "active") ? (
                        <Link
                          to={"/user/master-password"}
                          className=" text-blue-500 hover:text-blue-700 hover:scale-110 transition-all"
                        >
                          change
                        </Link>
                      ) : (
                        ""
                      )}
                    </div>
                    <div className=" flex gap-4">
                      <p>
                        Investar password -{" "}
                        {selectedchallenge?.investarPassword}
                      </p>
                      {(selectedchallenge?.phase === "1") &
                      (selectedchallenge.status === "active") ? (
                        <Link
                          to={"/user/investor-password"}
                          className=" text-blue-500 hover:text-blue-700 hover:scale-110 transition-all"
                        >
                          change
                        </Link>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsDialogOpen(false)}>
                Cancel
              </AlertDialogCancel>
              {/* <AlertDialogAction
                onClick={() => handleConfirmAction(selectedDeposit)}
              >
                Confirm {actionType === "approve" ? "Approval" : "Rejection"}
              </AlertDialogAction> */}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default UserChallenges;
