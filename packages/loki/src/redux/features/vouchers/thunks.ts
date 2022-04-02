import {
  CancelVoucherRequest,
  CreateVoucherRequest,
  GetVoucherRequest,
  ListPaymentsRequest,
  ListVouchersRequest,
  MakePaymentRequest,
  SubmitVoucherRequest,
} from '@mcuc/natasha/natasha_pb';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { gRPCVoucherClient } from 'services/grpc/vouchers/client';
import { gRPCVoucherClient as romanoffClient } from 'services/grpc/vouchers/romanoffClient';

export const getPaymentsThunk = createAsyncThunk(
  'vouchers/listPayments',
  async (payload: ListPaymentsRequest.AsObject) => {
    return await gRPCVoucherClient.listPayments(payload);
  },
);

export const createPaymentThunk = createAsyncThunk(
  'vouchers/createPayment',
  async (payload: MakePaymentRequest.AsObject) => {
    return await gRPCVoucherClient.createPayment(payload);
  },
);

export const getVoucherThunk = createAsyncThunk('vouchers/getVoucher', async (payload: GetVoucherRequest.AsObject) => {
  return await romanoffClient.getVoucher(payload);
});

export const getVouchersThunk = createAsyncThunk(
  'vouchers/listVouchers',
  async (payload: ListVouchersRequest.AsObject) => {
    return await romanoffClient.listVouchers(payload);
  },
);

export const createVoucherThunk = createAsyncThunk(
  'vouchers/createVoucher',
  async (payload: CreateVoucherRequest.AsObject) => {
    return await romanoffClient.createVoucher(payload);
  },
);

export const submitVoucherThunk = createAsyncThunk(
  'vouchers/submitVoucher',
  async (payload: SubmitVoucherRequest.AsObject) => {
    return await romanoffClient.submitVoucher(payload);
  },
);

export const cancelVoucherThunk = createAsyncThunk(
  'merchants/cancelVoucher',
  async (payload: CancelVoucherRequest.AsObject) => {
    return await romanoffClient.cancelVoucher(payload);
  },
);
