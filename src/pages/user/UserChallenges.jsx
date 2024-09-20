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

const UserChallenges = () => {
  const [challengesData, setChallengesData] = useState();
  const [selectedchallenge, setSelectedChallenge] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loader, setLoader] = useState(false);

  const fetchChallengesData = async () => {
    setLoader(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/get-challenges`
      );
      // console.log("challenges res--", res.data.data);
      setChallengesData(res.data.data.reverse());
      setLoader(false);
    } catch (error) {
      console.log("error in fetch user challenges", error);
      toast.error("Data fetching failed!!");
      setLoader(false);
    }
  };

  const handleMoreInfo = (value) => {
    setIsDialogOpen(true);
    setSelectedChallenge(value);
  };

  useEffect(() => {
    fetchChallengesData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 bg-secondary-800 rounded-lg shadow-lg overflow-x-auto">
      <table className="w-full border-collapse min-w-[640px]">
        <thead>
          <tr className="bg-secondary-600 rounded text-white">
            <th className="p-2 sm:p-3 text-left font-semibold rounded-tl-lg">
              Account No
            </th>
            <th className="p-2 sm:p-3 text-center font-semibold">
              Account Type
            </th>
            <th className="p-2 sm:p-3 text-center font-semibold">
              Deposit amount
            </th>
            <th className="p-2 sm:p-3 text-center font-semibold">
              Account Size
            </th>
            <th className="p-2 sm:p-3 text-center font-semibold">Balance</th>
            <th className="p-2 sm:p-3 text-center font-semibold">Phase</th>
            <th className="p-2 sm:p-3 text-center font-semibold">
              Dropdown status
            </th>
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
                <div className="flex justify-center items-center w-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary-400"></div>
                </div>
              </td>
            </tr>
          )}

          {challengesData?.map((value, index) => (
            <tr
              key={index}
              className="border-b border-gray-200 hover:bg-secondary-700/60 transition-colors"
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
              <td className="p-2 text-center sm:p-3 text-sm sm:text-base">
                {value?.balance}
              </td>
              <td className="p-2 text-center sm:p-3 text-sm sm:text-base">
                {value?.phase}
              </td>
              <td className="p-2 first-letter:capitalize text-center whitespace-nowrap sm:p-3 text-sm sm:text-base">
                {value?.reason}
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
