import { createAsyncThunk } from '@reduxjs/toolkit';
import { gRPCHowardClient } from 'services/grpc/howard/client';
import { GetStatisticRequest, GetProcessingPerformanceRequest, GetTotalAmountRequest } from '@mcuc/stark/howard_pb';

export const getStatisticThunk = createAsyncThunk(
  'statistics/getStatistics',
  async (payload: GetStatisticRequest.AsObject) => {
    return await gRPCHowardClient.getStatistics(payload);
  },
);

export const getProcessingPerformanceThunk = createAsyncThunk(
  'statistics/getProcessingPerformance',
  async (payload: GetProcessingPerformanceRequest.AsObject) => {
    return await gRPCHowardClient.getProcessingPerformance(payload);
  },
);

export const getTotalAmountThunk = createAsyncThunk(
  'statistics/getTotalAmount',
  async (payload: GetTotalAmountRequest.AsObject) => {
    return await gRPCHowardClient.getTotalAmount(payload);
  },
);
