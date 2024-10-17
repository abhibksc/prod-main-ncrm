import { setPaymentMethods, setPlatforms } from "@/redux/user/userSlice";
import axios from "axios";
import { useDispatch } from "react-redux";

export default function UserNewChallengeHook() {
  const dispatch = useDispatch();

  const getPlatforms = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/get-platforms`
      );
      dispatch(setPlatforms(res.data.data));
      console.log("all platforms hook#######", res.data);
    } catch (error) {
      console.log("error in get platforms", error);
    }
  };

  const getPaymentMethod = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BECKEND_END_POINT}/api/auth/get-payment-methods`
      );
      dispatch(setPaymentMethods(res.data.data));
      console.log("all payment methods hook#######", res.data);
    } catch (error) {
      console.log("error in get payment methods", error);
    }
  };
  return { getPlatforms, getPaymentMethod };
}
