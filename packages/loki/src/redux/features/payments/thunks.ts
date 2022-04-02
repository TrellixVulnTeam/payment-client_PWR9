import {
  GetIsMerchantUserBankAccountVerifiedRequest,
  VerifyMerchantUserBankAccountRequest,
} from '@mcuc/stark/pepper_pb';
import { MethodType } from '@mcuc/stark/stark_pb';
import {
  GetPaymentDetailRequest,
  ListPaymentsRequest,
  GetPaymentInfoByPaymentCodeRequest,
} from '@mcuc/stark/vision_pb';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { gRPCMorganClient } from 'services/grpc/morgan/client';
import { gRPCPepperClient } from 'services/grpc/pepper/client';
import { gRPCTonyClient } from 'services/grpc/tony/client';
import { gRPCUltronClient } from 'services/grpc/ultron/client';
import { gRPCVisionClient } from 'services/grpc/vision/client';
import {
  ApprovePaymentTopUpRequest,
  ApprovePaymentWithdrawRequest,
  CreatePaymentTopUpRequest,
  RejectPaymentTopUpRequest,
  SubmitPaymentWithdrawRequest,
} from './types';

export const listPaymentsThunk = createAsyncThunk(
  'payments/listPayments',
  async (payload: ListPaymentsRequest.AsObject) => {
    return await gRPCVisionClient.listPayments(payload);
  },
);

export const getPaymentDetailThunk = createAsyncThunk(
  'payments/getPaymentDetail',
  async (payload: GetPaymentDetailRequest.AsObject) => {
    return await gRPCVisionClient.getPaymentDetail(payload);
  },
);

export const verifyMerchantUserBankAccountThunk = createAsyncThunk(
  'payments/verifyMerchantUserBankAccount',
  async (payload: VerifyMerchantUserBankAccountRequest.AsObject) => {
    return await gRPCPepperClient.verifyMerchantUserBankAccount(payload);
  },
);

export const getIsMerchantUserBankAccountVerifiedThunk = createAsyncThunk(
  'payments/getIsMerchantUserBankAccountVerified',
  async (payload: GetIsMerchantUserBankAccountVerifiedRequest.AsObject) => {
    return await gRPCPepperClient.getIsMerchantUserBankAccountVerified(payload);
  },
);

export const getPaymentInfoByPaymentCodeThunk = createAsyncThunk(
  'payments/verifyMerchantUserBankAccount',
  async (payload: GetPaymentInfoByPaymentCodeRequest.AsObject) => {
    return await gRPCVisionClient.getPaymentInfoByPaymentCode(payload);
  },
);

export const approvePaymentTopUpThunk = createAsyncThunk(
  'payments/approvePaymentTopUp',
  async (payload: ApprovePaymentTopUpRequest) => {
    const { imageUrl, method, note, paymentId, txId } = payload;
    if (method === MethodType.C) {
      return await gRPCUltronClient.approveCryptoTopUp({
        paymentId,
        note,
      });
    }

    if (method === MethodType.E) {
      return await gRPCTonyClient.approveEWalletTopUp({
        imageUrl,
        note,
        paymentId,
        txId,
      });
    }

    if (method === MethodType.P) {
      return await gRPCMorganClient.approveTelcoTopUp({
        note,
        paymentId,
      });
    }

    if (method === MethodType.T) {
      return await gRPCPepperClient.approveBankingTopUp({
        imageUrl,
        note,
        paymentId,
        txId,
      });
    }
  },
);

export const approvePaymentWithdrawThunk = createAsyncThunk(
  'payments/approveWithdrawPayment',
  async (payload: ApprovePaymentWithdrawRequest) => {
    const { note, paymentId } = payload;
    if (payload.method === MethodType.T) {
      return await gRPCPepperClient.approveBankingWithdraw({
        note,
        paymentId,
      });
    }

    if (payload.method === MethodType.C) {
      return await gRPCUltronClient.approveCryptoWithdraw({
        paymentId,
        note,
      });
    }

    if (payload.method === MethodType.P) {
      return await gRPCMorganClient.approveTelcoWithdraw({
        paymentId,
        note,
      });
    }
  },
);

export const submitPaymentWithdrawThunk = createAsyncThunk(
  'payments/submitPaymentWithdrawThunk',
  async (payload: SubmitPaymentWithdrawRequest) => {
    if (payload.methodType === MethodType.T) {
      return await gRPCPepperClient.submitBankingWithdraw({
        accountName: payload.accountName,
        accountNumber: payload.accountNumber,
        amount: payload.amount,
        bankName: payload.bankName,
        fee: payload.fee,
        imageUrl: payload.imageUrl,
        paymentId: payload.paymentId,
        txId: payload.txId,
        note: payload.note,
      });
    }

    if (payload.methodType === MethodType.C) {
      return await gRPCUltronClient.submitCryptoWithdraw({
        amount: payload.amount,
        fee: payload.fee,
        paymentId: payload.paymentId,
        senderAddress: payload.senderAddress,
        txHash: payload.txHash,
        note: payload.note,
        imageUrl: payload.imageUrl,
      });
    }
  },
);

export const rejectPaymentTopUpThunk = createAsyncThunk(
  'payments/rejectPaymentTopUp',
  async (payload: RejectPaymentTopUpRequest) => {
    const { method, note, paymentId, isMerchantCall } = payload;
    if (method === MethodType.C) {
      return await gRPCUltronClient.rejectCryptoTopUp({
        paymentId,
        note,
        isMerchantCall,
      });
    }

    if (method === MethodType.E) {
      return await gRPCTonyClient.rejectEWalletTopUp({
        paymentId,
        note,
        isMerchantCall,
      });
    }

    if (method === MethodType.P) {
      return await gRPCMorganClient.rejectTelcoTopUp({
        paymentId,
        note,
        isMerchantCall,
      });
    }

    if (method === MethodType.T) {
      return await gRPCPepperClient.rejectBankingTopUp({
        paymentId,
        note,
        isMerchantCall,
      });
    }
  },
);

export const rejectPaymentWithdrawThunk = createAsyncThunk(
  'payments/rejectPaymentTopUp',
  async (payload: RejectPaymentTopUpRequest) => {
    const { method, note, paymentId, isMerchantCall } = payload;
    if (method === MethodType.C) {
      return await gRPCUltronClient.rejectCryptoWithdraw({
        paymentId,
        note,
        isMerchantCall,
      });
    }

    if (method === MethodType.P) {
      return await gRPCMorganClient.rejectTelcoWithdraw({
        paymentId,
        note,
        isMerchantCall,
      });
    }

    if (method === MethodType.T) {
      return await gRPCPepperClient.rejectBankingWithdraw({
        paymentId,
        note,
        isMerchantCall,
      });
    }
  },
);

export const createPaymentTopUpThunk = createAsyncThunk(
  'payments/verifyMerchantUserBankAccount',
  async (payload: CreatePaymentTopUpRequest) => {
    const { amount, merchantUserAccount, merchantUserName, method, note, paymentCode, systemAccount, systemName } =
      payload;
    if (method === MethodType.E) {
      return await gRPCTonyClient.createEWalletTopUp({
        amount,
        note,
        paymentCode,
        merchantUserAccountName: merchantUserName,
        merchantUserAccountPhoneNumber: merchantUserAccount,
        systemAccountName: systemName,
        systemAccountPhoneNumber: systemAccount,
      });
    }

    if (method === MethodType.T) {
      return await gRPCPepperClient.createBankingTopUp({
        amount,
        note,
        paymentCode,
        merchantUserAccountName: merchantUserName,
        merchantUserAccountNumber: merchantUserAccount,
        systemAccountName: systemName,
        systemAccountNumber: systemAccount,
      });
    }
  },
);
