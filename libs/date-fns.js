const { addDays, addHours, addMinutes, format } = require("date-fns");

exports.addingDays = (days, hours, minutes) => {
  const now = new Date();
  let resultDate;

  // Add the days to the current date
  resultDate = addDays(now, days);

  // Add hours and minutes to the result date
  resultDate = addHours(resultDate, hours);
  resultDate = addMinutes(resultDate, minutes);

  // Format the result date
  const formattedResult = format(resultDate, "yyyy-MM-dd HH:mm:ss");

  return new Date(formattedResult);
};
