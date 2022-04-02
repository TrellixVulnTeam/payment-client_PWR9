import {
  GetProcessingPerformanceRequest,
  GetStatisticRequest,
  GetTotalAmountRequest,
  GetReportRequest,
} from '@mcuc/stark/howard_pb';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { gRPCReportClient } from 'services/grpc/report/client';

export const getReportOverview = createAsyncThunk('report/getReport', async (payload: GetStatisticRequest.AsObject) => {
  return await gRPCReportClient.getStatistic(payload);
});

export const getStatisticThunk = createAsyncThunk(
  'report/getStatistic',
  async (payload: GetStatisticRequest.AsObject) => {
    return await gRPCReportClient.getStatistic(payload);
  },
);

export const getProcessingPerformanceThunk = createAsyncThunk(
  'report/getProcessingPerformance',
  async (payload: GetProcessingPerformanceRequest.AsObject) => {
    return await gRPCReportClient.getProcessingPerformance(payload);
  },
);

export const getTotalAmountThunk = createAsyncThunk(
  'report/getTotalAmount',
  async (payload: GetTotalAmountRequest.AsObject) => {
    return await gRPCReportClient.getTotalAmount(payload);
  },
);

export const getIncomeStatementThunk = createAsyncThunk(
  'report/getIncomeStatement',
  async (payload: GetReportRequest.AsObject) => {
    return await gRPCReportClient.getIncomeStatement(payload);
  },
);

export const getPaymentTodayThunk = createAsyncThunk(
  'report/getPaymentToday',
  async (payload: GetReportRequest.AsObject) => {
    return await gRPCReportClient.getPaymentToday(payload);
  },
);

export const getProfitRateThunk = createAsyncThunk(
  'report/getProfitRate',
  async (payload: GetReportRequest.AsObject) => {
    return await gRPCReportClient.getProfitRate(payload);
  },
);

export const getAllocationTopUpRateThunk = createAsyncThunk(
  'report/getAllocationTopUpRate',
  async (payload: GetReportRequest.AsObject) => {
    return await gRPCReportClient.getAllocationTopUpRate(payload);
  },
);

export const getAllocationWithdrawRateThunk = createAsyncThunk(
  'report/getAllocationWithdrawRate',
  async (payload: GetReportRequest.AsObject) => {
    return await gRPCReportClient.getAllocationWithdrawRate(payload);
  },
);

export const getTopPaymentMethodThunk = createAsyncThunk(
  'report/getTopPaymentMethod',
  async (payload: GetReportRequest.AsObject) => {
    return await gRPCReportClient.getTopPaymentMethod(payload);
  },
);

export const getTopTellerThunk = createAsyncThunk('report/getTopTeller', async (payload: GetReportRequest.AsObject) => {
  return await gRPCReportClient.getTopTeller(payload);
});
