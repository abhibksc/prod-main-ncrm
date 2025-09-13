// hooks/user/useGetIdInfo.js
import { backendApi } from "@/utils/apiClients";
import { useEffect, useState } from "react";

export function useGetIdInfo(id) {
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    let intervalId;
    let isFetching = false; // guard flag

    const fetchAccountInfo = async () => {
      if (isFetching) return; // skip if a request is already running
      isFetching = true;
      setLoading(true);

      try {
        const res = await backendApi.get(`id-info?accountNumber=${id}`);
        if (res.data?.Equity) {
          setInfo(res.data);
        } else {
          setInfo({});
        }
      } catch (error) {
        console.error("Failed to fetch account info:", error);
        setInfo({});
      } finally {
        setLoading(false);
        isFetching = false; // release guard
      }
    };

    fetchAccountInfo(); // run immediately once

    intervalId = setInterval(fetchAccountInfo, 6000); // poll every 6s

    return () => clearInterval(intervalId);
  }, [id]);

  return { info, loading };
}
