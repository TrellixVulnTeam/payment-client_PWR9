export const convertNumber = (value: string) => {
  if (typeof value === 'string') {
    return parseInt((value || '').replace(/[^0-9]+/g, ''), 10);
  }

  return value;
};
