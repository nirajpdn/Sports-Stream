type DayType =
  | "SUNDAY"
  | "MONDAY"
  | "TUESDAY"
  | "WEDNESDAY"
  | "THURSDAY"
  | "FRIDAY"
  | "SATURDAY";

interface SportInterface {
  day: DayType;
  title: string;
  url: string;
  time: string;
  lang: string;
}

interface DayIndex {
  day: DayIndex;
  index: number;
}
