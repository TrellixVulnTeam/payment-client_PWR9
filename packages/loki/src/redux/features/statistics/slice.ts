import {
  GetStatisticReply,
  GetProcessingPerformanceReply,
  GetTotalAmountReply,
  TotalAmountDetail,
} from '@mcuc/stark/howard_pb';
import { PaymentType } from '@mcuc/stark/stark_pb';
import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';
import _get from 'lodash-es/get';
import { RootState } from 'redux/reducers';
import { GRPCClientResponse } from 'services/grpc/abstract/gRPCClient';
import { getProcessingPerformanceThunk, getStatisticThunk, getTotalAmountThunk } from './thunks';

export interface ITotalAmountItem {
  id: number;
  data: number[];
}

export interface PaymentsState {
  statistics: { [key in PaymentType]?: GetStatisticReply.AsObject };
  processingPerformance: GetProcessingPerformanceReply.AsObject;
  totalAmount: {
    series: ITotalAmountItem[];
    categories: Timestamp.AsObject[];
  };
}
const adapter = createEntityAdapter();

const initialState = adapter.getInitialState<PaymentsState>({
  statistics: {},
  processingPerformance: null,
  totalAmount: {
    series: [],
    categories: [],
  },
});

const slice = createSlice({
  name: 'statistics',
  initialState,
  reducers: {},
  extraReducers: {
    [getStatisticThunk.pending.type]: (state, action) => {
      return {
        ...state,
      };
    },
    [getStatisticThunk.fulfilled.type]: (state, action) => {
      const { error, response }: GRPCClientResponse<GetStatisticReply.AsObject> = action.payload;
      const paymentType = _get(action, 'meta.arg.paymentType');
      if (!!error || !paymentType) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        statistics: {
          ...state.statistics,
          [paymentType]: response,
        },
      };
    },
    [getProcessingPerformanceThunk.pending.type]: (state, action) => {
      return {
        ...state,
      };
    },
    [getProcessingPerformanceThunk.fulfilled.type]: (state, action) => {
      const { error, response }: GRPCClientResponse<GetProcessingPerformanceReply.AsObject> = action.payload;
      if (!!error) {
        return {
          ...state,
        };
      }
      return {
        ...state,
        processingPerformance: response,
      };
    },
    [getTotalAmountThunk.pending.type]: (state, action) => {
      return {
        ...state,
      };
    },
    [getTotalAmountThunk.fulfilled.type]: (state, action) => {
      const { error, response }: GRPCClientResponse<GetTotalAmountReply.AsObject> = action.payload;
      if (!!error) {
        return {
          ...state,
        };
      }

      const ids = _get(action, 'meta.arg.merchantsList');
      const detailsList: TotalAmountDetail.AsObject[] = _get(response, 'detailsList', []);
      const series = detailsList.reduce(
        (acc, value) => {
          return acc.map((item) => {
            const amount = value?.merchantAmountsList.find((x) => x.merchantId === item.id)?.amount || 0;
            return {
              ...item,
              data: item.data.concat([amount]),
            };
          });
        },
        ids.map((x) => ({ id: x, data: [] })),
      );
      const categories = detailsList.map((x) => x.date);
      return {
        ...state,
        totalAmount: {
          series,
          categories,
        },
      };
    },
  },
});

const { reducer } = slice;
export default reducer;

const selectStatisticState = (state: RootState) => state;
export const selectTopupStatistics = createSelector(
  selectStatisticState,
  (state) => state.statistics?.statistics[PaymentType.TOPUP],
);
export const selectWithdrawStatistics = createSelector(
  selectStatisticState,
  (state) => state.statistics?.statistics[PaymentType.WITHDRAW],
);

export const selectProcessingPerformance = createSelector(
  selectStatisticState,
  (state) => state.statistics?.processingPerformance,
);

export const selectTotalAmountData = createSelector(selectStatisticState, (state) => state.statistics?.totalAmount);
