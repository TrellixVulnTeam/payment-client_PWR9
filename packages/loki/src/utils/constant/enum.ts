export const ROLES = [
  {
    value: '1',
    label: 'Teller',
  },
  {
    value: '2',
    label: 'Accountant',
  },
  {
    value: '3',
    label: 'Guest',
  },
];

export const getRole = (
  role: string,
): { value: string; label: string } | undefined => {
  return ROLES.find((item) => item.value === role);
};
