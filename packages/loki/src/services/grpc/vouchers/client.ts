import { BlackWidowClient } from '@mcuc/natasha/NatashaServiceClientPb';
import { ListPaymentsReply, ListPaymentsRequest, MakePaymentReply, MakePaymentRequest } from '@mcuc/natasha/natasha_pb';
import gRPCClientAbstract from '../abstract/gRPCClient';

class gRPCClient extends gRPCClientAbstract {
  constructor() {
    super(BlackWidowClient, 'BlackWidowClient');
  }

  async listPayments(payload: ListPaymentsRequest.AsObject) {
    const req = new ListPaymentsRequest();
    req.setId(payload.id);
    req.setMerchantId(payload.merchantId);
    req.setTypesList(payload.typesList);
    req.setPage(payload.page);
    req.setSize(payload.size);
    return await this.gRPCClientRequest<ListPaymentsReply.AsObject>('listPayments', req);
  }

  async createPayment(payload: MakePaymentRequest.AsObject) {
    const req = new MakePaymentRequest();
    req.setMerchantId(payload.merchantId);
    req.setAmount(payload.amount);
    req.setType(payload.type);
    return await this.gRPCClientRequest<MakePaymentReply.AsObject>('makePayment', req);
  }
}

export const gRPCVoucherClient = new gRPCClient();
