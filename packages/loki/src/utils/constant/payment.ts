import { MethodType, PaymentType, PaymentWithDetail, Status } from '@mcuc/stark/stark_pb';
import { TelcoName } from '@mcuc/groot/groot_pb';
import { BankName } from '@mcuc/stark/pepper_pb';
import { EWalletName } from '@mcuc/stark/tony_pb';
import { CryptoWalletName } from '@mcuc/stark/ultron_pb';
import { t } from 'i18next';
import { combineCryptoTypeAndNetwork } from './crypto';
import { Merchant } from '@mcuc/natasha/natasha_pb';
import { UserInfoCustom } from 'redux/features/users/types';
import { PerformPermission } from 'configs/routes/permission';

export const CURRENCY_TYPE = {
  VND: 'VND',
  USDT: 'USDT',
};
export const PAYMENT_TYPES = [
  {
    value: PaymentType.TOPUP,
    name: t('Top-up'),
  },
  {
    value: PaymentType.WITHDRAW,
    name: t('Withdraw'),
  },
];

export const getPaymentType = (paymentType: number): { value: number; name: string } | undefined => {
  return PAYMENT_TYPES.find((item) => item.value === paymentType);
};

export const METHOD_TYPES = [
  {
    value: MethodType.T,
    name: t('Bank Transfer'),
  },
  {
    value: MethodType.I,
    name: t('Internet Banking'),
  },
  {
    value: MethodType.P,
    name: t('Telco'),
  },
  {
    value: MethodType.E,
    name: t('E Wallet'),
  },
  {
    value: MethodType.C,
    name: t('Crypto'),
  },
];

export const getMethodType = (methodType: number): { value: number; name: string } | undefined => {
  return METHOD_TYPES.find((item) => item.value === methodType);
};

export const PAYMENT_STATUS = [
  {
    value: Status.CREATED,
    name: t('New'),
  },
  {
    value: Status.CANCELED,
    name: t('Canceled'),
  },
  {
    value: Status.APPROVED,
    name: t('Approved'),
  },
  {
    value: Status.REJECTED,
    name: t('Rejected'),
  },
];

export const getPaymentStatus = (status: number): { value: number; name: string } | undefined => {
  return PAYMENT_STATUS.find((item) => item.value === status);
};

export const BANKS = [
  {
    value: BankName.VIETCOMBANK,
    name: 'Vietcombank',
  },
  {
    value: BankName.SACOMBANK,
    name: 'Sacombank',
  },
  {
    value: BankName.ACB,
    name: 'ACB',
  },
  {
    value: BankName.VIETINBANK,
    name: 'Vietinbank',
  },
  {
    value: BankName.BIDV,
    name: 'BIDV',
  },
];

export const BANKS_STRING = {
  [BankName.VIETCOMBANK]: 'VIETCOMBANK',
  [BankName.SACOMBANK]: 'SACOMBANK',
  [BankName.ACB]: 'ACB',
  [BankName.VIETINBANK]: 'VIETINBANK',
  [BankName.BIDV]: 'BIDV',
};

export const getBank = (bank: number): { value: number; name: string } | undefined => {
  return BANKS.find((item) => item.value === bank);
};

export const EWALLETS = [
  {
    value: EWalletName.MOMO,
    name: 'MOMO',
  },
  {
    value: EWalletName.ZALOPAY,
    name: 'Zalopay',
  },
];

export const getEWallet = (eWallet: number): { value: number; name: string } | undefined => {
  return EWALLETS.find((item) => item.value === eWallet);
};

export const TELCOS = [
  {
    value: TelcoName.VIETTEL,
    name: 'Viettel',
  },
  {
    value: TelcoName.MOBIPHONE,
    name: 'Mobiphone',
  },
  {
    value: TelcoName.VINAPHONE,
    name: 'Vinaphone',
  },
  {
    value: TelcoName.VIETNAMMOBILE,
    name: 'Vietnamobile',
  },
];

export const getTelco = (telco: number): { value: number; name: string } | undefined => {
  return TELCOS.find((item) => item.value === telco);
};

export const CRYPTOS = [
  {
    value: CryptoWalletName.UMO,
    name: 'UMO',
  },
];

export const getCrypto = (crypto: number): { value: number; name: string } | undefined => {
  return CRYPTOS.find((item) => item.value === crypto);
};

export const getListCheckPaymentMethod = (method: MethodType) => {
  return {
    isCrypto: method === MethodType.C,
    isBank: method === MethodType.T,
    isTelco: method === MethodType.P,
    isEWallet: method === MethodType.E,
  };
};

export const getPaymentProviderFromMethodType = (paymentWithDetail: PaymentWithDetail.AsObject) => {
  const paymentDetail = paymentWithDetail.paymentDetail;
  const method = paymentWithDetail.payment.method;
  if (method === MethodType.T) return getBank(paymentDetail.banking.merchantUserBankName);
  if (method === MethodType.P) return getTelco(paymentDetail.telco.telcoName);
  if (method === MethodType.E) return getEWallet(paymentDetail.eWallet.eWalletName);
  if (method === MethodType.C) return getCrypto(paymentDetail.crypto.cryptoWalletName);
};

export const getPaymentDetail = (paymentWithDetail: PaymentWithDetail.AsObject) => {
  const paymentDetail = paymentWithDetail.paymentDetail;
  const method = paymentWithDetail.payment.method;
  if (method === MethodType.T) return paymentDetail.banking;
  if (method === MethodType.P) return paymentDetail.telco;
  if (method === MethodType.E) return paymentDetail.eWallet;
  if (method === MethodType.C) return paymentDetail.crypto;
};

export const getPaymentDetailAmount = (paymentWithDetail: PaymentWithDetail.AsObject) => {
  const paymentDetail = paymentWithDetail.paymentDetail;
  const method = paymentWithDetail.payment.method;

  if (method === MethodType.T) return paymentDetail.banking.amount;
  if (method === MethodType.P) return paymentDetail.telco.amount;
  if (method === MethodType.E) return paymentDetail.eWallet.amount;
  if (method === MethodType.C) return paymentDetail.crypto.amount;
};

export const getPaymentDetailPayerName = (paymentWithDetail: PaymentWithDetail.AsObject) => {
  const paymentDetail = paymentWithDetail.paymentDetail;
  const method = paymentWithDetail.payment.method;
  const type = paymentWithDetail.payment.type;

  if (type === PaymentType.TOPUP) {
    if (method === MethodType.T) return paymentDetail.banking.merchantUserAccountName;
    if (method === MethodType.P) return undefined;
    if (method === MethodType.E) return paymentDetail.eWallet.merchantUserAccountName;
    if (method === MethodType.C)
      return combineCryptoTypeAndNetwork(paymentDetail.crypto.cryptoType, paymentDetail.crypto.cryptoNetworkType);
  }

  if (type === PaymentType.WITHDRAW) {
    if (method === MethodType.T) return paymentDetail.banking.systemAccountName;
    // TODO: Telco Missing Payer name
    if (method === MethodType.P) return undefined;
    if (method === MethodType.E) return paymentDetail.eWallet.systemAccountName;
    if (method === MethodType.C)
      return combineCryptoTypeAndNetwork(paymentDetail.crypto.cryptoType, paymentDetail.crypto.cryptoNetworkType);
  }
};

export const getPaymentDetailPayerAccount = (paymentWithDetail: PaymentWithDetail.AsObject) => {
  const paymentDetail = paymentWithDetail.paymentDetail;
  const method = paymentWithDetail.payment.method;
  const type = paymentWithDetail.payment.type;

  if (type === PaymentType.TOPUP) {
    if (method === MethodType.T) return paymentDetail.banking.merchantUserAccountNumber;
    // TODO: Telco Missing Payer name
    if (method === MethodType.P) return undefined;
    if (method === MethodType.E) return paymentDetail.eWallet.merchantUserAccountPhoneNumber;
    if (method === MethodType.C) return paymentDetail.crypto.senderAddress;
  }

  if (type === PaymentType.WITHDRAW) {
    if (method === MethodType.T) return paymentDetail.banking.systemAccountNumber;
    // TODO: Telco Missing Payer name
    if (method === MethodType.P) return undefined;
    if (method === MethodType.E) return paymentDetail.eWallet.systemAccountPhoneNumber;
    if (method === MethodType.C) return paymentDetail.crypto.senderAddress;
  }
};

export const getPaymentDetailPayeeName = (paymentWithDetail: PaymentWithDetail.AsObject) => {
  const paymentDetail = paymentWithDetail.paymentDetail;
  const method = paymentWithDetail.payment.method;
  const type = paymentWithDetail.payment.type;

  if (type === PaymentType.TOPUP) {
    if (method === MethodType.T) return paymentDetail.banking.systemAccountName;
    // TODO: Telco Missing Payee name
    if (method === MethodType.P) return undefined;
    if (method === MethodType.E) return paymentDetail.eWallet.systemAccountName;
    if (method === MethodType.C) return paymentDetail.crypto.receiverAddress;
  }

  if (type === PaymentType.WITHDRAW) {
    if (method === MethodType.T) return paymentDetail.banking.merchantUserAccountName;
    // TODO: Telco Missing Payee name
    if (method === MethodType.P) return undefined;
    if (method === MethodType.E) return paymentDetail.eWallet.merchantUserAccountName;
    if (method === MethodType.C) return paymentDetail.crypto.receiverAddress;
  }
};

export const getPaymentDetailPayeeAccount = (paymentWithDetail: PaymentWithDetail.AsObject) => {
  const paymentDetail = paymentWithDetail.paymentDetail;
  const method = paymentWithDetail.payment.method;
  const type = paymentWithDetail.payment.type;

  if (type === PaymentType.TOPUP) {
    if (method === MethodType.T) return paymentDetail.banking.systemAccountNumber;
    // TODO: Telco Missing Payer account
    if (method === MethodType.P) return undefined;
    if (method === MethodType.E) return paymentDetail.eWallet.systemAccountPhoneNumber;
    if (method === MethodType.C) return paymentDetail.crypto.receiverAddress;
  }

  if (type === PaymentType.WITHDRAW) {
    if (method === MethodType.T) return paymentDetail.banking.merchantUserAccountNumber;
    // TODO: Telco Missing Payer account
    if (method === MethodType.P) return undefined;
    if (method === MethodType.E) return paymentDetail.eWallet.merchantUserAccountPhoneNumber;
    if (method === MethodType.C) return paymentDetail.crypto.receiverAddress;
  }
};

export const getPermissionForApproveWithdraw = (method: MethodType) => {
  if (method === MethodType.T) return [PerformPermission.paymentWithdrawDetail.approveBankingWithdraw];
  if (method === MethodType.P) return [PerformPermission.paymentWithdrawDetail.approveTelcoWithdraw];
  if (method === MethodType.C) return [PerformPermission.paymentWithdrawDetail.approveCryptoWithdraw];
  return [];
};

export const getPermissionForRejectWithdraw = (method: MethodType) => {
  if (method === MethodType.T) return [PerformPermission.paymentWithdrawDetail.rejectBankingWithdraw];
  if (method === MethodType.P) return [PerformPermission.paymentWithdrawDetail.rejectTelcoWithdraw];
  if (method === MethodType.C) return [PerformPermission.paymentWithdrawDetail.rejectCryptoWithdraw];
  return [];
};

export const getPermissionForApproveTopUp = (method: MethodType) => {
  if (method === MethodType.T) return [PerformPermission.paymentTopUpDetail.approveBankingTopUp];
  if (method === MethodType.P) return [PerformPermission.paymentTopUpDetail.approveTelcoTopUp];
  if (method === MethodType.E) return [PerformPermission.paymentTopUpDetail.approveEWalletTopUp];
  if (method === MethodType.C) return [PerformPermission.paymentTopUpDetail.approveCryptoTopUp];
  return [];
};

export const getPermissionForRejectTopUp = (method: MethodType) => {
  if (method === MethodType.T) return [PerformPermission.paymentTopUpDetail.rejectBankingTopUp];
  if (method === MethodType.P) return [PerformPermission.paymentTopUpDetail.rejectTelcoTopUp];
  if (method === MethodType.E) return [PerformPermission.paymentTopUpDetail.rejectEWalletTopUp];
  if (method === MethodType.C) return [PerformPermission.paymentTopUpDetail.rejectCryptoTopUp];
  return [];
};

export const getCurrencyType = (method: MethodType) => {
  if (!method) return '';
  if (method === MethodType.C) return CURRENCY_TYPE.USDT;
  return CURRENCY_TYPE.VND;
};

const IS_MERCHANT = 'M';
const IS_UMO = 'UMO';
const IS_SYSTEM = 'system';

export const getUserPerformed = (
  userId: string | number,
  merchantsMap: Record<number, Merchant.AsObject>,
  usersMap: Record<number, UserInfoCustom>,
): { id: string | number; name: string; imageUrl: string } | undefined => {
  if (userId) {
    // * MERCHANT USER
    if (typeof userId === 'string' && userId[0] === IS_MERCHANT) {
      return {
        id: (merchantsMap[userId.slice(1)] as Merchant.AsObject)?.id,
        name: (merchantsMap[userId.slice(1)] as Merchant.AsObject)?.name,
        imageUrl: (merchantsMap[userId.slice(1)] as Merchant.AsObject)?.logoPath,
      };
    }

    // * SYSTEM USER
    if (typeof userId === 'string' && userId.includes(IS_SYSTEM)) {
      return {
        id: 'System',
        name: t('System'),
        imageUrl: undefined,
      };
    }

    // * UMO USER
    if (typeof userId === 'string' && userId.includes(IS_UMO)) {
      return {
        id: userId,
        name: userId,
        imageUrl: undefined,
      };
    }

    // * TELLER USER
    return {
      id: userId,
      name: usersMap[+userId]?.metadata.fullName,
      imageUrl: usersMap[+userId]?.metadata.picture,
    };
  }
  return;
};
