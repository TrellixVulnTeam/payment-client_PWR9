import _get from 'lodash-es/get';
import {
  GetAllocationTopUpRateReply,
  GetAllocationWithdrawRateReply,
  GetIncomeStatementReply,
  GetPaymentTodayReply,
  GetProcessingPerformanceReply,
  GetProfitRateReply,
  GetStatisticReply,
  GetTopPaymentMethodReply,
  GetTopTellerReply,
  GetTotalAmountReply,
} from '@mcuc/stark/howard_pb';
import { PaymentType } from '@mcuc/stark/stark_pb';
import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import i18n from 'i18n';
import { StatusEnum } from 'redux/constant';
import { RootState } from 'redux/reducers';
import {
  getIncomeStatementThunk,
  getPaymentTodayThunk,
  getProfitRateThunk,
  getAllocationTopUpRateThunk,
  getAllocationWithdrawRateThunk,
  getTopPaymentMethodThunk,
  getTopTellerThunk,
  getStatisticThunk,
} from './thunks';

export type ReportState = {
  report: {
    statistic: { [key in PaymentType]?: GetStatisticReply.AsObject };
    processingPerformance: GetProcessingPerformanceReply.AsObject;
    totalAmount: GetTotalAmountReply.AsObject;
    incomeStatement: GetIncomeStatementReply.AsObject;
    paymentToday: GetPaymentTodayReply.AsObject;
    profitRate: GetProfitRateReply.AsObject;
    allocationTopUpRate: GetAllocationTopUpRateReply.AsObject;
    allocationWithdrawRate: GetAllocationWithdrawRateReply.AsObject;
    topPaymentMethod: GetTopPaymentMethodReply.AsObject;
    topTeller: GetTopTellerReply.AsObject;
  };
  status: StatusEnum;
  error: any;
};

const adapter = createEntityAdapter();

const initialState = adapter.getInitialState<ReportState>({
  report: {
    statistic: {
      [PaymentType.TOPUP]: {
        amount: {
          number: 0,
          percent: 0,
        },
        arppu: {
          number: 0,
          percent: 0,
        },
        order: {
          number: 0,
          percent: 0,
        },
        user: {
          number: 0,
          percent: 0,
        },
      },
      [PaymentType.WITHDRAW]: {
        amount: {
          number: 0,
          percent: 0,
        },
        arppu: {
          number: 0,
          percent: 0,
        },
        order: {
          number: 0,
          percent: 0,
        },
        user: {
          number: 0,
          percent: 0,
        },
      },
    },
    processingPerformance: {
      merchantId: null,
      totalOrder: 0,
      successfully: {
        number: 0,
        percent: 0,
      },
      failed: {
        number: 0,
        percent: 0,
      },
      waiting: {
        number: 0,
        percent: 0,
      },
    },
    totalAmount: {
      detailsList: [],
    },
    incomeStatement: {
      profitsList: [],
      revenuesList: [],
    },
    paymentToday: {
      topUpCompletion: {
        completed: 0,
        total: 0,
      },
      withdrawCompletion: {
        completed: 0,
        total: 0,
      },
    },
    allocationTopUpRate: {
      topUpAllocationRateList: [],
      totalTopup: 0,
    },
    allocationWithdrawRate: {
      withdrawAllocationRateList: [],
      totalWithdraw: 0,
    },
    profitRate: {
      profitRate: 0,
      totalProfit: 0,
      totalRevenue: 0,
    },
    topPaymentMethod: {
      topPaymentMethodRevenueList: [],
    },
    topTeller: {
      topTellerRevenueList: [],
    },
  },
  status: StatusEnum.IDLE,
  error: null,
});

const slice = createSlice({
  name: 'report',
  initialState,
  reducers: {
    resetReport: (state) => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getStatisticThunk.fulfilled, (state, action) => {
        const paymentType: PaymentType = _get(action, 'meta.arg.paymentType');
        const { response, error } = action.payload;
        if (error) return;
        state.report.statistic[paymentType] = response;
      })
      .addCase(getIncomeStatementThunk.fulfilled, (state, action) => {
        const { response, error } = action.payload;
        if (error) return;
        state.report.incomeStatement = response;
      })
      .addCase(getPaymentTodayThunk.fulfilled, (state, action) => {
        const { response, error } = action.payload;
        if (error) return;
        state.report.paymentToday = response;
      })
      .addCase(getProfitRateThunk.fulfilled, (state, action) => {
        const { response, error } = action.payload;
        if (error) return;
        state.report.profitRate = response;
      })
      .addCase(getAllocationTopUpRateThunk.fulfilled, (state, action) => {
        const { response, error } = action.payload;
        if (error) return;
        state.report.allocationTopUpRate = response;
      })
      .addCase(getAllocationWithdrawRateThunk.fulfilled, (state, action) => {
        const { response, error } = action.payload;
        if (error) return;
        state.report.allocationWithdrawRate = response;
      })
      .addCase(getTopPaymentMethodThunk.fulfilled, (state, action) => {
        const { response, error } = action.payload;
        if (error) return;
        state.report.topPaymentMethod = response;
      })
      .addCase(getTopTellerThunk.fulfilled, (state, action) => {
        const { response, error } = action.payload;
        if (error) return;
        state.report.topTeller = response;
      });
  },
});

export const { resetReport } = slice.actions;

const { reducer } = slice;

export default reducer;

export const selectReportState = (state: RootState) => state.report;

export const selectPaymentTodayTopup = createSelector(
  selectReportState,
  (state) => state.report.paymentToday.topUpCompletion,
);

export const selectPaymentTodayWithdraw = createSelector(
  selectReportState,
  (state) => state.report.paymentToday.withdrawCompletion,
);

export const selectTotalProfit = createSelector(selectReportState, (state) => state.report.profitRate.totalProfit);

export const selectTotalRevenue = createSelector(selectReportState, (state) => state.report.profitRate.totalRevenue);

export const selectProfitRate = createSelector(selectReportState, (state) => state.report.profitRate.profitRate);

export const selectTotalTopup = createSelector(
  selectReportState,
  (state) => state.report.allocationTopUpRate.totalTopup,
);

export const selectTotalWithdraw = createSelector(
  selectReportState,
  (state) => state.report.allocationWithdrawRate.totalWithdraw,
);

export const selectAllocationRateTopup = createSelector(selectReportState, (state) => state.report.allocationTopUpRate);

export const selectAllocationRateWithdraw = createSelector(
  selectReportState,
  (state) => state.report.allocationWithdrawRate,
);

export const selectTopupPaymentMethod = createSelector(selectReportState, (state) => state.report.topPaymentMethod);

export const selectTopTellerRevenueList = createSelector(selectReportState, (state) => state.report.topTeller);

export const selectProfitList = createSelector(selectReportState, (state) => state.report.incomeStatement.profitsList);

export const selectRevenueList = createSelector(
  selectReportState,
  (state) => state.report.incomeStatement.revenuesList,
);

export const selectIncomeStatement = createSelector(selectProfitList, selectRevenueList, (profitList, revenueList) => {
  return {
    categories: profitList.map((item) => item.date.seconds),
    series: [
      {
        name: 'profit',
        label: i18n.t('Profit'),
        data: profitList.map((item) => item.amount),
      },
      {
        name: 'revenues',
        label: i18n.t('Revenues'),
        data: revenueList.map((item) => item.amount),
      },
    ],
  };
});
