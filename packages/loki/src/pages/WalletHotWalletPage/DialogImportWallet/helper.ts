import i18n from 'i18n';

const errorMessage = {
  CRYPTO_HOT_WALLET_ADDRESS_EMPTY: 'Wallet Address is empty',
  CRYPTO_HOT_WALLET_NOT_FOUND_MERCHANT: 'Wallet not found merchant',
  CRYPTO_HOT_WALLET_ID_EXISTED: 'Wallet ID is existed',
  CRYPTO_HOT_WALLET_BALANCE_INVALID: 'Wallet balance is invalid',
  CRYPTO_HOT_WALLET_DUPLICATED: 'Wallet is duplicated',
  0: 'There was an error. Please try again',
};

export const getMessageErrorFromHotWalletCode = (errorCode: string) => {
  return i18n.t(errorMessage[errorCode] || errorMessage[0]);
};
