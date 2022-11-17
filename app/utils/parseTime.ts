import moment from "moment-timezone";
export const parseTime = (time: string) => {
  const [hours, mins] = time?.split(":");
  var timeInLondon = moment
    .tz(
      `${new Date().getFullYear()}-${new Date().getMonth()}-${new Date().getDate()} ${time}`,
      "Europe/London"
    )
    .utc();

  return new Date(timeInLondon.toDate()).toLocaleTimeString();
};
