import { useEffect, useState } from "react";
import { backendApi, metaApi } from "@/utils/apiClients";
import { useDispatch } from "react-redux";
import {
  setAccountsData,
  setAccountStats,
  setIbAccountsData,
} from "@/redux/user/userSlice";

export function useGetInfoByAccounts(accountIds = [], component) {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({
    totalBalance: 0,
    totalEquity: 0,
    totalProfit: 0,
  });
  const dispatch = useDispatch();

  useEffect(() => {
    if (!accountIds || accountIds.length === 0) return;

    let intervalId;
    let isFetching = false; // guard flag

    const fetchData = async () => {
      if (isFetching) return; // skip if a request is already in progress
      isFetching = true;
      try {
        const res = await backendApi.post(`ids-info`, {
          accountIds: accountIds,
        });

        if (Array.isArray(res.data)) {
          setData(res.data);

          // Calculate stats
          const totalBalance = res.data.reduce(
            (sum, acc) => sum + Number(acc.Balance || 0),
            0
          );
          const totalEquity = res.data.reduce(
            (sum, acc) => sum + Number(acc.Equity || 0),
            0
          );
          const totalProfit = res.data.reduce(
            (sum, acc) => sum + Number(acc.Profit || 0),
            0
          );

          const dispatchStats = {
            totalBalance,
            totalEquity,
            totalProfit,
          };

          setStats(dispatchStats);

          // dispatch conditionally
          if (component === "accounts") {
            dispatch(setAccountsData(res.data));
            dispatch(setAccountStats(dispatchStats));
          }
          if (component === "ib") {
            dispatch(setIbAccountsData(res.data));
          }
        }
      } catch (err) {
        console.error("Error fetching live data:", err);
        setData([]);
      } finally {
        isFetching = false; // release guard
      }
    };

    fetchData(); // fetch immediately on mount/change
    intervalId = setInterval(fetchData, 6000); // continue polling

    return () => clearInterval(intervalId);
  }, [JSON.stringify(accountIds), component, dispatch]);

  return { data, stats };
}
