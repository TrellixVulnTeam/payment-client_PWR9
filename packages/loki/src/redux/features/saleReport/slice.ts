import { SaleReportItem } from '@mcuc/stark/howard_pb';
import { PaymentType } from '@mcuc/stark/stark_pb';
import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { StatusEnum } from 'redux/constant';
import { RootState } from 'redux/reducers';
import { formatDate } from 'utils/date';
import {
  getSellReportByMerchantThunk,
  getSellReportByPaymentMethodThunk,
  getSellReportByTellerThunk,
  getSellReportByTimeRangeThunk,
} from './thunks';

export type ReportType = {
  topUpsList: SaleReportItem.AsObject[];
  withdrawsList: SaleReportItem.AsObject[];
  total: {
    [PaymentType.TOPUP]: {
      totalAmount: number;
      totalQuantity: number;
      totalAverage: number;
      totalDiscount: number;
      totalRevenue: number;
    };
    [PaymentType.WITHDRAW]: {
      totalAmount: number;
      totalQuantity: number;
      totalAverage: number;
      totalDiscount: number;
      totalRevenue: number;
    };
  };
};

type DateType = string;

export type ReportTypeTime = {
  topUpsList: Record<
    DateType,
    Record<DateType, Pick<SaleReportItem.AsObject, 'date' | 'amount' | 'average' | 'discount' | 'quantity' | 'revenue'>>
  >;
  withdrawsList: Record<
    DateType,
    Record<DateType, Pick<SaleReportItem.AsObject, 'date' | 'amount' | 'average' | 'discount' | 'quantity' | 'revenue'>>
  >;
  total: {
    [PaymentType.TOPUP]: {
      totalAmount: number;
      totalQuantity: number;
      totalAverage: number;
      totalDiscount: number;
      totalRevenue: number;
    };
    [PaymentType.WITHDRAW]: {
      totalAmount: number;
      totalQuantity: number;
      totalAverage: number;
      totalDiscount: number;
      totalRevenue: number;
    };
  };
};

export type ReportState = {
  saleReport: {
    time: ReportTypeTime;
    merchant: ReportType;
    method: ReportType;
    teller: ReportType;
  };
  status: StatusEnum;
  error: any;
};

const adapter = createEntityAdapter();

const initialState = adapter.getInitialState<ReportState>({
  saleReport: {
    time: {
      topUpsList: {},
      withdrawsList: {},
      total: {
        [PaymentType.TOPUP]: {
          totalAmount: 0,
          totalQuantity: 0,
          totalAverage: 0,
          totalDiscount: 0,
          totalRevenue: 0,
        },
        [PaymentType.WITHDRAW]: {
          totalAmount: 0,
          totalQuantity: 0,
          totalAverage: 0,
          totalDiscount: 0,
          totalRevenue: 0,
        },
      },
    },
    merchant: {
      topUpsList: [],
      withdrawsList: [],
      total: {
        [PaymentType.TOPUP]: {
          totalAmount: 0,
          totalQuantity: 0,
          totalAverage: 0,
          totalDiscount: 0,
          totalRevenue: 0,
        },
        [PaymentType.WITHDRAW]: {
          totalAmount: 0,
          totalQuantity: 0,
          totalAverage: 0,
          totalDiscount: 0,
          totalRevenue: 0,
        },
      },
    },
    method: {
      topUpsList: [],
      withdrawsList: [],
      total: {
        [PaymentType.TOPUP]: {
          totalAmount: 0,
          totalQuantity: 0,
          totalAverage: 0,
          totalDiscount: 0,
          totalRevenue: 0,
        },
        [PaymentType.WITHDRAW]: {
          totalAmount: 0,
          totalQuantity: 0,
          totalAverage: 0,
          totalDiscount: 0,
          totalRevenue: 0,
        },
      },
    },
    teller: {
      topUpsList: [],
      withdrawsList: [],
      total: {
        [PaymentType.TOPUP]: {
          totalAmount: 0,
          totalQuantity: 0,
          totalAverage: 0,
          totalDiscount: 0,
          totalRevenue: 0,
        },
        [PaymentType.WITHDRAW]: {
          totalAmount: 0,
          totalQuantity: 0,
          totalAverage: 0,
          totalDiscount: 0,
          totalRevenue: 0,
        },
      },
    },
  },
  status: StatusEnum.IDLE,
  error: null,
});

const calculationTotalForReport = (
  listSaleReport: SaleReportItem.AsObject[],
): ReportType['total'][PaymentType.TOPUP] => {
  return listSaleReport.reduce(
    (acc, item) => {
      acc.totalAmount += item.amount;
      acc.totalAverage += item.average;
      acc.totalDiscount += item.discount;
      acc.totalQuantity += item.quantity;
      acc.totalRevenue += item.revenue;
      return acc;
    },
    { totalAmount: 0, totalQuantity: 0, totalAverage: 0, totalDiscount: 0, totalRevenue: 0 },
  );
};

const slice = createSlice({
  name: 'saleReport',
  initialState,
  reducers: {
    resetReport: (state) => {
      return { ...initialState };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSellReportByTimeRangeThunk.fulfilled, (state, action) => {
        const { response, error } = action.payload;
        if (error) return;
        state.saleReport.time.topUpsList = response.topUpsList.reduce((acc, value) => {
          const date = formatDate(value.date.seconds * 1000);
          if (date) {
            acc[date] = {
              date: value.date,
              amount: (acc[date]?.amount || 0) + value.amount,
              average: (acc[date]?.average || 0) + value.average,
              discount: (acc[date]?.discount || 0) + value.discount,
              quantity: (acc[date]?.quantity || 0) + value.quantity,
              revenue: (acc[date]?.revenue || 0) + value.revenue,
            };
          }
          return acc;
        }, {});
        state.saleReport.time.withdrawsList = response.withdrawsList.reduce((acc, value) => {
          const date = formatDate(value.date.seconds * 1000);
          if (date) {
            acc[date] = {
              date: value.date,
              amount: (acc[date]?.amount || 0) + value.amount,
              average: (acc[date]?.average || 0) + value.average,
              discount: (acc[date]?.discount || 0) + value.discount,
              quantity: (acc[date]?.quantity || 0) + value.quantity,
              revenue: (acc[date]?.revenue || 0) + value.revenue,
            };
          }
          return acc;
        }, {});

        state.saleReport.time.total[PaymentType.TOPUP] = calculationTotalForReport(response.topUpsList);
        state.saleReport.time.total[PaymentType.WITHDRAW] = calculationTotalForReport(response.withdrawsList);
      })
      .addCase(getSellReportByMerchantThunk.fulfilled, (state, action) => {
        const { response, error } = action.payload;
        if (error) return;
        state.saleReport.merchant.topUpsList = response.topUpsList;
        state.saleReport.merchant.withdrawsList = response.withdrawsList;

        state.saleReport.merchant.total[PaymentType.TOPUP] = calculationTotalForReport(response.topUpsList);
        state.saleReport.merchant.total[PaymentType.WITHDRAW] = calculationTotalForReport(response.withdrawsList);
      })
      .addCase(getSellReportByPaymentMethodThunk.fulfilled, (state, action) => {
        const { response, error } = action.payload;
        if (error) return;
        state.saleReport.method.topUpsList = response.topUpsList;
        state.saleReport.method.withdrawsList = response.withdrawsList;

        state.saleReport.method.total[PaymentType.TOPUP] = calculationTotalForReport(response.topUpsList);
        state.saleReport.method.total[PaymentType.WITHDRAW] = calculationTotalForReport(response.withdrawsList);
      })
      .addCase(getSellReportByTellerThunk.fulfilled, (state, action) => {
        const { response, error } = action.payload;
        if (error) return;
        state.saleReport.teller.topUpsList = response.topUpsList;
        state.saleReport.teller.withdrawsList = response.withdrawsList;

        state.saleReport.teller.total[PaymentType.TOPUP] = calculationTotalForReport(response.topUpsList);
        state.saleReport.teller.total[PaymentType.WITHDRAW] = calculationTotalForReport(response.withdrawsList);
      });
  },
});

export const { resetReport } = slice.actions;

const { reducer } = slice;

export default reducer;

export const selectSaleReportState = (state: RootState) => state.saleReport.saleReport;

// * Time Range ----
export const selectSaleReportByTimeRange = createSelector(selectSaleReportState, (state) => state.time);

export const selectSaleReportByTimeRangeTopUpList = createSelector(
  selectSaleReportState,
  (state) => state.time.topUpsList,
);

export const selectSaleReportByTimeRangeWithdrawList = createSelector(
  selectSaleReportState,
  (state) => state.time.withdrawsList,
);

export const selectSaleReportByTimeRangeTotalList = createSelector(selectSaleReportState, (state) => state.time.total);

// * Merchant ----

export const selectSaleReportByMerchant = createSelector(selectSaleReportState, (state) => state.merchant);

export const selectSaleReportByMerchantTopUpList = createSelector(
  selectSaleReportState,
  (state) => state.merchant.topUpsList,
);

export const selectSaleReportByMerchantWithdrawList = createSelector(
  selectSaleReportState,
  (state) => state.merchant.withdrawsList,
);

export const selectSaleReportByMerchantTotalList = createSelector(
  selectSaleReportState,
  (state) => state.merchant.total,
);

// * Method ----

export const selectSaleReportByPaymentMethod = createSelector(selectSaleReportState, (state) => state.method);

export const selectSaleReportByPaymentMethodTopUpList = createSelector(
  selectSaleReportState,
  (state) => state.method.topUpsList,
);

export const selectSaleReportByPaymentMethodWithdrawList = createSelector(
  selectSaleReportState,
  (state) => state.method.withdrawsList,
);

export const selectSaleReportByPaymentMethodTotalList = createSelector(
  selectSaleReportState,
  (state) => state.method.total,
);

// * Teller ----

export const selectSaleReportByTeller = createSelector(selectSaleReportState, (state) => state.teller);

export const selectSaleReportByTellerTopUpList = createSelector(
  selectSaleReportState,
  (state) => state.teller.topUpsList,
);

export const selectSaleReportByTellerWithdrawList = createSelector(
  selectSaleReportState,
  (state) => state.teller.withdrawsList,
);

export const selectSaleReportByTellerTotalList = createSelector(selectSaleReportState, (state) => state.teller.total);
