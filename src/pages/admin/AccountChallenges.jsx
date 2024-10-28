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

const AccountChallenges = () => {
  const [challengesData, setChallengesData] = useState();
  const [selectedChallenge, setSelectedChallenge] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loader, setLoader] = useState(false);

  const fetchChallengesData = async () => {
    setLoader(true);
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/get-challenges`
      );
      setChallengesData(res.data.data.reverse());
      setLoader(false);
    } catch (error) {
      console.log("error in fetch user challenges", error);
      toast.error("Data fetching failed!");
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
    <div className=" m-5 px-10 bg-primary-700 text-white rounded-xl shadow-2xl">
      <h2 className="text-3xl font-bold mb-6">Account Challenges</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse min-w-[640px]">
          <thead>
            <tr className="bg-primary-600 rounded text-white">
              <th className="p-3 text-left font-semibold rounded-tl-lg">
                Account No
              </th>
              <th className="p-3 text-center font-semibold">Account Type</th>
              <th className="p-3 text-center font-semibold">Account Size</th>
              <th className="p-3 text-center font-semibold">Balance</th>
              <th className="p-3 text-center font-semibold rounded-tr-lg">
                Leverage
              </th>
              <th className="p-3 text-center font-semibold">Phase</th>
              <th className="p-3 text-center font-semibold">Dropdown Status</th>
              <th className="p-3 text-center font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {loader ? (
              <tr>
                <td colSpan="9" className="p-4">
                  <div className="flex justify-center items-center w-full">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-300"></div>
                  </div>
                </td>
              </tr>
            ) : (
              challengesData?.map((value, index) => (
                <tr
                  key={index}
                  className="border-b border-primary-200 hover:bg-primary-50 transition-colors"
                >
                  <td className="p-3 text-sm">{value?.mt5Account}</td>
                  <td className="p-3 text-sm text-center">{value?.type}</td>
                  <td className="p-3 text-sm text-center">
                    {value?.accountSize}
                  </td>
                  <td className="p-3 text-sm text-center">{value?.balance}</td>
                  <td className="p-3 text-sm text-center">{value?.leverage}</td>
                  <td className="p-3 text-sm text-center">{value?.phase}</td>
                  <td className="p-3 text-sm text-center capitalize">
                    {value?.reason}
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-3 py-1 text-xs font-medium rounded-full ${
                        value?.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {value?.status}
                    </span>
                  </td>
                  {/* <td className="p-3 text-center">
                    <button
                      onClick={() => handleMoreInfo(value)}
                      className="text-blue-500 hover:text-blue-800 hover:scale-110 transition-colors"
                    >
                      <Info size={18} />
                    </button>
                  </td> */}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent className="bg-white rounded-lg shadow-xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold text-white">
              Challenge Details
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedChallenge && (
                <div className="space-y-2 ">
                  <p>
                    <span className="font-semibold">MT5 Account:</span>{" "}
                    {selectedChallenge.mt5Account}
                  </p>
                  <p>
                    <span className="font-semibold">Leverage:</span>{" "}
                    {selectedChallenge.leverage}
                  </p>
                  <div className="flex justify-between items-center">
                    <p>
                      <span className="font-semibold">Master Password:</span>{" "}
                      {selectedChallenge.masterPassword}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p>
                      <span className="font-semibold">Investor Password:</span>{" "}
                      {selectedChallenge.masterPassword}
                    </p>
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-primary-100 text-primary-800 hover:bg-primary-200 transition-colors"
              onClick={() => setIsDialogOpen(false)}
            >
              Close
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AccountChallenges;
