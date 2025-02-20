import { metaApi } from "@/utils/apiClients";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function UseCommissionBalance() {
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const [balance, setBalance] = useState("");
  const [userInfoData, setUserInfoData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await metaApi.get(
          `/GetUserInfo?Manager_Index=${
            import.meta.env.VITE_MANAGER_INDEX
          }&MT5Account=${loggedUser.referralAccount}`
        );
        setBalance(res.data.Balance);
        setUserInfoData(res.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchData();
  }, [loggedUser.referralAccount]);

  return [balance, userInfoData];
}
