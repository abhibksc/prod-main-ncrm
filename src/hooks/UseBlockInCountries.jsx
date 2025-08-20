import { useEffect, useState } from "react";
import axios from "axios";

const useBlockInCountries = () => {
  const [isBlocked, setIsBlocked] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const detectAndBlock = async () => {
      try {
        const res = await axios.get("https://ipapi.co/json/");
        const country = res.data?.country;
        const block = country === "US" || country === "CA"; // block US & Canada
        setIsBlocked(block);
      } catch (err) {
        console.error("GeoIP check failed", err);
      } finally {
        setChecked(true);
      }
    };

    detectAndBlock();
  }, []);

  if (checked && isBlocked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white text-2xl font-bold text-center px-4">
        🚫 Access Restricted: Access to this service is temporarily unavailable
        in your region. Updates regarding availability will be provided soon.
      </div>
    );
  }

  return null;
};

export default useBlockInCountries;
