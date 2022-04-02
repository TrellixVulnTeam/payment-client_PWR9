import {
  ValidateCryptoHotWalletsRequest,
  ImportCryptoHotWalletsRequest,
  ListCryptoHotWalletsRequest,
  GetSystemCryptoHotWalletsRequest,
} from '@mcuc/stark/ultron_pb';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { gRPCUltronClient } from 'services/grpc/ultron/client';

export const validateCryptoHotWalletsThunk = createAsyncThunk(
  'cryptoHotWallet/validateCryptoHotWallets',
  async (payload: ValidateCryptoHotWalletsRequest.AsObject) => {
    return await gRPCUltronClient.validateCryptoHotWallets(payload);
  },
);

export const importCryptoHotWalletsThunk = createAsyncThunk(
  'cryptoHotWallet/importCryptoHotWallets',
  async (payload: ImportCryptoHotWalletsRequest.AsObject) => {
    return await gRPCUltronClient.importCryptoHotWallets(payload);
  },
);

export const listCryptoHotWalletsThunk = createAsyncThunk(
  'cryptoHotWallet/listCryptoHotWallets',
  async (payload: ListCryptoHotWalletsRequest.AsObject) => {
    return await gRPCUltronClient.listCryptoHotWallets(payload);
  },
);

export const getSystemCryptoHotWalletsThunk = createAsyncThunk(
  'cryptoHotWallet/getSystemCryptoHotWallets',
  async (payload: GetSystemCryptoHotWalletsRequest.AsObject) => {
    return await gRPCUltronClient.getSystemCryptoHotWallets(payload);
  },
);
