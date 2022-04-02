import i18n from 'i18n';

const errorMessage = {
  EWALLET_NOT_FOUND_MERCHANT: 'E-Wallet is not found merchant',
  EWALLET_EXISTED: 'E-Wallet is existed',
  EWALLET_INVALID: 'E-Wallet is invalid',
  EWALLET_EMPTY: 'E-Wallet is empty',
  EWALLET_ACCOUNT_EXISTED: 'E-Wallet account existed',
  EWALLET_ACCOUNT_ID_EXISTED: 'E-Wallet account id existed',
  EWALLET_ACCOUNT_NUMBER_INVALID: 'E-Wallet account number invalid',
  EWALLET_ACCOUNT_NAME_INVALID: 'E-Wallet account name invalid',
  EWALLET_ACCOUNT_BALANCE_INVALID: 'E-Wallet account balance invalid',
  EWALLET_PHONE_NUMBER_INVALID: 'E-Wallet phone number is invalid',
  0: 'There was an error. Please try again',
};

export const getMessageErrorFromEWalletCode = (errorCode: string) => {
  return i18n.t(errorMessage[errorCode] || errorMessage[0]);
};
