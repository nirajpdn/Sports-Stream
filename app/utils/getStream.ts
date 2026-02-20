import axios from "axios";
import fs from "fs";
import path from "path";
import { days } from "~/data/days";
import {
  extractTime,
  extractTitle,
  extractURL,
  getDayFromIndex,
} from "./helper";
const URLRegex =
  /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;

const readSourceUrlFromDotEnv = () => {
  try {
    const envPath = path.resolve(process.cwd(), ".env");
    if (!fs.existsSync(envPath)) return "";

    const raw = fs.readFileSync(envPath, "utf8");
    const match = raw.match(/^\s*SOURCE_URL\s*=\s*(.+)\s*$/m);
    return match?.[1]?.trim().replace(/^['"]|['"]$/g, "") || "";
  } catch {
    return "";
  }
};

const resolveSourceUrl = () => {
  const value = process.env.SOURCE_URL || readSourceUrlFromDotEnv();
  if (!value) return "";

  try {
    return new URL(value).toString();
  } catch {
    return "";
  }
};

export const getStream = async () => {
  try {
    const sourceUrl = resolveSourceUrl();
    if (!sourceUrl) {
      console.error(
        "Missing or invalid SOURCE_URL. Set SOURCE_URL in environment or .env."
      );
      return { data: [], days: [] };
    }

    const { data } = await axios.get(sourceUrl);
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
