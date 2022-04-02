import { HowardClient } from '@mcuc/stark/HowardServiceClientPb';
import {
  GetStatisticRequest,
  GetProcessingPerformanceRequest,
  GetTotalAmountRequest,
  GetReportRequest,
  GetProcessingPerformanceReply,
  GetStatisticReply,
  GetTotalAmountReply,
  GetIncomeStatementReply,
  GetPaymentTodayReply,
  GetProfitRateReply,
  GetAllocationTopUpRateReply,
  GetAllocationWithdrawRateReply,
} from '@mcuc/stark/howard_pb';
import { GetTopPaymentMethodReply, GetTopTellerReply } from '@mcuc/vision/vision_pb';
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';

import { getCurrentTimeZone } from 'utils/date';
import gRPCClientAbstract from '../abstract/gRPCClient';

class gRPCClient extends gRPCClientAbstract {
  constructor() {
    super(HowardClient, 'HowardClient');
  }

  getTimezone(tz?: number) {
    if (tz === undefined || tz === null) {
      return getCurrentTimeZone();
    }

    return tz;
  }

  async getStatistic(params: GetStatisticRequest.AsObject) {
    const request = new GetStatisticRequest();
    request.setPaymentType(params.paymentType);
    request.setTimeZone(this.getTimezone(params.timeZone));
    request.setFilterType(params.filterType);
    return await this.gRPCClientRequest<GetStatisticReply.AsObject>('getStatistic', request);
  }

  async getProcessingPerformance(params: GetProcessingPerformanceRequest.AsObject) {
    const request = new GetProcessingPerformanceRequest();
    request.setFromDate(new google_protobuf_timestamp_pb.Timestamp().setSeconds(params.fromDate.seconds));
    request.setToDate(new google_protobuf_timestamp_pb.Timestamp().setSeconds(params.toDate.seconds));
    request.setMerchantId(params.merchantId);
    return await this.gRPCClientRequest<GetProcessingPerformanceReply.AsObject>('getProcessingPerformance', request);
  }

  async getTotalAmount(params: GetTotalAmountRequest.AsObject) {
    const request = new GetTotalAmountRequest();
    request.setFromDate(new google_protobuf_timestamp_pb.Timestamp().setSeconds(params.fromDate.seconds));
    request.setToDate(new google_protobuf_timestamp_pb.Timestamp().setSeconds(params.toDate.seconds));
    request.setMerchantsList(params.merchantsList);
    request.setTimeZone(this.getTimezone(params.timeZone));
    return await this.gRPCClientRequest<GetTotalAmountReply.AsObject>('getTotalAmount', request);
  }

  async getIncomeStatement(params: GetReportRequest.AsObject) {
    const request = new GetReportRequest();
    request.setFromDate(new google_protobuf_timestamp_pb.Timestamp().setSeconds(params.fromDate.seconds));
    request.setToDate(new google_protobuf_timestamp_pb.Timestamp().setSeconds(params.toDate.seconds));
    request.setMerchantId(params.merchantId);
    request.setTimeZone(this.getTimezone(params.timeZone));
    return await this.gRPCClientRequest<GetIncomeStatementReply.AsObject>('getIncomeStatement', request);
  }

  async getPaymentToday(params: GetReportRequest.AsObject) {
    const request = new GetReportRequest();
    request.setFromDate(new google_protobuf_timestamp_pb.Timestamp().setSeconds(params.fromDate.seconds));
    request.setToDate(new google_protobuf_timestamp_pb.Timestamp().setSeconds(params.toDate.seconds));
    request.setMerchantId(params.merchantId);
    request.setTimeZone(this.getTimezone(params.timeZone));
    return await this.gRPCClientRequest<GetPaymentTodayReply.AsObject>('getPaymentToday', request);
  }

  async getProfitRate(params: GetReportRequest.AsObject) {
    const request = new GetReportRequest();
    request.setFromDate(new google_protobuf_timestamp_pb.Timestamp().setSeconds(params.fromDate.seconds));
    request.setToDate(new google_protobuf_timestamp_pb.Timestamp().setSeconds(params.toDate.seconds));
    request.setMerchantId(params.merchantId);
    request.setTimeZone(this.getTimezone(params.timeZone));
    return await this.gRPCClientRequest<GetProfitRateReply.AsObject>('getProfitRate', request);
  }

  async getAllocationTopUpRate(params: GetReportRequest.AsObject) {
    const request = new GetReportRequest();
    request.setFromDate(new google_protobuf_timestamp_pb.Timestamp().setSeconds(params.fromDate.seconds));
    request.setToDate(new google_protobuf_timestamp_pb.Timestamp().setSeconds(params.toDate.seconds));
    request.setMerchantId(params.merchantId);
    request.setTimeZone(this.getTimezone(params.timeZone));
    return await this.gRPCClientRequest<GetAllocationTopUpRateReply.AsObject>('getAllocationTopUpRate', request);
  }

  async getAllocationWithdrawRate(params: GetReportRequest.AsObject) {
    const request = new GetReportRequest();
    request.setFromDate(new google_protobuf_timestamp_pb.Timestamp().setSeconds(params.fromDate.seconds));
    request.setToDate(new google_protobuf_timestamp_pb.Timestamp().setSeconds(params.toDate.seconds));
    request.setMerchantId(params.merchantId);
    request.setTimeZone(this.getTimezone(params.timeZone));
    return await this.gRPCClientRequest<GetAllocationWithdrawRateReply.AsObject>('getAllocationWithdrawRate', request);
  }

  async getTopPaymentMethod(params: GetReportRequest.AsObject) {
    const request = new GetReportRequest();
    request.setFromDate(new google_protobuf_timestamp_pb.Timestamp().setSeconds(params.fromDate.seconds));
    request.setToDate(new google_protobuf_timestamp_pb.Timestamp().setSeconds(params.toDate.seconds));
    request.setMerchantId(params.merchantId);
    request.setTimeZone(this.getTimezone(params.timeZone));
    return await this.gRPCClientRequest<GetTopPaymentMethodReply.AsObject>('getTopPaymentMethod', request);
  }

  async getTopTeller(params: GetReportRequest.AsObject) {
    const request = new GetReportRequest();
    request.setFromDate(new google_protobuf_timestamp_pb.Timestamp().setSeconds(params.fromDate.seconds));
    request.setToDate(new google_protobuf_timestamp_pb.Timestamp().setSeconds(params.toDate.seconds));
    request.setMerchantId(params.merchantId);
    request.setTimeZone(this.getTimezone(params.timeZone));
    return await this.gRPCClientRequest<GetTopTellerReply.AsObject>('getTopTeller', request);
  }
}

export const gRPCReportClient = new gRPCClient();
