import { backendApi } from "@/utils/apiClients";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function UseFindUserById(id) {
  const [referralByUser, setReferralByUser] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await backendApi.get(`/get-user?id=${id}`);
        setReferralByUser(res.data.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchData();
  }, [id]);

  return { referralByUser };
}
