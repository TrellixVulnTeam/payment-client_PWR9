export const formatPriceVND = (number: string | number) => {
  const result = Number(number);
  return typeof result === 'number' ? result.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&.') : 0;
};

export function toNumber(value?: string) {
  if (value !== undefined) {
    return parseInt(value, 10);
  }
}

export function toString(value?: string) {
  if (value === '' || value === 'null' || value === 'undefined') {
    return;
  }
  return value;
}

export function toBoolean(value?: string) {
  return value === 'true';
}
