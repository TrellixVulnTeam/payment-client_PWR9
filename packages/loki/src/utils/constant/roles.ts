export const ROLES = [
  {
    value: 1,
    name: 'Teller',
  },
  {
    value: 2,
    name: 'Accountant',
  },
  {
    value: 3,
    name: 'Guest',
  },
];

export const getRole = (role: number): { value: number; name: string } | undefined => {
  return ROLES.find((item) => item.value === role);
};
