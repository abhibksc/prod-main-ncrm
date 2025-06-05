import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, Loader2 } from "lucide-react";
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
import {
  CFcalculateTimeSinceJoined,
  CFformatDate,
} from "@/utils/CustomFunctions";
// import { useGetMultipleIdInfo } from "@/hooks/user/UseGetMultipleIdInfo";
import { useGetInfoByAccounts } from "@/hooks/user/UseGetInfoByAccounts";
// import { useSocketInfoByAccounts } from "@/hooks/user/UseSocketInfoByAcccounts";

const UserChallenges = () => {
  const [selectedchallenge, setSelectedChallenge] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const siteConfig = useSelector((store) => store.user.siteConfig);
  const logggedUser = useSelector((store) => store.user.loggedUser);
  const accountIds =
    logggedUser?.accounts?.map((acc) => +acc.accountNumber) || [];
  useGetInfoByAccounts(accountIds, "accounts");
  const { accountsData } = useSelector((store) => store.user);
  // console.log("liveData---", liveData);
  // const socketData = useSocketInfoByAccounts(accountIds);
  // console.log("socketData 2", socketData);
  // console.log("liveData", liveData);
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
          <tr className="bg-secondary-500-50 whitespace-nowrap rounded text-white">
            <th className="p-2 sm:p-3 text-left font-semibold rounded-tl-lg">
              AC NO:
            </th>
            <th className="p-2 sm:p-3 text-center font-semibold">Type</th>
            <th className="p-2 sm:p-3 text-center font-semibold">Leverage</th>
            <th className="p-2 sm:p-3 text-center font-semibold">Balance</th>
            <th className="p-2 sm:p-3 text-center font-semibold">
              Live Equity
            </th>
            <th className="p-2 sm:p-3 text-center font-semibold">P/L</th>
            <th className="p-2 sm:p-3 text-center font-semibold">Timestamp</th>
            <th className="p-2 sm:p-3 text-left font-semibold rounded-tr-lg">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <AnimatePresence>
            {logggedUser.accounts
              ?.slice()
              .reverse()
              .map((value, index) => (
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
                    {accountsData ? (
                      accountsData.find(
                        (item) => item.MT5Account === +value?.accountNumber
                      )?.Balance ?? "--"
                    ) : (
                      <Loader2 className="animate-spin text-center mx-auto" />
                    )}
                  </td>
                  <td className="p-2 text-center text-green-500 sm:p-3 text-sm sm:text-base">
                    {accountsData ? (
                      accountsData.find(
                        (item) => item.MT5Account === +value?.accountNumber
                      )?.Equity ?? "--"
                    ) : (
                      <Loader2 className="animate-spin text-center mx-auto" />
                    )}
                  </td>
                  {(() => {
                    const info = accountsData?.find(
                      (i) => i.MT5Account === +value?.accountNumber
                    );
                    return (
                      <td
                        className={`p-2 text-center sm:p-3 text-sm sm:text-base ${
                          info
                            ? info.Profit > 0
                              ? "text-green-500"
                              : "text-red-500"
                            : ""
                        }`}
                      >
                        {accountsData ? (
                          info?.Profit ?? "--"
                        ) : (
                          <Loader2 className="animate-spin text-center mx-auto" />
                        )}
                      </td>
                    );
                  })()}
                  <td className="py-3 text-center px-4">
                    <div>{CFformatDate(value?.createdAt)}</div>
                    <div className="text-sm text-gray-400">
                      {CFcalculateTimeSinceJoined(value?.createdAt)}
                    </div>
                  </td>
                  <td className="p-2 sm:p-3 ">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className=" flex items-center justify-center"
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
                      <p>Trade Platform : {selectedchallenge?.platform}</p>
                      <div className=" flex gap-4">
                        <p>Server Name : {siteConfig?.serverName}</p>
                      </div>
                      <p>
                        Trading Account : {selectedchallenge?.accountNumber}
                      </p>
                      <p>Leverage : {selectedchallenge?.leverage}</p>
                      <div className=" flex gap-4">
                        <p>
                          Master password : {selectedchallenge?.masterPassword}
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
                          Investar password :{" "}
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
