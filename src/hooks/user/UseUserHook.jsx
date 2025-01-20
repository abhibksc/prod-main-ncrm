import {
  setLoggedUser,
  setOpenTrades,
  setPaymentMethods,
  setPlatforms,
} from "@/redux/user/userSlice";
import { backendApi } from "@/utils/apiClients";
import { useDispatch, useSelector } from "react-redux";

export default function UseUserHook() {
  const dispatch = useDispatch();
  const loggedUser = useSelector((store) => store.user.loggedUser);

  // update logged user -----

  const getUpdateLoggedUser = async () => {
    try {
      const res = await backendApi.get(`/get-user?id=${loggedUser._id}`);
      dispatch(setLoggedUser(res.data.data));
    } catch (error) {
      console.log("error in update loggedUser hook", error);
    }
  };

  const getReset = () => {
    dispatch(setLoggedUser(""));
    dispatch(setOpenTrades([]));
    dispatch(setPlatforms([]));
    dispatch(setPaymentMethods([]));
  };
  return {
    getUpdateLoggedUser,
    getReset,
  };
}
