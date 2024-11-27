import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowDownCircle,
  BadgeDollarSign,
  BadgeInfoIcon,
  Loader2,
  WalletCardsIcon,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import UseCommissionBalance from "@/hooks/user/UseCommissionBalance";

export const UserReferralWithdrawal = () => {
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const [selectedGateway, setSelectedGateway] = useState("Bank Transfer");
  const [apiLoader, setApiLoader] = useState(false);
  const [error, setError] = useState("");
  const [balance, userInfoData] = UseCommissionBalance();
  const [amount, setAmount] = useState("");
  const [selectWallet, setSelectWallet] = useState("Thether");

  const currentDateTime = new Date();
  const formattedDateTime =
    currentDateTime.toLocaleDateString("en-GB") +
    ", " +
    currentDateTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false, // 12-hour format with AM/PM
    });

  const customContent = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Withdrawal Request Confirmation - Arena Trade</title>
      <style>
        body, html {
          margin: 0;
          padding: 0;
          font-family: 'Arial', sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f4f4f4;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 5px;
          background-color: #ffffff;
        }
        .header {
          background-color: #19422df2;
          color: #ffffff;
          padding: 20px 15px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .header h1 {
          margin: 0;
          font-size: 22px;
          letter-spacing: 1px;
        }
        .content {
          padding: 10px 20px;
        }
        .cta-button {
          display: inline-block;
          padding: 12px 24px;
          background-color: #2d6a4f;
          color: #FFFFFF;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          margin: 10px 0;
        }
        .footer {
          background-color: #19422df2;
          color: #ffffff;
          text-align: center;
          padding: 5px 10px;
          font-size: 12px;
          border-radius: 0 0 10px 10px;
        }
        .footer-info {
          margin-top: 6px;
        }
        .footer-info a {
          color: #B6D0E2;
          text-decoration: none;
        }
        
       
        .withdrawal-details {
          background-color: #f8f8f8;
          border-left: 4px solid #2d6a4f;
          padding: 15px;
          margin: 20px 0;
        }
        .withdrawal-details p {
          margin: 5px 0;
        }
        .highlight {
          font-weight: bold;
          color: #0a2342;
        }
        .risk-warning {
          color: #C70039;
          padding: 5px;
          font-size: 12px;
          line-height: 1.4;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Commission Withdrwal Requested</h1>
        </div>
        <div class="content">
          <p>Dear ${loggedUser?.firstName + " " + loggedUser?.lastName},</p>
  <p>  We have received your Commision withdrawal request and are currently processing it.       <br><br>
 Our team is working diligently to verify your details, and you will be notified as soon as the verification is complete.</p>
        <div class="withdrawal-details">
          <p>Username: <span class="highlight">${loggedUser.email}</span></p>
            <p>Total Amount: <span class="highlight">${balance}</span></p>
            <p>Withdrwal Amount: <span class="highlight">${amount}</span></p>
            <p>Processing time: <span class="highlight">${" 1-3 business days"}</span></p>
            <p>Updated Date: <span class="highlight">${formattedDateTime}</span></p>
          </div>
    
    <p>Thank you for choosing us.</p>
    <p>Happy trading!</p>
          
          <p>Best regards,<br>The ${
            import.meta.env.VITE_WEBSITE_NAME || "Forex Funding"
          } Team</p>
          <hr>
     <div class="risk-warning">
      <strong>Risk Warning:</strong> Trading CFDs carries high risk and may result in losses beyond your initial investment. Trade only with money you can afford to lose and understand the risks.  
      <br><br>
      Our services are not for U.S. citizens or in jurisdictions where they violate local laws.
    </div>
        
    
        </div>
          <div class="footer">
          <div class="footer-info">    
          <p>${import.meta.env.VITE_EMAIL_ADDRESS || "forextest@mail.com"}</p>
           <p>Website: <a href="https://${
             import.meta.env.VITE_EMAIL_WEBSITE
           }"> ${
    import.meta.env.VITE_EMAIL_WEBSITE
  } </a> | E-mail: <a href="mailto:${
    import.meta.env.VITE_EMAIL_EMAIL || "forextest@mail.com"
  }">${import.meta.env.VITE_EMAIL_EMAIL || "forextest@mail.com"}</a></p>
            <p>We sent out this message to all existing ${
              import.meta.env.VITE_WEBSITE_NAME || "Forex Funding"
            } traders. Please visit this page to know more about our Privacy Policy.</p>
            <p>&copy; 2024 ${
              import.meta.env.VITE_WEBSITE_NAME || "Forex Funding"
            }. All Rights Reserved</p>
          </div>
        </div>
      </div>
    </body>
    </html>`;

  //    main withdrwal handler ---------------------

  const withdrawalHandler = async (e) => {
    e.preventDefault();
    setApiLoader(true);
    setError("");
    try {
      if (balance <= 0) {
        setError(`You don't have sufficient balance for withdrawal.`);
        setApiLoader(false);
      } else if (amount > balance) {
        setError(`Amount must be less then or equal to $${balance}`);
        setApiLoader(false);
      } else if (amount <= balance && amount > 0) {
        const withdrawalDBres = await axios.post(
          `${
            import.meta.env.VITE_BECKEND_END_POINT
          }/api/auth/add-referral-withdrawal`,
          {
            referralId: loggedUser.referalId,
            method:
              selectedGateway === "Bank Transfer"
                ? selectedGateway
                : selectWallet,
            amount: amount,
            status: "pending",
            userId: loggedUser._id,
            managerIndex: import.meta.env.VITE_MANAGER_INDEX,
            totalBalance: balance,
            level: 1,
          }
        );
        const customMailRes = await axios.post(
          `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/custom-mail`,
          {
            email: loggedUser.email,
            content: customContent,
            subject: "Commission Withdrwal requested",
          }
        );
        console.log("withdraw db res--", withdrawalDBres.data);

        setApiLoader(false);
        toast.success("Withdawal Requested");
      }
      setApiLoader(false);
    } catch (error) {
      setApiLoader(false);
      toast.error("Something went wrong!!");
      console.log("error while withdraw", error);
    }
  };

  useEffect(() => {}, [balance, userInfoData]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-gradient-to-r">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl bg-secondary-800/50 -mt-20 p-8 rounded-lg shadow-xl"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-white flex items-center">
            <ArrowDownCircle className="w-8 h-8 mr-2" />
            Withdraw Commision
          </h2>
          <div>
            <h1 className=" font-semibold text-sm text-neutral-100">
              Withdrawalable amount
            </h1>
            <p
              className={` text-center 
                text-green-500 bg-secondary-600/20 "
              }   mt-1 rounded-full py-1  font-bold`}
            >
              ${Number(balance)}
            </p>
          </div>
        </div>
        <form onSubmit={withdrawalHandler} className="space-y-6">
          {/* method and account type -- */}
          <div className=" grid grid-cols-1 md:grid-cols-2 items-center   gap-6">
            <div className=" w-full">
              <label
                htmlFor="gateway"
                className="block text-sm font-medium text-white mb-2"
              >
                Method
              </label>
              <select
                id="gateway"
                value={selectedGateway}
                onChange={(e) => setSelectedGateway(e.target.value)}
                className="block w-full p-3 text-base bg-secondary-700 outline-none border-none text-white rounded-md "
              >
                {/* <option value="">Select Gateway</option> */}
                <option value="Bank Transfer">Bank Transfer</option>
                <option value="Wallet Transfer">Wallet Transfer</option>
              </select>
            </div>

            {selectedGateway === "Wallet Transfer" && (
              <div className=" w-full">
                <label
                  htmlFor="account"
                  className="block text-sm font-medium text-white mb-2"
                >
                  Choose Wallet
                </label>
                <select
                  id="account"
                  value={selectWallet}
                  onChange={(e) => setSelectWallet(e.target.value)}
                  className="block w-full p-3 text-base bg-secondary-700 text-white border outline-none border-none rounded-md "
                >
                  <option value="Thether">Thether {"(USDT)"} </option>
                  <option value="Ethereum">ETH {"(Ethereum)"} </option>
                  <option value="TRX">TRX {"(Tron)"} </option>
                </select>
              </div>
            )}
          </div>
          {/* account details -- */}

          {selectedGateway === "Bank Transfer" ? (
            <div>
              <div className=" flex items-center gap-2 mb-3">
                <WalletCardsIcon></WalletCardsIcon>
                <h1 className=" text-lg font-bold">Account details</h1>
              </div>
              <div>
                <p>
                  Bank Name -{" "}
                  <span className=" font-bold">
                    {loggedUser?.bankDetails?.bankName}{" "}
                  </span>
                </p>
              </div>
              <div>
                <p>
                  Holder Name -{" "}
                  <span className=" font-bold">
                    {loggedUser?.bankDetails?.holderName}
                  </span>{" "}
                </p>
              </div>
              <div>
                <p>
                  Account Number -{" "}
                  <span className=" font-bold">
                    {loggedUser?.bankDetails?.accountNumber}
                  </span>
                </p>
              </div>
              <div>
                <p>
                  IFSC Code -{" "}
                  <span className=" font-bold">
                    {loggedUser?.bankDetails?.ifscCode}
                  </span>
                </p>
              </div>
              <div>
                <p>
                  Swift Code -{" "}
                  <span className=" font-bold">
                    {loggedUser?.bankDetails?.swiftCode}
                  </span>
                </p>
              </div>
              <div>
                <p>
                  UPI ID -{" "}
                  <span className=" font-bold">
                    {loggedUser?.bankDetails?.upiId}
                  </span>
                </p>
              </div>
            </div>
          ) : selectedGateway === "Wallet Transfer" ? (
            <div>
              <div className=" flex items-center gap-2 mb-3">
                <WalletCardsIcon></WalletCardsIcon>
                <h1 className=" text-lg font-bold">Account details</h1>
              </div>{" "}
              {selectWallet === "Thether" && (
                <div>
                  <p>
                    Thether Address -{" "}
                    <span className=" font-bold">
                      {loggedUser?.walletDetails?.tetherAddress}{" "}
                    </span>
                  </p>
                </div>
              )}
              {selectWallet === "Ethereum" && (
                <div>
                  <p>
                    Ethereum Address -{" "}
                    <span className=" font-bold">
                      {loggedUser?.walletDetails?.ethAddress}
                    </span>{" "}
                  </p>
                </div>
              )}
              {selectWallet === "TRX" && (
                <div>
                  <p>
                    TRX Address -
                    <span className=" font-bold">
                      {loggedUser?.walletDetails?.trxAddress}
                    </span>
                  </p>
                </div>
              )}
            </div>
          ) : (
            ""
          )}

          <div>
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-white mb-2"
            >
              Amount
            </label>
            <div className="relative bg-secondary-700 rounded-md ">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center ">
                <BadgeDollarSign className="h-6 w-6 text-white" />
              </div>
              <input
                type="text"
                id="amount"
                className="w-full pl-10 py-3  bg-secondary-700 text-white border-none outline-none rounded-md placeholder-gray-300 "
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
          <button
            onClick={withdrawalHandler}
            type="submit"
            className="w-full flex justify-center hover:shadow-xl bg-green-600/80 text-white py-3 rounded-md shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-700 transition duration-300"
          >
            Submit Withdrawal
            {apiLoader && <Loader2 className=" animate-spin mx-3"></Loader2>}
          </button>
          <div className=" my-2 text-red-500 text-center">
            <p>{error}</p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
