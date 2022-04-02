import { Payment } from '@mcuc/natasha/natasha_pb';
import { SystemBank, ListSystemBankAccountsReply } from '@mcuc/stark/pepper_pb';
import { ListSystemEWalletsReply, SystemEWallet } from '@mcuc/stark/tony_pb';
import { GetPaymentDetailReply, ListPaymentsReply } from '@mcuc/stark/vision_pb';
import { createSlice, createEntityAdapter, createSelector, PayloadAction } from '@reduxjs/toolkit';
import { normalize, schema } from 'normalizr';

import { RootState } from 'redux/reducers';
import { stateError, stateLoading, stateSucceeded, StatusEnum } from 'redux/constant';
import { getErrorMessageFromCode } from 'utils/constant/message';
import { GRPCClientResponse } from 'services/grpc/abstract/gRPCClient';

import { listSystemBankAccountsThunk } from '../walletBanks/thunks';
import { listSystemEWalletsThunk } from '../walletEWallets/thunks';
import { getPaymentDetailThunk, listPaymentsThunk } from './thunks';
import { PaymentType, PaymentWithDetail } from '@mcuc/stark/stark_pb';

const paymentsAdapter = createEntityAdapter<Payment.AsObject>();

export interface PaymentsState {
  loading: boolean;
  status: StatusEnum;
  error: string;
  page: number;
  size: number;
  displayIds: string[];
  banksInfoList: SystemBank.AsObject[];
  eWalletInfoList: SystemEWallet.AsObject[];
  banks: SystemBank.AsObject[];
  selected?: GetPaymentDetailReply.AsObject;
  entities: Record<string, GetPaymentDetailReply.AsObject>;
  pagination: {
    totalPage: number;
    totalRecord: number;
  };
  filter: {
    paymentType: PaymentType;
  };
}

const initialState = paymentsAdapter.getInitialState<PaymentsState>({
  loading: false,
  error: null,
  status: StatusEnum.IDLE,
  page: 1,
  size: 50,
  banks: [],
  banksInfoList: [],
  eWalletInfoList: [],
  displayIds: [],
  selected: null,
  entities: {},
  pagination: {
    totalPage: 1,
    totalRecord: 0,
  },
  filter: {
    paymentType: PaymentType.PAYMENT_UNSPECIFIED,
  },
});

function pending(state: PaymentsState) {
  state.status = StatusEnum.LOADING;
}

const slice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    paymentTypeFilter: (state, action) => {
      state.filter.paymentType = action.payload;
    },
  },
  extraReducers: {
    [listPaymentsThunk.pending.type]: pending,
    [listPaymentsThunk.fulfilled.type]: (state, action) => {
      const { response, error }: GRPCClientResponse<ListPaymentsReply.AsObject> = action.payload;

      if (response) {
        const newData = response.recordsList.map((item: PaymentWithDetail.AsObject) => ({
          id: item.payment.id,
          ...item,
        }));

        if (newData.length > 0) {
          const normalized = normalize(newData, [new schema.Entity('payments')]);
          paymentsAdapter.upsertMany(state, normalized.entities.payments!);
          state.displayIds = normalized.result;
        } else {
          state.displayIds = [];
        }

        state.pagination.totalPage = response.currentPage;
        state.pagination.totalRecord = response.total;
      }
      state.status = StatusEnum.IDLE;
      state.error = error ? getErrorMessageFromCode(error.code) : null;
    },
    [getPaymentDetailThunk.pending.type]: stateLoading,
    [getPaymentDetailThunk.fulfilled.type]: (state, action) => {
      const { response, error } = action.payload;
      if (error) return stateError(state, error);
      if (response) {
        state.selected = response;
      }
      stateSucceeded(state);
    },
    [listSystemBankAccountsThunk.fulfilled.type]: (
      state,
      action: PayloadAction<GRPCClientResponse<ListSystemBankAccountsReply.AsObject>>,
    ) => {
      const { response } = action.payload;
      if (response) {
        state.banksInfoList = response.recordsList;
      }
    },
    [listSystemEWalletsThunk.fulfilled.type]: (
      state,
      action: PayloadAction<GRPCClientResponse<ListSystemEWalletsReply.AsObject>>,
    ) => {
      const { response } = action.payload;
      if (response) {
        state.eWalletInfoList = response.recordsList;
      }
    },
  },
});

const { reducer } = slice;

export default reducer;

export const selectPaymentsState = (state: RootState) => state.payments;

export const { selectAll: selectPayments, selectById: selectPaymentById } = paymentsAdapter.getSelectors(
  (state: RootState) => state.payments,
);

export const selectDisplayPayments = createSelector(selectPaymentsState, (payments) =>
  payments.displayIds.map((id) => payments.entities[id]),
);

export const selectBankInfos = createSelector(selectPaymentsState, (state) => state.banksInfoList);

export const selectEWalletInfos = createSelector(selectPaymentsState, (state) => state.eWalletInfoList);
