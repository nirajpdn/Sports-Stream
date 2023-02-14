import axios from "axios";
import { days } from "~/data/days";
import {
  extractTime,
  extractTitle,
  extractURL,
  getDayFromIndex,
} from "./helper";
const URLRegex =
  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
export const getStream = async () => {
  try {
    const { data } = await axios.get(process.env.SOURCE_URL as any);
    const dayIndexes = data
      .split(/\r?\n/)
      .map((line: any, index: any) => {
        if (days.indexOf(line) !== -1) {
          return {
            day: line,
            index,
          };
        } else {
          return null;
        }
      })
      .filter((item: any) => item !== null);

    let lines = data
      .split(/\r?\n/)
      ?.map((item: any, index: any) => ({
        data: item,
        day: getDayFromIndex(index, dayIndexes),
      }))
      .filter((line: any) => {
        const lineWithUrl = `${line.data}`.match(URLRegex);
        if (lineWithUrl === null || !line.data.includes("|")) {
          return false;
        } else {
          return true;
        }
      });
    lines = lines.map((line: any) => {
      const lang = /EN|DE|FR|AR|BR|IT|ES|PT/g.exec(line.data)?.[0] || "";
      return {
        title: extractTitle(line.data),
        url: extractURL(line.data),
        time: extractTime(line.data),
        day: line.day,
        lang,
      };
    });

    return { data: lines, days: dayIndexes.map((item: DayIndex) => item.day) };
  } catch (e) {
    console.log(e);
    return { data: [], days: [] };
  }
};
