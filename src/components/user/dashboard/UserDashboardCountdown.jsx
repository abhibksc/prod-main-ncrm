import React, { useState, useEffect } from "react";

const UserDashboardCountdown = () => {
  // Dynamic end and start times
  const timerEndEnv = "23:59:59"; // End time
  const timerStartEnv = "23:50:00"; // Start time

  // Parse time strings to hours, minutes, and seconds
  const parseTime = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(":").map(Number);
    return { hours, minutes, seconds };
  };

  const timerEnd = parseTime(timerEndEnv);
  const timerStart = parseTime(timerStartEnv);

  const calculateTimeLeft = () => {
    const now = new Date();
    const endTime = new Date();
    const startTime = new Date();

    // Set end time
    endTime.setHours(timerEnd.hours, timerEnd.minutes, timerEnd.seconds, 0);

    // Set start time
    startTime.setHours(
      timerStart.hours,
      timerStart.minutes,
      timerStart.seconds,
      0
    );

    // Handle cross-day logic
    if (startTime > endTime) {
      startTime.setDate(startTime.getDate() - 1); // Adjust start time to the previous day
    }

    // Determine the countdown state
    if (now < startTime) {
      // Timer hasn't started yet; calculate time until the start
      const timeUntilStart = startTime - now;

      const hours = Math.floor((timeUntilStart / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeUntilStart / (1000 * 60)) % 60);
      const seconds = Math.floor((timeUntilStart / 1000) % 60);

      return { hours, minutes, seconds };
    } else if (now >= startTime && now < endTime) {
      // Timer is active; calculate time until the end
      const timeRemaining = endTime - now;

      const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
      const seconds = Math.floor((timeRemaining / 1000) % 60);

      return { hours, minutes, seconds };
    } else {
      // Timer has ended
      return { hours: 0, minutes: 0, seconds: 0 };
    }
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-secondary-800 mt-5 shadow-lg rounded-xl p-4 sm:p-6 max-w-full sm:max-w-md mx-auto">
      <h2 className="text-base sm:text-lg font-semibold mb-4 text-center sm:text-left">
        Countdown Timer
      </h2>
      <div className="flex justify-center items-center space-x-2 sm:space-x-4 mb-4">
        {["hours", "minutes", "seconds"].map((unit) => (
          <div key={unit} className="text-center">
            <div className="bg-gradient-to-b from-secondary-500/20 to-secondary-500 text-white text-3xl sm:text-4xl font-bold rounded-lg p-2 sm:p-3 w-16 sm:w-20 h-16 sm:h-20 flex items-center justify-center shadow-inner">
              {String(timeLeft[unit]).padStart(2, "0")}
            </div>
            <p className="text-xs sm:text-sm mt-2">{unit}</p>
          </div>
        ))}
      </div>
      <p className="text-center text-xs sm:text-sm">
        Timer End: {timerEndEnv}, Timer Start: {timerStartEnv}
      </p>
    </div>
  );
};

export default UserDashboardCountdown;
