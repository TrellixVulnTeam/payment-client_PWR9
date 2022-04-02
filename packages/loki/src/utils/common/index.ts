export const APP_NAME = 'Alopay';

export const MODULE_ALOPAY = 1;

export const MIN_BALANCE = 50000000; // 50.000.000

export const getBalanceStatus = (balance: number) => {
  if (balance <= 0) {
    return 'uneligible';
  }
  if (balance <= MIN_BALANCE) {
    return 'runningOut';
  }
  return 'eligible';
};

const isFloat = (n: number) => Number(n) === n && n % 1 !== 0;

export const formatCurrency = (number: string | number | undefined) => {
  if (number === undefined) return '-';
  if (!number) return '0';

  const result = Number(number);
  return typeof result === 'number'
    ? isFloat(result)
      ? result.toLocaleString('en-US', { maximumFractionDigits: 2 })
      : result.toLocaleString('en-US')
    : '0';
};

function getDateFromUTC({ seconds }: { seconds: number; nanos: number }): Date {
  let d = new Date(0); // The 0 there is the key, which sets the date to the epoch
  d.setUTCSeconds(seconds);
  return d;
}

function getDateMonthYear(d: Date) {
  const dateNum = d.getDate();
  const date = dateNum.toString().padStart(2, '0');

  const monthNum = d.getMonth();
  const month = (monthNum + 1).toString().padStart(2, '0');

  const yearNum = d.getFullYear();
  const year = yearNum.toString();

  const hoursNum = d.getHours();
  const hours = hoursNum.toString().padStart(2, '0');

  const minutesNum = d.getMinutes();
  const minutes = minutesNum.toString().padStart(2, '0');

  const secondsNum = d.getSeconds();
  const seconds = secondsNum.toString().padStart(2, '0');

  return {
    date,
    month,
    year,
    hours,
    minutes,
    seconds,
  };
}

export const getDateFormat = (date: { seconds: number; nanos: number }) => {
  const { date: d, month: m, year: y, hours, minutes } = getDateMonthYear(getDateFromUTC(date));

  return `${d}/${m}/${y}, ${hours}:${minutes}`;
};

export const isJsonString = (str: string) => {
  try {
    return JSON.parse(str) && !!str;
  } catch (e) {
    return false;
  }
};

export const parseJson = (str: string) => {
  return isJsonString(str) ? JSON.parse(str) : {};
};

export function isFunction(functionToCheck) {
  return functionToCheck && typeof functionToCheck === 'function';
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getRestHeightOfBrowser(element: HTMLElement, height: number = 0) {
  if (!element) return 0;

  const rectEl = element.getBoundingClientRect();
  const rest = window.innerHeight - rectEl.top + height;
  return rest;
}

export const getRandomColor = () => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16);
};

export const getColorWithCharacter = (letter: string) => {
  if (!letter) return getRandomColor();
  const character = letter.slice(0, 1);
  return defaultCharacterColorMapping[character] || getRandomColor();
};

export const formatAmountToPercent = (amount: number, totalValue: number) => {
  return Math.round((amount / totalValue) * 100);
};

const blue = '#0934E0';
const red = '#F53131';
const purple = '#5D1BE0';
const green = '#29E08B';
const yellow = '#FFD52F';

export const defaultCharacterColorMapping = {
  '-': '#7C84A3',
  '': '#7C84A3',
  undefined: '#7C84A3',
  a: blue,
  A: blue,
  b: red,
  B: red,
  c: purple,
  C: purple,
  d: blue,
  D: blue,
  e: yellow,
  E: yellow,
  f: blue,
  F: blue,
  g: red,
  G: red,
  h: purple,
  H: purple,
  i: green,
  I: green,
  j: yellow,
  J: yellow,
  k: blue,
  K: blue,
  l: red,
  L: red,
  m: blue,
  M: blue,
  n: green,
  N: green,
  o: yellow,
  O: yellow,
  p: blue,
  P: blue,
  q: red,
  Q: red,
  r: purple,
  R: purple,
  s: green,
  S: green,
  t: yellow,
  T: yellow,
  u: blue,
  U: blue,
  v: red,
  V: red,
  w: purple,
  W: purple,
  x: green,
  X: green,
  y: yellow,
  Y: yellow,
  z: blue,
  Z: blue,
};

export const formatOptions = (
  arr: any[] = [],
  configProps: {
    name: string;
    value: string;
    valueType?: string;
  },
) => {
  return arr.map((item) => ({
    name: item[configProps.name] ? item[configProps.name] : '',
    value: item[configProps.value]
      ? configProps.valueType === 'string'
        ? item[configProps.value].toString()
        : item[configProps.value]
      : undefined,
  }));
};
