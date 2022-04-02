import { GetVoucherReply, ListVouchersReply, Voucher } from '@mcuc/natasha/natasha_pb';
import { createEntityAdapter, createSlice, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { stateError, stateLoading, stateSucceeded, StatusEnum } from 'redux/constant';
import { RootState } from 'redux/reducers';
import { GRPCClientResponse } from 'services/grpc/abstract/gRPCClient';
import { getVouchersThunk, getVoucherThunk } from './thunks';
import { VouchersState } from './types';

const adapter = createEntityAdapter<Voucher.AsObject>();

const initialState = adapter.getInitialState<VouchersState>({
  status: StatusEnum.IDLE,
  error: null,
  vouchers: [],
  totalRecord: 0,
  totalPage: 0,
  voucher: null,
  pagination: {
    page: 1,
    size: 50,
  },
});

const slice = createSlice({
  name: 'vouchers',
  initialState,
  reducers: {},
  extraReducers: {
    [getVouchersThunk.pending.type]: (state, action) => {
      return {
        ...state,
        status: StatusEnum.LOADING,
      };
    },
    [getVouchersThunk.fulfilled.type]: (state, action) => {
      const { error, response }: GRPCClientResponse<ListVouchersReply.AsObject> = action.payload;
      if (!!error) {
        return {
          ...state,
          status: StatusEnum.FAILED,
        };
      }
      return {
        ...state,
        status: StatusEnum.SUCCEEDED,
        error: null,
        vouchers: response?.recordsList || [],
        pagination: {
          page: response.currentPage,
          size: response.currentSize,
        },
        totalPage: Math.ceil(response.total / state.pagination.size),
        totalRecord: response?.total || 0,
      };
    },
    [getVoucherThunk.pending.type]: stateLoading,
    [getVoucherThunk.fulfilled.type]: (state, action: PayloadAction<GRPCClientResponse<GetVoucherReply.AsObject>>) => {
      const { error, response } = action.payload;
      if (error) return stateError(state, error);
      state.voucher = response.voucher;
      stateSucceeded(state);
    },
  },
});

const { reducer } = slice;

export const selectVoucherState = (state: RootState) => state.vouchers;
export const selectVouchers = createSelector(selectVoucherState, (state) => state.vouchers);
export const selectTotalRecord = createSelector(selectVoucherState, (state) => state.totalRecord);
export const selectTotalPage = createSelector(selectVoucherState, (state) => state.totalPage);
export const selectVoucherStatus = createSelector(selectVoucherState, (state) => state.status);
export const selectVoucher = createSelector(selectVoucherState, (state) => state.voucher);

export default reducer;
