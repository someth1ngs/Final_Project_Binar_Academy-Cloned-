const { addDays, addHours, addMinutes } = require("date-fns");
const { format, toZonedTime } = require("date-fns-tz");

exports.addingDays = (days, hours, minutes) => {
  // Create date
  const now = new Date();
  let resultDate;

  // Add the days to the current date
  resultDate = addDays(now, days);

  // Add hours and minutes to the result date
  resultDate = addHours(resultDate, hours);
  resultDate = addMinutes(resultDate, minutes);

  // Convert the result date to the specified time zone
  const zonedDate = toZonedTime(resultDate, "Asia/Bangkok");

  // Format the result date with time zone offset in ISO format
  const formattedResult = format(zonedDate, "yyyy-MM-dd'T'HH:mm:ssXXX", { timeZone: "Asia/Bangkok" });

  //Return
  return formattedResult;
};
