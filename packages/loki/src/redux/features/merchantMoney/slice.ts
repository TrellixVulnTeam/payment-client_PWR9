import _different from 'lodash-es/difference';
import { Payment, PaymentType } from '@mcuc/natasha/natasha_pb';
import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { StatusEnum } from 'redux/constant';
import { RootState } from 'redux/reducers';
import { getListPaymentsOfMerchantThunk } from './thunks';
import { formatDate } from 'utils/date';

const PaymentTypeMoneyIn = [
  PaymentType.MERCHANT_DEPOSIT_ADDITIONAL,
  PaymentType.MERCHANT_DEPOSIT_COMPENSATION,
  PaymentType.USER_TOP_UP,
] as number[];

const PaymentTypeMoneyOut = [
  PaymentType.MERCHANT_WITHDRAW_FUNDS,
  PaymentType.MERCHANT_WITHDRAW_PROFIT,
  PaymentType.USER_WITHDRAW,
] as number[];

const merchantMoneyAdapter = createEntityAdapter<Payment.AsObject>();

type DateTime = number;
type TotalPayment = Record<'Merchant' | 'User', number>;

type InitState = {
  status: StatusEnum;
  error: any;
  moneyIn: Record<DateTime, TotalPayment>;
  moneyOut: Record<DateTime, TotalPayment>;
};

const initialState = merchantMoneyAdapter.getInitialState<InitState>({
  status: StatusEnum.IDLE,
  error: null,
  moneyIn: {},
  moneyOut: {},
});

const slice = createSlice({
  name: 'merchantMoney',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getListPaymentsOfMerchantThunk.pending, (state) => {
        state.moneyIn = {};
        state.moneyOut = {};
        state.status = StatusEnum.LOADING;
        state.error = null;
      })
      .addCase(getListPaymentsOfMerchantThunk.fulfilled, (state, action) => {
        const { response, error } = action.payload;
        if (error) {
          state.error = error;
          return;
        }

        const { meta } = action;
        const typeList = meta.arg.typesList;

        response.recordsList.forEach((item) => {
          const { paymentType, createdAt, amount } = item;
          const date = createdAt && formatDate(createdAt.seconds * 1000);
          console.log({ date });
          if (date) {
            // * Money In
            if (!_different(typeList, PaymentTypeMoneyIn).length) {
              if (!state.moneyIn[date]) {
                state.moneyIn[date] = { date };
              }
              const type = paymentType === PaymentType.USER_TOP_UP ? 'User' : 'Merchant';
              state.moneyIn[date][type] = (state.moneyIn[date][type] || 0) + amount;
            }
            // * Money Out
            if (!_different(typeList, PaymentTypeMoneyOut).length) {
              if (!state.moneyOut[date]) {
                state.moneyOut[date] = { date };
              }
              const type = paymentType === PaymentType.USER_WITHDRAW ? 'User' : 'Merchant';
              state.moneyOut[date][type] = (state.moneyOut[date][type] || 0) + amount;
            }
          }
        });
        state.status = StatusEnum.SUCCEEDED;
      });
  },
});

const { reducer } = slice;

export default reducer;

export const selectMerchantMoneyState = (state: RootState) => state.merchantMoney;

export const {
  selectAll: selectMerchantMoney,
  selectById: selectMerchantMoneyById,
  selectEntities: selectMerchantMoneyEntities,
} = merchantMoneyAdapter.getSelectors(selectMerchantMoneyState);

export const selectMerchantMoneyIn = createSelector(selectMerchantMoneyState, (state) => state.moneyIn);
export const selectMerchantMoneyOut = createSelector(selectMerchantMoneyState, (state) => state.moneyOut);
export const selectMerchantMoneyStatus = createSelector(selectMerchantMoneyState, (state) => state.status);
