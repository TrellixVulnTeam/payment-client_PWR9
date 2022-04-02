export const formatPhoneNumberToSave = (phone: string) => {
  if (phone) {
    return phone.split(' ').join('');
  }
  return phone;
};

export const combinePhoneAndCountryCodeDisplay = (phone: { nationalNumber: string; countryCode: string }) => {
  if (phone && phone.countryCode && phone.nationalNumber) {
    return `(+${phone.countryCode}) ${phone.nationalNumber}`;
  }
  return undefined;
};
