import React, { useState, useEffect } from "react";

const UserDashboardCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 11,
    minutes: 58,
    seconds: 51,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (
          prevTime.hours === 0 &&
          prevTime.minutes === 0 &&
          prevTime.seconds === 0
        ) {
          clearInterval(timer);
          return prevTime;
        }
        let newSeconds = prevTime.seconds - 1;
        let newMinutes = prevTime.minutes;
        let newHours = prevTime.hours;

        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
        }
        if (newMinutes < 0) {
          newMinutes = 59;
          newHours -= 1;
        }

        return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-secondary-800 mt-5 shadow-lg rounded-xl p-4 sm:p-6 max-w-full sm:max-w-md mx-auto">
      <h2 className="text-base sm:text-lg font-semibold mb-4 text-center sm:text-left">
        Today's permitted loss will reset in
      </h2>
      <div className="flex justify-center items-center space-x-2 sm:space-x-4 mb-4">
        {["hours", "minutes", "seconds"].map((unit) => (
          <div key={unit} className="text-center">
            <div className="bg-gradient-to-b from-secondary-600 to-secondary-700 text-white text-3xl sm:text-4xl font-bold rounded-lg p-2 sm:p-3 w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center shadow-inner">
              {String(timeLeft[unit]).padStart(2, "0")}
            </div>
            <p className="text-xs sm:text-sm mt-2">{unit}</p>
          </div>
        ))}
      </div>
      <p className="text-center text-xs sm:text-sm">
        Countdown Timezone: GMT+3
      </p>
    </div>
  );
};

export default UserDashboardCountdown;
