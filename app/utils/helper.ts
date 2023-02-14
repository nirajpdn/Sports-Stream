let urlRegex = /(https?:\/\/[^ ]*)/;

let imgRegex = /(data:image\/[^;]+;base64[^"]+)/g;
const extractURL = (text: any) => {
  let url = text.match(urlRegex)[1];
  return url;
};
const extractTitle = (text: any) => {
  let title = text.split("|")[0];
  title = title.split(extractTime(title))[1];
  return title;
};
const extractTime = (text: any) => {
  let timeRegex = /(\d{1,2}:\d{1,2})/i;
  let time = text.match(timeRegex)?.[1] || "";
  return time;
};

function getImage(string: any) {
  const imgRex = /<img.*?src="(.*?)"[^>]+>/g;
  let images = [];
  let img;
  while ((img = imgRex.exec(string))) {
    images.push(img[1]);
  }
  images = images.filter((image) => image.match(imgRegex));
  return [];
}

function getDayFromIndex(index: any, dayWithIndex: any) {
  let day = "";
  let found = false;
  for (let i = 0; i < dayWithIndex.length; i++) {
    if (
      i < dayWithIndex.length - 1 &&
      index > dayWithIndex[i].index &&
      index < dayWithIndex[i + 1].index &&
      !found
    ) {
      day = dayWithIndex[i].day;
      found = true;
    } else if (
      i === dayWithIndex.length - 1 &&
      index > dayWithIndex[i].index &&
      !found
    ) {
      day = dayWithIndex[i].day;
      found = true;
    }
  }
  return day;
}

export { extractURL, extractTime, extractTitle, getImage, getDayFromIndex };
