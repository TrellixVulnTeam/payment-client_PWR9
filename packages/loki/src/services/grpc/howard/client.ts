import { HowardClient } from '@mcuc/stark/HowardServiceClientPb';
import {
  GetStatisticRequest,
  GetStatisticReply,
  GetProcessingPerformanceRequest,
  GetProcessingPerformanceReply,
  GetTotalAmountRequest,
  GetTotalAmountReply,
  GetSellReportByTimeRangeRequest,
  GetSellReportByMerchantRequest,
  GetSellReportByPaymentMethodRequest,
  GetSellReportByTellerRequest,
  GetSellReportByTimeRangeReply,
  GetSellReportByMerchantReply,
  GetSellReportByPaymentMethodReply,
  GetSellReportByTellerReply,
} from '@mcuc/stark/howard_pb';
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';

import { getCurrentTimeZone } from 'utils/date';
import gRPCClientAbstract from '../abstract/gRPCClient';

class gRPCClient extends gRPCClientAbstract {
  constructor() {
    super(HowardClient, 'HowardClient');
  }

  async getStatistics(params: GetStatisticRequest.AsObject) {
    const request = new GetStatisticRequest();
    request.setPaymentType(params.paymentType);
    request.setFilterType(params.filterType);
    request.setTimeZone(this.getTimezone(params.timeZone));

    return await this.gRPCClientRequest<GetStatisticReply>('getStatistic', request);
  }

  async getProcessingPerformance(params: GetProcessingPerformanceRequest.AsObject) {
    const request = new GetProcessingPerformanceRequest();
    request.setMerchantId(params.merchantId);
    if (params.fromDate && params.toDate) {
      request.setFromDate(new Timestamp().setSeconds(params.fromDate.seconds));
      request.setToDate(new Timestamp().setSeconds(params.toDate.seconds));
    }
    return await this.gRPCClientRequest<GetProcessingPerformanceReply>('getProcessingPerformance', request);
  }

  async getTotalAmount(params: GetTotalAmountRequest.AsObject) {
    const request = new GetTotalAmountRequest();
    request.setMerchantsList(params.merchantsList);
    if (params.fromDate && params.toDate) {
      request.setFromDate(new Timestamp().setSeconds(params.fromDate.seconds).setNanos(0));
      request.setToDate(new Timestamp().setSeconds(params.toDate.seconds).setNanos(0));
    }
    request.setTimeZone(this.getTimezone(params.timeZone));

    return await this.gRPCClientRequest<GetTotalAmountReply>('getTotalAmount', request);
  }

  async getSellReportByTimeRange(params: GetSellReportByTimeRangeRequest.AsObject) {
    const request = new GetSellReportByTimeRangeRequest();
    request.setCurrency(params.currency);
    if (params.fromDate && params.toDate) {
      request.setFromDate(new Timestamp().setSeconds(params.fromDate.seconds).setNanos(0));
      request.setToDate(new Timestamp().setSeconds(params.toDate.seconds).setNanos(0));
    }
    request.setTimeZone(this.getTimezone(params.timeZone));

    return await this.gRPCClientRequest<GetSellReportByTimeRangeReply.AsObject>('getSellReportByTimeRange', request);
  }

  getTimezone(tz?: number) {
    if (tz === undefined || tz === null) {
      return getCurrentTimeZone();
    }

    return tz;
  }

  async getSellReportByMerchant(params: GetSellReportByMerchantRequest.AsObject) {
    const request = new GetSellReportByMerchantRequest();
    request.setCurrency(params.currency);
    request.setMerchantIdsList(params.merchantIdsList);
    if (params.fromDate && params.toDate) {
      request.setFromDate(new Timestamp().setSeconds(params.fromDate.seconds).setNanos(0));
      request.setToDate(new Timestamp().setSeconds(params.toDate.seconds).setNanos(0));
    }
    return await this.gRPCClientRequest<GetSellReportByMerchantReply.AsObject>('getSellReportByMerchant', request);
  }

  async getSellReportByPaymentMethod(params: GetSellReportByPaymentMethodRequest.AsObject) {
    const request = new GetSellReportByPaymentMethodRequest();
    request.setCurrency(params.currency);
    if (params.fromDate && params.toDate) {
      request.setFromDate(new Timestamp().setSeconds(params.fromDate.seconds).setNanos(0));
      request.setToDate(new Timestamp().setSeconds(params.toDate.seconds).setNanos(0));
    }
    return await this.gRPCClientRequest<GetSellReportByPaymentMethodReply.AsObject>(
      'getSellReportByPaymentMethod',
      request,
    );
  }

  async getSellReportByTeller(params: GetSellReportByTellerRequest.AsObject) {
    const request = new GetSellReportByTellerRequest();
    request.setCurrency(params.currency);
    if (params.fromDate && params.toDate) {
      request.setFromDate(new Timestamp().setSeconds(params.fromDate.seconds).setNanos(0));
      request.setToDate(new Timestamp().setSeconds(params.toDate.seconds).setNanos(0));
    }
    return await this.gRPCClientRequest<GetSellReportByTellerReply.AsObject>('getSellReportByTeller', request);
  }
}

export const gRPCHowardClient = new gRPCClient();
