import React, { useState } from "react";
import { motion } from "framer-motion";
import Loader from "../../components/Loader/Loader";

export default function UserEconomicCalendar() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="h-screen mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-5">Economic Calendar</h1>
      </div>
      <div className="w-full flex flex-col items-center container h-screen relative">
        {loading && (
          <div className=" h-screen -mt-5 w-full flex justify-center items-center">
            <Loader></Loader>{" "}
          </div>
        )}
        <div className=" min-w-[60%] h-screen p-6 bg-secondary-800/40 shadow-4xl rounded-2xl flex flex-col justify-center items-center">
          <iframe
            src="https://sslecal2.investing.com?columns=exc_flags,exc_currency,exc_importance,exc_actual,exc_forecast,exc_previous&features=datepicker,timezone&countries=25,32,6,37,72,22,17,39,14,10,35,43,56,36,110,11,26,12,4,5&calType=week&timeZone=8&lang=1"
            width="100%"
            height="100%"
            color="black"
            className=" rounded-xl"
            title="Economic Calendar"
            onLoad={() => setLoading(false)}
          ></iframe>
        </div>
      </div>
    </div>
  );
}
