// format date ---------------------

export function CFformatDate(isoDateString) {
  const date = new Date(isoDateString);

  const formattedDate = date.toLocaleDateString("en-GB", {
    year: "numeric",
    day: "2-digit",
    month: "2-digit",
  });

  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true, // 12-hour format with AM/PM
  });

  return `${formattedDate}, ${formattedTime}`;
}
// since joined ---------------

export function CFcalculateTimeSinceJoined(isoDateString) {
  const joinDate = new Date(isoDateString);
  const today = new Date();

  // Calculate the difference in time (in milliseconds)
  const timeDifference = today - joinDate;

  // Calculate different time units
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

  // Build the time string
  let timeString = [];

  if (days > 0) {
    timeString.push(`${days} day${days !== 1 ? "s" : ""}`);
  }
  if (hours > 0) {
    timeString.push(`${hours} hour${hours !== 1 ? "s" : ""}`);
  }
  if (minutes > 0) {
    timeString.push(`${minutes} minute${minutes !== 1 ? "s" : ""}`);
  }

  // Handle case when less than a minute
  if (timeString.length === 0) {
    return "less than a minute ago";
  }

  return timeString.join(", ") + " ago";
}

const currentDateTime = new Date();

export const CFformattedDateTime =
  currentDateTime.toLocaleDateString("en-GB") +
  ", " +
  currentDateTime.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // 12-hour format with AM/PM
  });
