import { TonyClient } from '@mcuc/stark/TonyServiceClientPb';
import {
  GetEWalletPaymentCodeRequest,
  GetEWalletPaymentCodeReply,
  CancelEWalletTopUpRequest,
  CancelEWalletTopUpReply,
  CreateEWalletTopUpRequest,
  CreateEWalletTopUpReply,
  ApproveEWalletTopUpRequest,
  ApproveEWalletTopUpReply,
  RejectEWalletTopUpRequest,
  RejectEWalletTopUpReply,
  GetSystemEWalletsRequest,
  GetSystemEWalletsReply,
  CreateSystemEWalletRequest,
  CreateSystemEWalletReply,
  UpdateSystemEWalletStatusRequest,
  UpdateSystemEWalletStatusReply,
  ListSystemEWalletsRequest,
  ListSystemEWalletsReply,
  ValidateSystemEWalletsRequest,
  ValidateSystemEWalletsReply,
  ImportSystemEWalletsRequest,
  ImportSystemEWalletsReply,
} from '@mcuc/stark/tony_pb';
import gRPCClientAbstract from '../abstract/gRPCClient';

class gRPCClient extends gRPCClientAbstract {
  constructor() {
    super(TonyClient, 'TonyClient');
  }

  async getEWalletPaymentCode(params: GetEWalletPaymentCodeRequest.AsObject) {
    const request = new GetEWalletPaymentCodeRequest();
    request.setEWalletName(params.eWalletName);
    request.setMerchantUserId(params.merchantUserId);
    return await this.gRPCClientRequest<GetEWalletPaymentCodeReply.AsObject>('getEWalletPaymentCode', request);
  }

  async cancelEWalletTopUp(params: CancelEWalletTopUpRequest.AsObject) {
    const request = new CancelEWalletTopUpRequest();
    request.setPaymentId(params.paymentId);
    return await this.gRPCClientRequest<CancelEWalletTopUpReply.AsObject>('cancelEWalletTopUp', request);
  }

  async createEWalletTopUp(params: CreateEWalletTopUpRequest.AsObject) {
    const request = new CreateEWalletTopUpRequest();
    request.setAmount(params.amount);
    request.setMerchantUserAccountName(params.merchantUserAccountName);
    request.setMerchantUserAccountPhoneNumber(params.merchantUserAccountPhoneNumber);
    request.setNote(params.note);
    request.setPaymentCode(params.paymentCode);
    request.setSystemAccountName(params.systemAccountName);
    request.setSystemAccountPhoneNumber(params.systemAccountPhoneNumber);
    return await this.gRPCClientRequest<CreateEWalletTopUpReply.AsObject>('createEWalletTopUp', request);
  }

  async approveEWalletTopUp(params: ApproveEWalletTopUpRequest.AsObject) {
    const request = new ApproveEWalletTopUpRequest();
    request.setPaymentId(params.paymentId);
    request.setImageUrl(params.imageUrl);
    request.setNote(params.note);
    request.setTxId(params.txId);
    return await this.gRPCClientRequest<ApproveEWalletTopUpReply.AsObject>('approveEWalletTopUp', request);
  }

  async rejectEWalletTopUp(params: RejectEWalletTopUpRequest.AsObject) {
    const request = new RejectEWalletTopUpRequest();
    request.setPaymentId(params.paymentId);
    request.setNote(params.note);
    request.setIsMerchantCall(params.isMerchantCall);
    return await this.gRPCClientRequest<RejectEWalletTopUpReply.AsObject>('rejectEWalletTopUp', request);
  }

  async getSystemEWallets(params: GetSystemEWalletsRequest.AsObject) {
    const request = new GetSystemEWalletsRequest();
    request.setEWalletName(params.eWalletName);
    request.setMerchantId(params.merchantId);
    return await this.gRPCClientRequest<GetSystemEWalletsReply.AsObject>('getSystemEWallets', request);
  }

  async createSystemEWallet(params: CreateSystemEWalletRequest.AsObject) {
    const request = new CreateSystemEWalletRequest();
    request.setAccountId(params.accountId);
    request.setAccountPhoneNumber(params.accountPhoneNumber);
    request.setBalance(params.balance);
    request.setDailyBalanceLimit(params.dailyBalanceLimit);
    request.setAccountWalletName(params.accountWalletName);
    request.setMerchantId(params.merchantId);
    request.setAccountName(params.accountName);
    request.setDailyUsedAmount(params.dailyUsedAmount);
    request.setDailyBalance(params.dailyBalance);
    return await this.gRPCClientRequest<CreateSystemEWalletReply.AsObject>('createSystemEWallet', request);
  }

  async updateSystemEWalletStatus(params: UpdateSystemEWalletStatusRequest.AsObject) {
    const request = new UpdateSystemEWalletStatusRequest();
    request.setId(params.id);
    request.setStatus(params.status);
    return await this.gRPCClientRequest<UpdateSystemEWalletStatusReply.AsObject>('updateSystemEWalletStatus', request);
  }

  async listSystemEWallets(params: ListSystemEWalletsRequest.AsObject) {
    const request = new ListSystemEWalletsRequest();
    request.setEWalletNamesList(params.eWalletNamesList);
    request.setIdsList(params.idsList);
    request.setPage(params.page);
    request.setSize(params.size);
    request.setStatusesList(params.statusesList);
    request.setMerchantIdsList(params.merchantIdsList);
    return await this.gRPCClientRequest<ListSystemEWalletsReply.AsObject>('listSystemEWallets', request);
  }

  async validateSystemEWallets(params: ValidateSystemEWalletsRequest.AsObject) {
    const request = new ValidateSystemEWalletsRequest();
    request.setRecordsList(
      params.recordsList.map((record) => {
        const createSystemEWalletRequest = new CreateSystemEWalletRequest();
        createSystemEWalletRequest.setAccountPhoneNumber(record.accountPhoneNumber);
        createSystemEWalletRequest.setBalance(record.balance);
        createSystemEWalletRequest.setDailyBalanceLimit(record.dailyBalanceLimit);
        createSystemEWalletRequest.setAccountWalletName(record.accountWalletName);
        createSystemEWalletRequest.setMerchantId(record.merchantId);
        createSystemEWalletRequest.setAccountName(record.accountName);
        createSystemEWalletRequest.setDailyBalance(record.dailyBalance);
        createSystemEWalletRequest.setDailyUsedAmount(record.dailyUsedAmount);
        createSystemEWalletRequest.setAccountId(record.accountId);
        return createSystemEWalletRequest;
      }),
    );
    return await this.gRPCClientRequest<ValidateSystemEWalletsReply.AsObject>('validateSystemEWallets', request);
  }

  async importSystemEWallets(params: ImportSystemEWalletsRequest.AsObject) {
    const request = new ImportSystemEWalletsRequest();
    request.setRecordsList(
      params.recordsList.map((record) => {
        const createSystemEWalletRequest = new CreateSystemEWalletRequest();
        createSystemEWalletRequest.setAccountPhoneNumber(record.accountPhoneNumber);
        createSystemEWalletRequest.setBalance(record.balance);
        createSystemEWalletRequest.setDailyBalanceLimit(record.dailyBalanceLimit);
        createSystemEWalletRequest.setAccountWalletName(record.accountWalletName);
        createSystemEWalletRequest.setMerchantId(record.merchantId);
        createSystemEWalletRequest.setAccountName(record.accountName);
        createSystemEWalletRequest.setDailyUsedAmount(record.dailyUsedAmount);
        createSystemEWalletRequest.setAccountId(record.accountId);
        return createSystemEWalletRequest;
      }),
    );
    return await this.gRPCClientRequest<ImportSystemEWalletsReply.AsObject>('importSystemEWallets', request);
  }
}

export const gRPCTonyClient = new gRPCClient();
