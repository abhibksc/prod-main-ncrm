import { setPhaseMaxLength, setPhaseStats } from "@/redux/user/userSlice";
import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function UsePhaseStats() {
  const loggedUser = useSelector((store) => store.user.loggedUser);
  const dispatch = useDispatch();

  const updatePhaseStats = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/get-phases`
      );

      const filterallPhaseData = res.data.data
        .map((value) => ({
          ...value,
          maxProfit: value.maxProfit === 0 ? Infinity : value.maxProfit,
        }))
        .filter((value) => value.accountType === loggedUser.accountType);

      const filterCurrentPhaseData = filterallPhaseData.filter(
        (value) => value.phase === loggedUser.phase
      )[0];
      const currentPhaseData = {
        phase: filterCurrentPhaseData.phase,
        min: filterCurrentPhaseData.maxOverallLoss,
        max: filterCurrentPhaseData.maxProfit,
      };
      dispatch(setPhaseMaxLength(filterallPhaseData.length));
      dispatch(setPhaseStats(currentPhaseData));
    } catch (error) {
      console.log("Error fetching existing phases data", error);
    }
  };

  useEffect(() => {
    updatePhaseStats();
  }, [loggedUser.phase]);

  return { updatePhaseStats };
}
