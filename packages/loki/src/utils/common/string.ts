export function capitalizeFirstLetter(string) {
  return string.toLowerCase().charAt(0).toUpperCase() + string.toLowerCase().slice(1);
}

export const truncateString = (str: string, start: number = 0, end: number = str.length, extendEnding?: string) => {
  if (end == null) {
    end = 100;
  }
  if (extendEnding == null) {
    extendEnding = '...';
  }
  if (str.length > start) {
    return str.slice(start, end) + extendEnding;
  } else {
    return str;
  }
};

export const uppercaseFirstLetterAllWords = (text: string) => {
  return text.replace(/(^\w|\s\w)(\S*)/g, (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase());
};
