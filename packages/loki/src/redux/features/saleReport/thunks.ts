import {
  GetSellReportByMerchantRequest,
  GetSellReportByPaymentMethodRequest,
  GetSellReportByTellerRequest,
  GetSellReportByTimeRangeRequest,
} from '@mcuc/stark/howard_pb';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { gRPCHowardClient } from 'services/grpc/howard/client';

export const getSellReportByTimeRangeThunk = createAsyncThunk(
  'saleReport/getSellReportByTimeRange',
  async (payload: GetSellReportByTimeRangeRequest.AsObject) => {
    return await gRPCHowardClient.getSellReportByTimeRange(payload);
  },
);

export const getSellReportByMerchantThunk = createAsyncThunk(
  'saleReport/getSellReportByMerchant',
  async (payload: GetSellReportByMerchantRequest.AsObject) => {
    return await gRPCHowardClient.getSellReportByMerchant(payload);
  },
);

export const getSellReportByTellerThunk = createAsyncThunk(
  'saleReport/getSellReportByTeller',
  async (payload: GetSellReportByTellerRequest.AsObject) => {
    return await gRPCHowardClient.getSellReportByTeller(payload);
  },
);

export const getSellReportByPaymentMethodThunk = createAsyncThunk(
  'saleReport/getSellReportByPaymentMethod',
  async (payload: GetSellReportByPaymentMethodRequest.AsObject) => {
    return await gRPCHowardClient.getSellReportByPaymentMethod(payload);
  },
);
