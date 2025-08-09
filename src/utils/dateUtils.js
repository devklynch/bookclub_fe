/**
 * Date formatting utilities for consistent date display across the app
 */

/**
 * Formats a date string or Date object to a user-friendly format
 * @param {string|Date} date - The date to format
 * @param {string} type - The type of date formatting ('event', 'poll', 'short', 'long')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, type = "event") => {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    console.warn("Invalid date provided to formatDate:", date);
    return "";
  }

  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  switch (type) {
    case "event":
      // Format: "Saturday, August 9, 2024, 6:30 PM"
      return dateObj.toLocaleDateString("en-US", options);

    case "poll":
      // Format: "Saturday, August 9, 2024, 6:30 PM"
      return dateObj.toLocaleDateString("en-US", options);

    case "short":
      // Format: "Aug 9, 6:30 PM"
      return dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

    case "long":
      // Format: "Saturday, August 9, 2024"
      return dateObj.toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });

    case "time":
      // Format: "6:30 PM"
      return dateObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

    default:
      return dateObj.toLocaleDateString("en-US", options);
  }
};

/**
 * Formats an event date specifically
 * @param {string|Date} date - The event date
 * @returns {string} Formatted event date
 */
export const formatEventDate = (date) => {
  return formatDate(date, "event");
};

/**
 * Formats a poll expiration date specifically
 * @param {string|Date} date - The poll expiration date
 * @returns {string} Formatted poll date
 */
export const formatPollDate = (date) => {
  return formatDate(date, "poll");
};

/**
 * Checks if a date is in the past
 * @param {string|Date} date - The date to check
 * @returns {boolean} True if the date is in the past
 */
export const isPastDate = (date) => {
  if (!date) return false;
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj < new Date();
};

/**
 * Checks if a date is today
 * @param {string|Date} date - The date to check
 * @returns {boolean} True if the date is today
 */
export const isToday = (date) => {
  if (!date) return false;
  const dateObj = typeof date === "string" ? new Date(date) : date;
  const today = new Date();
  return dateObj.toDateString() === today.toDateString();
};

/**
 * Gets a relative time string (e.g., "2 days ago", "in 3 hours")
 * @param {string|Date} date - The date to get relative time for
 * @returns {string} Relative time string
 */
export const getRelativeTime = (date) => {
  if (!date) return "";

  const dateObj = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffInMs = dateObj - now;
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  if (diffInDays > 0) {
    return diffInDays === 1 ? "tomorrow" : `in ${diffInDays} days`;
  } else if (diffInDays < 0) {
    return Math.abs(diffInDays) === 1
      ? "yesterday"
      : `${Math.abs(diffInDays)} days ago`;
  } else if (diffInHours > 0) {
    return diffInHours === 1 ? "in 1 hour" : `in ${diffInHours} hours`;
  } else if (diffInHours < 0) {
    return Math.abs(diffInHours) === 1
      ? "1 hour ago"
      : `${Math.abs(diffInHours)} hours ago`;
  } else if (diffInMinutes > 0) {
    return diffInMinutes === 1 ? "in 1 minute" : `in ${diffInMinutes} minutes`;
  } else if (diffInMinutes < 0) {
    return Math.abs(diffInMinutes) === 1
      ? "1 minute ago"
      : `${Math.abs(diffInMinutes)} minutes ago`;
  } else {
    return "now";
  }
};
