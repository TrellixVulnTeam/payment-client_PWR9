import { BlackWidowClient } from '@mcuc/natasha/NatashaServiceClientPb';
import {
  GetMerchantBalanceReply,
  GetMerchantBalanceRequest,
  ListPaymentsReply,
  ListPaymentsRequest,
  MakePaymentReply,
  MakePaymentRequest,
} from '@mcuc/natasha/natasha_pb';
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';

import gRPCClientAbstract from '../abstract/gRPCClient';

class gRPCClient extends gRPCClientAbstract {
  constructor() {
    super(BlackWidowClient, 'BlackWidowClient');
  }

  async getMerchantBalance(params: GetMerchantBalanceRequest.AsObject) {
    const request = new GetMerchantBalanceRequest();
    request.setMerchantId(params.merchantId);
    return await this.gRPCClientRequest<GetMerchantBalanceReply.AsObject>('getMerchantBalance', request);
  }

  async makePayment(params: MakePaymentRequest.AsObject) {
    const request = new MakePaymentRequest();
    request.setAmount(params.amount);
    request.setMerchantId(params.merchantId);
    request.setType(params.type);
    return await this.gRPCClientRequest<MakePaymentReply.AsObject>('makePayment', request);
  }

  async listPayments(params: ListPaymentsRequest.AsObject) {
    const request = new ListPaymentsRequest();
    request.setTypesList(params.typesList);
    request.setMerchantId(params.merchantId);
    request.setPage(params.page);
    request.setSize(params.size);
    request.setFromDate(new google_protobuf_timestamp_pb.Timestamp().setSeconds(params.fromDate.seconds));
    return await this.gRPCClientRequest<ListPaymentsReply.AsObject>('listPayments', request);
  }
}

export const gRPCMerchantsBalanceClient = new gRPCClient();
