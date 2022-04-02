import {
  GetMerchantBalanceRequest,
  GetMerchantRequest,
  ListMerchantsRequest,
  MakePaymentRequest,
} from '@mcuc/natasha/natasha_pb';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { gRPCMerchantsClient } from 'services/grpc/merchant/client';
import { gRPCMerchantsBalanceClient } from 'services/grpc/merchantBalance/client';

export const getListMerchantsThunk = createAsyncThunk(
  'merchant/getListMerchants',
  async (payload: ListMerchantsRequest.AsObject) => {
    return await gRPCMerchantsClient.getListMerchants(payload);
  },
);

export const getMerchantThunk = createAsyncThunk(
  'merchant/getMerchantThunk',
  async (payload: GetMerchantRequest.AsObject) => {
    return await gRPCMerchantsClient.getMerchant(payload);
  },
);

export const getMerchantBalanceThunk = createAsyncThunk(
  'merchant/getMerchantBalance',
  async (payload: GetMerchantBalanceRequest.AsObject) => {
    return await gRPCMerchantsBalanceClient.getMerchantBalance(payload);
  },
);

export const makePaymentThunk = createAsyncThunk(
  'merchant/makePayment',
  async (payload: MakePaymentRequest.AsObject) => {
    return await gRPCMerchantsBalanceClient.makePayment(payload);
  },
);
