import { ListPaymentsRequest } from '@mcuc/natasha/natasha_pb';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { gRPCMerchantsBalanceClient } from 'services/grpc/merchantBalance/client';

export const getListPaymentsOfMerchantThunk = createAsyncThunk(
  'merchantMoney/getListPayments',
  async (payload: ListPaymentsRequest.AsObject) => {
    return await gRPCMerchantsBalanceClient.listPayments(payload);
  },
);
