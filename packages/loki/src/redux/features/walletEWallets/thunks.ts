import {
  ListSystemEWalletsRequest,
  UpdateSystemEWalletStatusRequest,
  GetEWalletPaymentCodeRequest,
  CancelEWalletTopUpRequest,
  CreateEWalletTopUpRequest,
  ApproveEWalletTopUpRequest,
  RejectEWalletTopUpRequest,
  GetSystemEWalletsRequest,
  CreateSystemEWalletRequest,
  ValidateSystemEWalletsRequest,
  ImportSystemEWalletsRequest,
} from '@mcuc/stark/tony_pb';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { gRPCTonyClient } from 'services/grpc/tony/client';

export const listSystemEWalletsThunk = createAsyncThunk(
  'walletUMO/listSystemEWallets',
  async (payload: ListSystemEWalletsRequest.AsObject) => {
    return await gRPCTonyClient.listSystemEWallets(payload);
  },
);

export const updateSystemEWalletStatusThunk = createAsyncThunk(
  'walletUMO/updateSystemEWalletStatus',
  async (payload: UpdateSystemEWalletStatusRequest.AsObject) => {
    return await gRPCTonyClient.updateSystemEWalletStatus(payload);
  },
);

export const getEWalletPaymentCodeThunk = createAsyncThunk(
  'walletUMO/getEWalletPaymentCode',
  async (payload: GetEWalletPaymentCodeRequest.AsObject) => {
    return await gRPCTonyClient.getEWalletPaymentCode(payload);
  },
);

export const cancelEWalletTopUpThunk = createAsyncThunk(
  'walletUMO/cancelEWalletTopUp',
  async (payload: CancelEWalletTopUpRequest.AsObject) => {
    return await gRPCTonyClient.cancelEWalletTopUp(payload);
  },
);

export const createEWalletTopUpThunk = createAsyncThunk(
  'walletUMO/createEWalletTopUp',
  async (payload: CreateEWalletTopUpRequest.AsObject) => {
    return await gRPCTonyClient.createEWalletTopUp(payload);
  },
);

export const createSystemEWalletThunk = createAsyncThunk(
  'walletUMO/createSystemEWallet',
  async (payload: CreateSystemEWalletRequest.AsObject) => {
    return await gRPCTonyClient.createSystemEWallet(payload);
  },
);

export const approveEWalletTopUpThunk = createAsyncThunk(
  'walletUMO/approveEWalletTopUp',
  async (payload: ApproveEWalletTopUpRequest.AsObject) => {
    return await gRPCTonyClient.approveEWalletTopUp(payload);
  },
);

export const rejectEWalletTopUpThunk = createAsyncThunk(
  'walletUMO/rejectEWalletTopUp',
  async (payload: RejectEWalletTopUpRequest.AsObject) => {
    return await gRPCTonyClient.rejectEWalletTopUp(payload);
  },
);

export const getSystemEWalletsThunk = createAsyncThunk(
  'walletUMO/getSystemEWallets',
  async (payload: GetSystemEWalletsRequest.AsObject) => {
    return await gRPCTonyClient.getSystemEWallets(payload);
  },
);

export const validateSystemEWalletsThunk = createAsyncThunk(
  'walletUMO/validateSystemEWallets',
  async (payload: ValidateSystemEWalletsRequest.AsObject) => {
    return await gRPCTonyClient.validateSystemEWallets(payload);
  },
);

export const importSystemEWalletsThunk = createAsyncThunk(
  'walletUMO/importSystemEWallets',
  async (payload: ImportSystemEWalletsRequest.AsObject) => {
    return await gRPCTonyClient.importSystemEWallets(payload);
  },
);
