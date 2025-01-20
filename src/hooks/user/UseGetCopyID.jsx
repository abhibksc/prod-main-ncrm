import { copyApi } from "@/utils/apiClients";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

export default function UseCopyId() {
  const [copyId, setCopyId] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await copyApi.post(`/getCopyManagerByManagerIndex`, {
          Manager_Index: import.meta.env.VITE_COPY_MANAGER_INDEX,
        });
        // setCopyId(res.data.Balance);
        console.log("setCopyId--", res.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };
    fetchData();
  }, []);

  //   return [balance, userInfoData];
}
