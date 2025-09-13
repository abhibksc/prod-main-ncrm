import { useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { backendApi, metaApi } from "@/utils/apiClients";
import ModernText from "@/lib/ModernText";
import { setOpenTrades } from "@/redux/user/userSlice";
import { motion } from "framer-motion";

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (delay) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, ease: "easeOut", delay },
  }),
};

const TradeCard = ({ title, value, valueColor, delay }) => (
  <motion.div
    className="flex flex-col items-center justify-center w-28 h-28 bg-secondary-800/30 rounded-full shadow-md hover:bg-secondary-800/40 transition-all duration-300"
    variants={cardVariants}
    custom={delay}
    initial="hidden"
    animate="visible"
  >
    <p className="text-xs text-gray-100 text-center mb-1">{title}</p>
    <p className={`text-lg font-semibold ${valueColor}`}>{value}</p>
  </motion.div>
);

export default function UserDashboardTrades() {
  const navigate = useNavigate();
  const rawOpenTrades = useSelector((store) => store.user.openTrades);
  const openTrades = Array.isArray(rawOpenTrades) ? rawOpenTrades : [];
  const totalTradesCount = openTrades.length;

  const ProfitTradesData = openTrades.filter((value) => value.Profit > 0);

  const calculateWinningRatio = () => {
    const positiveTradesCount = openTrades.filter(
      (entry) => entry.Profit > 0
    ).length;

    if (totalTradesCount === 0) {
      return 0;
    }

    return (positiveTradesCount / totalTradesCount) * 100;
  };
  const loggedUser = useSelector((store) => store.user.loggedUser);

  const dispatch = useDispatch();

  const calculateTotalNetProfit = () => {
    const totalNetProfit = openTrades.reduce(
      (sum, entry) => sum + entry.Profit,
      0
    );

    return totalNetProfit;
  };

  // Ref to track if component is mounted
  const isMountedRef = useRef(true);
  // Ref to prevent overlapping API calls
  const isRequestingRef = useRef(false);

  const tradesSummary = {
    totalTrades: openTrades?.length,
    profitableTrades: ProfitTradesData?.length,
    winRate: calculateWinningRatio(),
    netProfit: calculateTotalNetProfit(),
  };

  useEffect(() => {
    isMountedRef.current = true;
    let intervalId;
    let stopped = false;

    const fetchOpenTrades = async () => {
      if (isRequestingRef.current) return; // Prevent overlapping
      isRequestingRef.current = true;
      try {
        if (loggedUser.accounts.length > 0) {
          let data = [];
          for (const account of loggedUser.accounts) {
            const res = await backendApi.get(
              `/open-trades?userId=${loggedUser._id}&accountNumber=${account.accountNumber}`
            );
            if (Array.isArray(res.data)) {
              data = data.concat(res.data);
              if (isMountedRef.current) {
                dispatch(setOpenTrades(data));
              }
            }
          }
        } else {
          if (isMountedRef.current) {
            console.log("No account found");
          }
        }
      } catch (error) {
        if (isMountedRef.current) {
          console.log("error in openTrades", error);
        }
      } finally {
        isRequestingRef.current = false;
      }
    };

    const intervalFn = async () => {
      if (!isMountedRef.current || stopped) return;
      await fetchOpenTrades();
    };
    intervalId = setInterval(intervalFn, 6000);
    // Call once immediately
    intervalFn();
    return () => {
      isMountedRef.current = false;
      stopped = true;
      clearInterval(intervalId);
    };
  }, [dispatch, loggedUser.accounts, loggedUser._id]);

  return (
    <motion.div
      className="bg-secondary-800/30 p-8 rounded-3xl shadow-lg w-full max-w-2xl flex flex-col items-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <motion.div
        className="flex flex-col items-center mb-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <ModernText text={"Open Trades Summary"} />
        <button
          onClick={() => navigate("/user/trade-history")}
          className="flex items-center text-blue-400 hover:text-blue-500 mt-2 text-sm font-medium transition-colors duration-300"
        >
          View History
          <ArrowRight className="ml-1" size={16} />
        </button>
      </motion.div>

      <motion.div
        className="flex flex-wrap justify-center gap-4 md:gap-10"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
      >
        <TradeCard
          title="Total Trades"
          value={tradesSummary.totalTrades}
          valueColor="text-gray-100"
          delay={0.2}
        />
        <TradeCard
          title="Profit Trades"
          value={tradesSummary.profitableTrades}
          valueColor="text-green-500"
          delay={0.3}
        />
        <TradeCard
          title="PnL Floating"
          value={`${tradesSummary.winRate.toFixed(2)}%`}
          valueColor="text-yellow-500"
          delay={0.4}
        />
        <TradeCard
          title="Net Profit"
          value={tradesSummary.netProfit.toFixed(2)}
          valueColor={
            tradesSummary.netProfit >= 0 ? "text-green-500" : "text-red-400"
          }
          delay={0.5}
        />
      </motion.div>
    </motion.div>
  );
}
