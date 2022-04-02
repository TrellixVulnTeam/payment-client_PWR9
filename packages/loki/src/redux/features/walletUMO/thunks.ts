import {
  ApproveCryptoWithdrawRequest,
  CancelCryptoTopUpRequest,
  CancelCryptoWithdrawRequest,
  CreateCryptoWithdrawRequest,
  ImportCryptoWalletsRequest,
  ListCryptoWalletsRequest,
  LoadCryptoWalletsRequest,
  ValidateCryptoWalletsRequest,
} from '@mcuc/stark/ultron_pb';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { gRPCUltronClient } from 'services/grpc/ultron/client';

export const getCryptoWalletThunk = createAsyncThunk(
  'walletUMO/getCryptoWallet',
  async (payload: ListCryptoWalletsRequest.AsObject) => {
    return await gRPCUltronClient.listCryptoWallets(payload);
  },
);

export const importCryptoWalletsThunk = createAsyncThunk(
  'walletUMO/importCryptoWallets',
  async (payload: ImportCryptoWalletsRequest.AsObject) => {
    return await gRPCUltronClient.importCryptoWallets(payload);
  },
);

export const approveCryptoWithdrawThunk = createAsyncThunk(
  'walletUMO/approveCryptoWithdraw',
  async (payload: ApproveCryptoWithdrawRequest.AsObject) => {
    return await gRPCUltronClient.approveCryptoWithdraw(payload);
  },
);

export const cancelCryptoTopUpThunk = createAsyncThunk(
  'walletUMO/cancelCryptoTopUp',
  async (payload: CancelCryptoTopUpRequest.AsObject) => {
    return await gRPCUltronClient.cancelCryptoTopUp(payload);
  },
);

export const cancelCryptoWithdrawThunk = createAsyncThunk(
  'walletUMO/cancelCryptoWithdraw',
  async (payload: CancelCryptoWithdrawRequest.AsObject) => {
    return await gRPCUltronClient.cancelCryptoWithdraw(payload);
  },
);

export const createCryptoWithdrawThunk = createAsyncThunk(
  'walletUMO/createCryptoWithdraw',
  async (payload: CreateCryptoWithdrawRequest.AsObject) => {
    return await gRPCUltronClient.createCryptoWithdraw(payload);
  },
);

export const loadCryptoWalletsThunk = createAsyncThunk(
  'walletUMO/loadCryptoWallets',
  async (payload: LoadCryptoWalletsRequest.AsObject) => {
    return await gRPCUltronClient.loadCryptoWallets(payload);
  },
);

export const validateCryptoWalletsThunk = createAsyncThunk(
  'walletUMO/validateCryptoWallets',
  async (payload: ValidateCryptoWalletsRequest.AsObject) => {
    return await gRPCUltronClient.validateCryptoWallets(payload);
  },
);
