import { useEffect, useState } from "react";
import { metaApi } from "@/utils/apiClients";

export function useGetInfoByAccounts(accountIds = []) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!accountIds || accountIds.length === 0) return;

    let intervalId;

    const fetchData = async () => {
      try {
        const res = await metaApi.post(`GetUserInfoByAccounts`, {
          Manager_Index: import.meta.env.VITE_MANAGER_INDEX,
          MT5Accounts: accountIds,
        });
        if (Array.isArray(res.data)) {
          setData(res.data);
        } else {
          setData([]);
        }
      } catch (err) {
        console.error("Error fetching live data:", err);
        setData([]);
      }
    };

    fetchData(); // fetch immediately on change
    intervalId = setInterval(fetchData, 2000); // continue polling

    return () => clearInterval(intervalId);
  }, [JSON.stringify(accountIds)]); // track actual value, not just string

  return data;
}
