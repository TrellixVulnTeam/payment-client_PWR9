import {
  CreateSystemBankAccountRequest,
  GetBankPaymentCodeRequest,
  ImportSystemBankAccountRequest,
  ListSystemBankAccountsRequest,
  UpdateSystemBankAccountStatusRequest,
  ValidateImportSystemBankAccountRequest,
  VerifyMerchantUserBankAccountRequest,
  ListSystemBankAccountByPaymentInfoRequest,
} from '@mcuc/stark/pepper_pb';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { gRPCPepperClient } from 'services/grpc/pepper/client';

export const listSystemBankAccountsThunk = createAsyncThunk(
  'walletBank/listSystemBankAccounts',
  async (payload: ListSystemBankAccountsRequest.AsObject) => {
    return await gRPCPepperClient.listSystemBankAccounts(payload);
  },
);

export const getBankPaymentCodeThunk = createAsyncThunk(
  'walletBank/getBankPaymentCode',
  async (payload: GetBankPaymentCodeRequest.AsObject) => {
    return await gRPCPepperClient.getBankPaymentCode(payload);
  },
);

export const createSystemBankAccountThunk = createAsyncThunk(
  'walletBank/createSystemBankAccount',
  async (payload: CreateSystemBankAccountRequest.AsObject) => {
    return await gRPCPepperClient.createSystemBankAccount(payload);
  },
);

export const importSystemBankAccountThunk = createAsyncThunk(
  'walletBank/importSystemBankAccount',
  async (payload: ImportSystemBankAccountRequest.AsObject) => {
    return await gRPCPepperClient.importSystemBankAccount(payload);
  },
);

export const updateSystemBankAccountStatusThunk = createAsyncThunk(
  'walletBank/updateSystemBankAccountStatus',
  async (payload: UpdateSystemBankAccountStatusRequest.AsObject) => {
    return await gRPCPepperClient.updateSystemBankAccountStatus(payload);
  },
);

export const verifyMerchantUserBankAccountThunk = createAsyncThunk(
  'walletBank/verifyMerchantUserBankAccount',
  async (payload: VerifyMerchantUserBankAccountRequest.AsObject) => {
    return await gRPCPepperClient.verifyMerchantUserBankAccount(payload);
  },
);

export const validateImportSystemBankAccountThunk = createAsyncThunk(
  'walletBank/validateImportSystemBankAccountThunk',
  async (payload: ValidateImportSystemBankAccountRequest.AsObject) => {
    return await gRPCPepperClient.validateImportSystemBankAccount(payload);
  },
);

export const listSystemBankAccountByPaymentInfoThunk = createAsyncThunk(
  'walletBank/validateImportSystemBankAccountThunk',
  async (payload: ListSystemBankAccountByPaymentInfoRequest.AsObject) => {
    return await gRPCPepperClient.listSystemBankAccountByPaymentInfo(payload);
  },
);
