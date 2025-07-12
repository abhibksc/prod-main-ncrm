import { backendApi } from "@/utils/apiClients";
import { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";

export default function useUserWithdrawals() {
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [data, setData] = useState([]);
  const [isWithdrawalPending, setIsWithdrawalPending] = useState(false);

  const fetchData = useCallback(async () => {
    if (!loggedUser?._id) return;

    setIsLoading(true);
    setIsError(false);

    try {
      const res = await backendApi.get(`/withdrawals/${loggedUser._id}`);
      const withdrawals = res.data.data;
      const isPendingRes = withdrawals.some(
        (value) => value.status === "pending"
      );
      setIsWithdrawalPending(isPendingRes);
      setData(withdrawals);
    } catch (error) {
      console.error("Error fetching withdrawals:", error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }, [loggedUser?._id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, isError, isWithdrawalPending, refresh: fetchData };
}
