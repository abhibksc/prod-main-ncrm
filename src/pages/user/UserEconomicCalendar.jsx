import React, { useState } from "react";
import Loader from "../../components/Loader/Loader";

export default function UserEconomicCalendar() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="h-screen mx-auto">
      <div>
        <h1 className="text-3xl font-bold mb-5 text-center">
          Economic Calendar
        </h1>
      </div>
      <div className="w-full flex flex-col items-center container h-screen relative">
        {loading && (
          <div className="h-screen -mt-5 w-full flex justify-center items-center">
            <Loader />
          </div>
        )}
        <div className="w-full h-full bg-secondary-800/10 p-4  shadow-4xl rounded-2xl flex flex-col justify-center items-center">
          <iframe
            src="https://s.tradingview.com/embed-widget/events/?locale=en#%7B%22width%22%3A%22100%25%22%2C%22height%22%3A%22%22%2C%22isTransparent%22%3Atrue%2C%22colorTheme%22%3A%22dark%22%2C%22importanceFilter%22%3A%22-1%2C0%2C1%22%7D"
            width="100%"
            height="100%"
            className="rounded-xl"
            title="Forex Market Economic Calendar"
            onLoad={() => setLoading(false)}
          ></iframe>
        </div>
      </div>
    </div>
  );
}
