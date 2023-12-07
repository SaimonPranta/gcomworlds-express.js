const dateProvider = (date) => {
  const newDate = new Date(date);
  const container = newDate.toLocaleDateString("en-us", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  });
  return container;
};

module.exports = dateProvider;
