import i18n from 'i18n';

const errorMessage = {
  BANK_NOT_FOUND_MERCHANT: 'Bank is not found merchant',
  BANK_EXISTED: 'Bank is existed',
  BANK_INVALID: 'Bank is invalid',
  BANK_EMPTY: 'Bank is empty',
  BANK_ACCOUNT_EXISTED: 'Bank account existed',
  BANK_ACCOUNT_ID_EXISTED: 'Bank account id existed',
  BANK_ACCOUNT_NUMBER_INVALID: 'Bank account number invalid',
  BANK_ACCOUNT_NAME_INVALID: 'Bank account name invalid',
  BANK_ACCOUNT_BALANCE_INVALID: 'Bank account balance invalid',
  0: 'There was an error. Please try again',
};

export const getMessageErrorFromBankCode = (errorCode: string) => {
  return i18n.t(errorMessage[errorCode] || errorMessage[0]);
};
