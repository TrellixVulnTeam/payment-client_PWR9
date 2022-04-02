import { SubmitBankingWithdrawRequest, SystemBank } from '@mcuc/stark/pepper_pb';
import { MethodType } from '@mcuc/stark/stark_pb';
import { SystemEWallet } from '@mcuc/stark/tony_pb';
import { SubmitCryptoWithdrawRequest } from '@mcuc/stark/ultron_pb';

export function isSystemEWallet(
  methodType: SystemEWallet.AsObject | SystemBank.AsObject,
): methodType is SystemEWallet.AsObject {
  return (methodType as SystemEWallet.AsObject).eWalletName !== undefined;
}

export type ApprovePaymentTopUpRequest = {
  method: MethodType;
  paymentId: number;
  txId: string;
  note: string;
  imageUrl: string;
};

export type ApprovePaymentWithdrawRequest = {
  method: MethodType;
  paymentId: number;
  note: string;
};

export type SubmitPaymentWithdrawRequest =
  | ({
      methodType: MethodType.C;
    } & SubmitCryptoWithdrawRequest.AsObject)
  | ({
      methodType: MethodType.T;
    } & SubmitBankingWithdrawRequest.AsObject);

export type RejectPaymentTopUpRequest = {
  method: MethodType;
  paymentId: number;
  note: string;
  isMerchantCall: boolean;
};

export type RejectPaymentWithdrawRequest = {
  method: MethodType;
  paymentId: number;
  note: string;
  isMerchantCall: boolean;
};

export type CreatePaymentTopUpRequest = {
  method: MethodType;
  amount: number;
  paymentCode: string;
  note: string;
  merchantUserAccount: string;
  merchantUserName: string;
  systemAccount: string;
  systemName: string;
};

export type CreatePaymentWithdrawRequest = {
  method: MethodType;
  amount: number;
  paymentCode: string;
  note: string;
  merchantUserAccount: string;
  merchantUserName: string;
  systemAccount: string;
  systemName: string;
};
