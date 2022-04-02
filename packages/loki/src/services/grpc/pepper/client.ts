import { PepperClient } from '@mcuc/stark/PepperServiceClientPb';
import {
  ApproveBankingTopUpReply,
  ApproveBankingTopUpRequest,
  ApproveBankingWithdrawRequest,
  CreateBankingTopUpReply,
  CreateBankingTopUpRequest,
  CreateBankingWithdrawReply,
  CreateBankingWithdrawRequest,
  GetBankPaymentCodeReply,
  GetBankPaymentCodeRequest,
  ListSystemBankAccountsReply,
  ListSystemBankAccountsRequest,
  RejectBankingTopUpReply,
  RejectBankingTopUpRequest,
  RejectBankingWithdrawRequest,
  RejectBankingWithdrawReply,
  CreateSystemBankAccountRequest,
  CreateSystemBankAccountReply,
  VerifyMerchantUserBankAccountRequest,
  VerifyMerchantUserBankAccountReply,
  ValidateImportSystemBankAccountRequest,
  ValidateImportSystemBankAccountReply,
  ImportSystemBankAccountRequest,
  ImportSystemBankAccountReply,
  UpdateSystemBankAccountStatusRequest,
  UpdateSystemBankAccountStatusReply,
  ApproveBankingWithdrawReply,
  ListSystemBankAccountByPaymentInfoRequest,
  ListSystemBankAccountByPaymentInfoReply,
  SubmitBankingWithdrawRequest,
  SubmitBankingWithdrawReply,
  GetIsMerchantUserBankAccountVerifiedRequest,
  GetIsMerchantUserBankAccountVerifiedReply,
} from '@mcuc/stark/pepper_pb';
import { BANKS_STRING } from 'utils/constant/payment';
import gRPCClientAbstract from '../abstract/gRPCClient';

class gRPCClient extends gRPCClientAbstract {
  constructor() {
    super(PepperClient, 'PepperClient');
  }

  async getBankPaymentCode(params: GetBankPaymentCodeRequest.AsObject) {
    const request = new GetBankPaymentCodeRequest();
    request.setBankName(params.bankName);
    request.setMerchantUserId(params.merchantUserId);
    return await this.gRPCClientRequest<GetBankPaymentCodeReply.AsObject>('listSystemBankAccounts', request);
  }

  async createBankingWithdraw(params: CreateBankingWithdrawRequest.AsObject) {
    const request = new CreateBankingWithdrawRequest();
    request.setAmount(params.amount);
    request.setMerchantUserAccountName(params.merchantUserAccountName);
    request.setMerchantUserAccountNumber(params.merchantUserAccountNumber);
    return await this.gRPCClientRequest<CreateBankingWithdrawReply.AsObject>('createBankingWithdraw', request);
  }

  async createBankingTopUp(params: CreateBankingTopUpRequest.AsObject) {
    const request = new CreateBankingTopUpRequest();
    request.setAmount(params.amount);
    request.setPaymentCode(params.paymentCode);
    request.setMerchantUserAccountName(params.merchantUserAccountName);
    request.setMerchantUserAccountNumber(params.merchantUserAccountNumber);
    request.setSystemAccountName(params.systemAccountName);
    request.setSystemAccountNumber(params.systemAccountNumber);
    request.setNote(params.note);
    return await this.gRPCClientRequest<CreateBankingTopUpReply.AsObject>('createBankingTopUp', request);
  }

  async approveBankingTopUp(params: ApproveBankingTopUpRequest.AsObject) {
    const request = new ApproveBankingTopUpRequest();
    request.setImageUrl(params.imageUrl);
    request.setNote(params.note);
    request.setPaymentId(params.paymentId);
    request.setTxId(params.txId);
    return await this.gRPCClientRequest<ApproveBankingTopUpReply.AsObject>('approveBankingTopUp', request);
  }

  async rejectBankingTopUp(params: RejectBankingTopUpRequest.AsObject) {
    const request = new RejectBankingTopUpRequest();
    request.setPaymentId(params.paymentId);
    request.setNote(params.note);
    request.setIsMerchantCall(params.isMerchantCall);
    return await this.gRPCClientRequest<RejectBankingTopUpReply.AsObject>('rejectBankingTopUp', request);
  }

  async approveBankingWithdraw(params: ApproveBankingWithdrawRequest.AsObject) {
    const request = new ApproveBankingWithdrawRequest();
    request.setNote(params.note);
    request.setPaymentId(params.paymentId);
    return await this.gRPCClientRequest<ApproveBankingWithdrawReply.AsObject>('approveBankingWithdraw', request);
  }

  async submitBankingWithdraw(params: SubmitBankingWithdrawRequest.AsObject) {
    const request = new SubmitBankingWithdrawRequest();
    request.setAccountName(params.accountName);
    request.setAccountNumber(params.accountNumber);
    request.setAmount(params.amount);
    request.setBankName(params.bankName);
    request.setFee(params.fee);
    request.setImageUrl(params.imageUrl);
    request.setPaymentId(params.paymentId);
    request.setTxId(params.txId);
    request.setNote(params.note);
    return await this.gRPCClientRequest<SubmitBankingWithdrawReply.AsObject>('submitBankingWithdraw', request);
  }

  async rejectBankingWithdraw(params: RejectBankingWithdrawRequest.AsObject) {
    const request = new RejectBankingWithdrawRequest();
    request.setPaymentId(params.paymentId);
    request.setNote(params.note);
    request.setIsMerchantCall(params.isMerchantCall);
    return await this.gRPCClientRequest<RejectBankingWithdrawReply.AsObject>('rejectBankingWithdraw', request);
  }

  async listSystemBankAccounts(params: ListSystemBankAccountsRequest.AsObject) {
    const request = new ListSystemBankAccountsRequest();
    request.setBankNamesList(params.bankNamesList);
    request.setStatuesList(params.statuesList);
    request.setMerchantIdsList(params.merchantIdsList);
    request.setIdsList(params.idsList);
    request.setPage(params.page);
    request.setSize(params.size);

    return await this.gRPCClientRequest<ListSystemBankAccountsReply.AsObject>('listSystemBankAccounts', request);
  }

  async createSystemBankAccount(params: CreateSystemBankAccountRequest.AsObject) {
    const request = new CreateSystemBankAccountRequest();
    request.setBankName(BANKS_STRING[params.bankName]);
    request.setMerchantId(params.merchantId);
    request.setAccountNumber(params.accountNumber);
    request.setAccountName(params.accountName);
    request.setBalance(params.balance);
    request.setDailyBalanceLimit(params.dailyBalanceLimit);
    return await this.gRPCClientRequest<CreateSystemBankAccountReply.AsObject>('createSystemBankAccount', request);
  }

  async verifyMerchantUserBankAccount(params: VerifyMerchantUserBankAccountRequest.AsObject) {
    const request = new VerifyMerchantUserBankAccountRequest();
    request.setBankName(params.bankName);
    request.setAccountName(params.accountName);
    request.setAccountNumber(params.accountNumber);
    return await this.gRPCClientRequest<VerifyMerchantUserBankAccountReply.AsObject>(
      'verifyMerchantUserBankAccount',
      request,
    );
  }

  async validateImportSystemBankAccount(params: ValidateImportSystemBankAccountRequest.AsObject) {
    const request = new ValidateImportSystemBankAccountRequest();

    request.setRecordsList(
      params.recordsList.map((record) => {
        const createSystemBankAccountRequest = new CreateSystemBankAccountRequest();
        console.log('record.accountId', record.accountId);
        createSystemBankAccountRequest.setAccountId(record.accountId);
        createSystemBankAccountRequest.setAccountName(record.accountName);
        createSystemBankAccountRequest.setAccountNumber(record.accountNumber);
        createSystemBankAccountRequest.setBalance(record.balance);
        createSystemBankAccountRequest.setBankName(record.bankName);
        createSystemBankAccountRequest.setBranch(record.branch);
        createSystemBankAccountRequest.setDailyBalanceLimit(record.dailyBalanceLimit);
        createSystemBankAccountRequest.setMerchantId(record.merchantId);
        return createSystemBankAccountRequest;
      }),
    );

    return await this.gRPCClientRequest<ValidateImportSystemBankAccountReply.AsObject>(
      'validateImportSystemBankAccount',
      request,
    );
  }

  async importSystemBankAccount(params: ImportSystemBankAccountRequest.AsObject) {
    const request = new ImportSystemBankAccountRequest();
    request.setRecordsList(
      params.recordsList.map((record) => {
        const createSystemBankAccountRequest = new CreateSystemBankAccountRequest();
        createSystemBankAccountRequest.setAccountId(record.accountId);
        createSystemBankAccountRequest.setBankName(record.bankName);
        createSystemBankAccountRequest.setAccountNumber(record.accountNumber);
        createSystemBankAccountRequest.setAccountName(record.accountName);
        createSystemBankAccountRequest.setBalance(record.balance);
        createSystemBankAccountRequest.setDailyBalanceLimit(record.dailyBalanceLimit);
        createSystemBankAccountRequest.setMerchantId(record.merchantId);
        createSystemBankAccountRequest.setBranch(record.branch);
        return createSystemBankAccountRequest;
      }),
    );
    return await this.gRPCClientRequest<ImportSystemBankAccountReply.AsObject>('importSystemBankAccount', request);
  }

  async updateSystemBankAccountStatus(params: UpdateSystemBankAccountStatusRequest.AsObject) {
    const request = new UpdateSystemBankAccountStatusRequest();
    request.setId(params.id);
    request.setStatus(params.status);
    return await this.gRPCClientRequest<UpdateSystemBankAccountStatusReply.AsObject>(
      'updateSystemBankAccountStatus',
      request,
    );
  }

  async listSystemBankAccountByPaymentInfo(params: ListSystemBankAccountByPaymentInfoRequest.AsObject) {
    const request = new ListSystemBankAccountByPaymentInfoRequest();
    request.setBankName(params.bankName);
    request.setMerchantId(params.merchantId);
    return await this.gRPCClientRequest<ListSystemBankAccountByPaymentInfoReply.AsObject>(
      'listSystemBankAccountByPaymentInfo',
      request,
    );
  }

  async getIsMerchantUserBankAccountVerified(params: GetIsMerchantUserBankAccountVerifiedRequest.AsObject) {
    const request = new GetIsMerchantUserBankAccountVerifiedRequest();
    request.setAccountName(params.accountName);
    request.setAccountNumber(params.accountNumber);
    return await this.gRPCClientRequest<GetIsMerchantUserBankAccountVerifiedReply.AsObject>(
      'getIsMerchantUserBankAccountVerified',
      request,
    );
  }
}

export const gRPCPepperClient = new gRPCClient();
