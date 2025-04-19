import { backendApi, metaApi } from "@/utils/apiClients";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function UseUserDeposit() {
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const [data, setData] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await backendApi.get(`/deposit/${loggedUser._id}`);
        const filteredData = res.data.data
          .filter((value) => value.status === "approved")
          .reduce((sum, value) => sum + Number(value.deposit || 0), 0);
        // console.log("data", filteredData);
        setData(filteredData);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchData();
  }, []);

  return { data };
}
