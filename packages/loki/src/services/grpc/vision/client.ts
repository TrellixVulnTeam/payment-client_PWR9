import { VisionClient } from '@mcuc/stark/VisionServiceClientPb';
import {
  GetPaymentDetailRequest,
  GetPaymentDetailReply,
  ListPaymentsRequest,
  ListPaymentsReply,
  GetPaymentInfoByPaymentCodeRequest,
  GetPaymentInfoByPaymentCodeReply,
} from '@mcuc/stark/vision_pb';
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';
import gRPCClientAbstract from '../abstract/gRPCClient';

class gRPCClient extends gRPCClientAbstract {
  constructor() {
    super(VisionClient, 'VisionClient');
  }

  async getPaymentDetail(params: GetPaymentDetailRequest.AsObject) {
    const request = new GetPaymentDetailRequest();
    request.setId(params.id);
    return await this.gRPCClientRequest<GetPaymentDetailReply.AsObject>('getPaymentDetail', request);
  }

  async getPaymentInfoByPaymentCode(params: GetPaymentInfoByPaymentCodeRequest.AsObject) {
    const request = new GetPaymentInfoByPaymentCodeRequest();
    request.setCode(params.code);
    return await this.gRPCClientRequest<GetPaymentInfoByPaymentCodeReply.AsObject>(
      'getPaymentInfoByPaymentCode',
      request,
    );
  }

  async listPayments(params: ListPaymentsRequest.AsObject) {
    const request = new ListPaymentsRequest();
    request.setBankNamesList(params.bankNamesList);
    request.setCryptoWalletNameList(params.cryptoWalletNameList);
    request.setEWalletNamesList(params.eWalletNamesList);
    request.setMerchantIdsList(params.merchantIdsList);
    request.setMethodsList(params.methodsList);
    request.setPaymentIdsList(params.paymentIdsList);
    request.setPaymentTypesList(params.paymentTypesList);
    request.setStatusesList(params.statusesList);
    request.setTelcoNamesList(params.telcoNamesList);
    request.setPage(params.page);
    request.setSize(params.size);
    request.setOrder(params.order);

    if (params.from && params.to) {
      const fromTimeStamp = new Timestamp();
      fromTimeStamp.setNanos(params.from.nanos);
      fromTimeStamp.setSeconds(params.from.seconds);
      request.setFrom(fromTimeStamp);

      const toTimeStamp = new Timestamp();
      toTimeStamp.setNanos(params.to.nanos);
      toTimeStamp.setSeconds(params.to.seconds);
      request.setTo(toTimeStamp);
    }
    return await this.gRPCClientRequest<ListPaymentsReply.AsObject>('listPayments', request);
  }
}

export const gRPCVisionClient = new gRPCClient();
