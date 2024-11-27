import axios from "axios";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function UseCommissionBalance() {
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const [balance, setBalance] = useState("");
  const [userInfoData, setUserInfoData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_END_POINT}/GetUserInfo?Manager_Index=${
            import.meta.env.VITE_MANAGER_INDEX
          }&MT5Account=${loggedUser.referalId}`
        );
        setBalance(res.data.Balance);
        console.log("res data--", res.data);
        setUserInfoData(res.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchData();
  }, [loggedUser.referalId]);

  return [balance, userInfoData];
}
