import { RomanoffClient } from '@mcuc/natasha/NatashaServiceClientPb';
import {
  CancelVoucherReply,
  CancelVoucherRequest,
  CreateVoucherReply,
  CreateVoucherRequest,
  GetVoucherReply,
  GetVoucherRequest,
  ListVouchersReply,
  ListVouchersRequest,
  SubmitVoucherReply,
  SubmitVoucherRequest,
} from '@mcuc/natasha/natasha_pb';
import gRPCClientAbstract from '../abstract/gRPCClient';

class gRPCClient extends gRPCClientAbstract {
  constructor() {
    super(RomanoffClient, 'RomanoffClient');
  }

  async getVoucher(payload: GetVoucherRequest.AsObject) {
    const req = new GetVoucherRequest();
    req.setId(payload.id);
    return await this.gRPCClientRequest<GetVoucherReply.AsObject>('getVoucher', req);
  }

  async listVouchers(payload: ListVouchersRequest.AsObject) {
    const req = new ListVouchersRequest();
    req.setId(payload.id);
    req.setMerchantId(payload.merchantId);
    req.setTypesList(payload.typesList);
    req.setStatusesList(payload.statusesList);
    req.setPage(payload.page);
    req.setSize(payload.size);
    return await this.gRPCClientRequest<ListVouchersReply.AsObject>('listVouchers', req);
  }

  async createVoucher(payload: CreateVoucherRequest.AsObject) {
    const req = new CreateVoucherRequest();
    req.setMerchantId(payload.merchantId);
    req.setAmount(payload.amount);
    req.setType(payload.type);
    req.setNote(payload.note);
    return await this.gRPCClientRequest<CreateVoucherReply.AsObject>('createVoucher', req);
  }

  async submitVoucher(payload: SubmitVoucherRequest.AsObject) {
    const req = new SubmitVoucherRequest();
    req.setId(payload.id);
    // req.setPaymentId(payload.paymentId);
    req.setPayeeProvider(payload.payeeProvider);
    req.setPayeeAccount(payload.payeeAccount);
    req.setPayeeName(payload.payeeName);
    req.setPayerProvider(payload.payerProvider);
    req.setPayerAccount(payload.payerAccount);
    req.setPayerName(payload.payerName);
    req.setTxId(payload.txId);
    req.setHandlerNote(payload.handlerNote);
    req.setImageUrl(payload.imageUrl);
    return await this.gRPCClientRequest<SubmitVoucherReply.AsObject>('submitVoucher', req);
  }

  async cancelVoucher(payload: CancelVoucherRequest.AsObject) {
    const req = new CancelVoucherRequest();
    req.setId(payload.id);
    // req.setPaymentId(payload.paymentId);
    req.setNote(payload.note);
    return await this.gRPCClientRequest<CancelVoucherReply.AsObject>('cancelVoucher', req);
  }
}

export const gRPCVoucherClient = new gRPCClient();
