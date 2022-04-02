import { UltronClient } from '@mcuc/stark/UltronServiceClientPb';
import {
  CreateCryptoWithdrawReply,
  CreateCryptoWithdrawRequest,
  CancelCryptoWithdrawRequest,
  ApproveCryptoWithdrawRequest,
  ApproveCryptoWithdrawReply,
  RejectCryptoWithdrawRequest,
  RejectCryptoWithdrawReply,
  CancelCryptoTopUpRequest,
  CancelCryptoTopUpReply,
  ApproveCryptoTopUpRequest,
  ApproveCryptoTopUpReply,
  RejectCryptoTopUpRequest,
  RejectCryptoTopUpReply,
  GetCryptoWalletRequest,
  GetCryptoWalletReply,
  ValidateCryptoWalletsRequest,
  ValidateCryptoWalletsReply,
  ImportCryptoWalletsRequest,
  ImportCryptoWalletsReply,
  ListCryptoWalletsRequest,
  ListCryptoWalletsReply,
  LoadCryptoWalletsRequest,
  LoadCryptoWalletsReply,
  CallbackTransactionRequest,
  CallbackTransactionReply,
  CancelCryptoWithdrawReply,
  CryptoWallet,
  SubmitCryptoWithdrawReply,
  SubmitCryptoWithdrawRequest,
  UpdateAutoTransferCryptoWithdrawRequest,
  UpdateAutoTransferCryptoWithdrawReply,
  GetCryptoSettingsRequest,
  GetCryptoSettingsReply,
  ValidateCryptoHotWalletsRequest,
  ValidateCryptoHotWalletsReply,
  ImportCryptoHotWalletsRequest,
  ImportCryptoHotWalletsReply,
  ListCryptoHotWalletsRequest,
  ListCryptoHotWalletsReply,
  SystemCryptoHotWallet,
  GetSystemCryptoHotWalletsRequest,
  GetSystemCryptoHotWalletsReply,
} from '@mcuc/stark/ultron_pb';
import gRPCClientAbstract from '../abstract/gRPCClient';

class gRPCClient extends gRPCClientAbstract {
  constructor() {
    super(UltronClient, 'UltronClient');
  }

  async createCryptoWithdraw(params: CreateCryptoWithdrawRequest.AsObject) {
    const request = new CreateCryptoWithdrawRequest();
    request.setAddress(params.address);
    request.setAmount(params.amount);
    request.setCryptoNetworkType(params.cryptoNetworkType);
    request.setCryptoType(params.cryptoType);
    request.setCryptoWalletName(params.cryptoWalletName);
    return await this.gRPCClientRequest<CreateCryptoWithdrawReply.AsObject>('createCryptoWithdraw', request);
  }

  async cancelCryptoWithdraw(params: CancelCryptoWithdrawRequest.AsObject) {
    const request = new CancelCryptoWithdrawRequest();
    request.setPaymentId(params.paymentId);
    request.setNote(params.note);
    return await this.gRPCClientRequest<CancelCryptoWithdrawReply.AsObject>('cancelCryptoWithdraw', request);
  }

  async approveCryptoWithdraw(params: ApproveCryptoWithdrawRequest.AsObject) {
    const request = new ApproveCryptoWithdrawRequest();
    request.setPaymentId(params.paymentId);
    request.setNote(params.note);
    return await this.gRPCClientRequest<ApproveCryptoWithdrawReply.AsObject>('approveCryptoWithdraw', request);
  }

  async rejectCryptoWithdraw(params: RejectCryptoWithdrawRequest.AsObject) {
    const request = new RejectCryptoWithdrawRequest();
    request.setPaymentId(params.paymentId);
    request.setNote(params.note);
    request.setIsMerchantCall(params.isMerchantCall);
    return await this.gRPCClientRequest<RejectCryptoWithdrawReply.AsObject>('rejectCryptoWithdraw', request);
  }

  async cancelCryptoTopUp(params: CancelCryptoTopUpRequest.AsObject) {
    const request = new CancelCryptoTopUpRequest();
    request.setPaymentId(params.paymentId);
    request.setNote(params.note);
    return await this.gRPCClientRequest<CancelCryptoTopUpReply.AsObject>('cancelCryptoTopUp', request);
  }

  async approveCryptoTopUp(params: ApproveCryptoTopUpRequest.AsObject) {
    const request = new ApproveCryptoTopUpRequest();
    request.setPaymentId(params.paymentId);
    request.setNote(params.note);
    return await this.gRPCClientRequest<ApproveCryptoTopUpReply.AsObject>('approveCryptoTopUp', request);
  }

  async submitCryptoWithdraw(params: SubmitCryptoWithdrawRequest.AsObject) {
    const request = new SubmitCryptoWithdrawRequest();
    request.setPaymentId(params.paymentId);
    request.setAmount(params.amount);
    request.setFee(params.fee);
    request.setSenderAddress(params.senderAddress);
    request.setTxHash(params.txHash);
    request.setNote(params.note);
    request.setImageUrl(params.imageUrl);
    return await this.gRPCClientRequest<SubmitCryptoWithdrawReply.AsObject>('submitCryptoWithdraw', request);
  }

  async rejectCryptoTopUp(params: RejectCryptoTopUpRequest.AsObject) {
    const request = new RejectCryptoTopUpRequest();
    request.setPaymentId(params.paymentId);
    request.setNote(params.note);
    request.setIsMerchantCall(params.isMerchantCall);
    return await this.gRPCClientRequest<RejectCryptoTopUpReply.AsObject>('rejectCryptoTopUp', request);
  }

  async getCryptoWallet(params: GetCryptoWalletRequest.AsObject) {
    const request = new GetCryptoWalletRequest();
    request.setCryptoNetworkType(params.cryptoNetworkType);
    request.setCryptoType(params.cryptoType);
    return await this.gRPCClientRequest<GetCryptoWalletReply.AsObject>('getCryptoWallet', request);
  }

  async validateCryptoWallets(params: ValidateCryptoWalletsRequest.AsObject) {
    const request = new ValidateCryptoWalletsRequest();
    request.setRecordsList(
      params.recordsList.map((record) => {
        const cryptoWallet = new CryptoWallet();
        cryptoWallet.setAddress(record.address);
        cryptoWallet.setCryptoNetworkType(record.cryptoNetworkType);
        cryptoWallet.setCryptoType(record.cryptoType);
        cryptoWallet.setId(record.id);
        cryptoWallet.setMerchantId(record.merchantId);
        cryptoWallet.setStatus(record.status);
        return cryptoWallet;
      }),
    );
    return await this.gRPCClientRequest<ValidateCryptoWalletsReply.AsObject>('validateCryptoWallets', request);
  }

  async importCryptoWallets(params: ImportCryptoWalletsRequest.AsObject) {
    const request = new ImportCryptoWalletsRequest();
    request.setWalletsList(
      params.walletsList.map((wallet) => {
        const cryptoWallet = new CryptoWallet();
        cryptoWallet.setAddress(wallet.address);
        cryptoWallet.setCryptoNetworkType(wallet.cryptoNetworkType);
        cryptoWallet.setCryptoType(wallet.cryptoType);
        cryptoWallet.setId(wallet.id);
        cryptoWallet.setMerchantId(wallet.merchantId);
        return cryptoWallet;
      }),
    );
    return await this.gRPCClientRequest<ImportCryptoWalletsReply.AsObject>('importCryptoWallets', request);
  }

  async listCryptoWallets(params: ListCryptoWalletsRequest.AsObject) {
    const request = new ListCryptoWalletsRequest();
    request.setAddressesList(params.addressesList);
    request.setCryptoNetworkTypesList(params.cryptoNetworkTypesList);
    request.setMerchantIdsList(params.merchantIdsList);
    request.setPage(params.page);
    request.setSize(params.size);
    request.setStatusesList(params.statusesList);
    return await this.gRPCClientRequest<ListCryptoWalletsReply.AsObject>('listCryptoWallets', request);
  }

  async loadCryptoWallets(params: LoadCryptoWalletsRequest.AsObject) {
    const request = new LoadCryptoWalletsRequest();
    request.setCryptoNetworkType(params.cryptoNetworkType);
    request.setCryptoType(params.cryptoType);
    return await this.gRPCClientRequest<LoadCryptoWalletsReply.AsObject>('loadCryptoWallets', request);
  }

  async callbackTransaction(params: CallbackTransactionRequest.AsObject) {
    const request = new CallbackTransactionRequest();
    request.setAmount(params.amount);
    request.setAppTransId(params.appTransId);
    request.setBcFee(params.bcFee);
    request.setBcFeeCurrency(params.bcFeeCurrency);
    request.setCurrency(params.currency);
    request.setMessage(params.message);
    request.setReceivedAmount(params.amount);
    request.setRecipient(params.recipient);
    request.setSender(params.sender);
    request.setState(params.state);
    request.setStoreId(params.storeId);
    request.setTransId(params.transId);
    request.setTransactionFee(params.transactionFee);
    request.setTxHash(params.txHash);
    request.setType(params.type);
    return await this.gRPCClientRequest<CallbackTransactionReply.AsObject>('callbackTransaction', request);
  }

  async updateAutoTransferCryptoWithdraw(params: UpdateAutoTransferCryptoWithdrawRequest.AsObject) {
    const request = new UpdateAutoTransferCryptoWithdrawRequest();
    request.setEnabled(params.enabled);
    return await this.gRPCClientRequest<UpdateAutoTransferCryptoWithdrawReply.AsObject>(
      'updateAutoTransferCryptoWithdraw',
      request,
    );
  }

  async getCryptoSettings() {
    const request = new GetCryptoSettingsRequest();
    return await this.gRPCClientRequest<GetCryptoSettingsReply.AsObject>('getCryptoSettings', request);
  }

  async validateCryptoHotWallets(params: ValidateCryptoHotWalletsRequest.AsObject) {
    const request = new ValidateCryptoHotWalletsRequest();
    request.setRecordsList(
      params.recordsList.map((item) => {
        const wallet = new SystemCryptoHotWallet();
        wallet.setId(item.id);
        wallet.setAddress(item.address);
        wallet.setBalance(item.balance);
        wallet.setCryptoNetworkType(item.cryptoNetworkType);
        wallet.setCryptoType(item.cryptoType);
        wallet.setMerchantId(item.merchantId);
        wallet.setStatus(item.status);
        wallet.setTotalBalance(item.totalBalance);
        return wallet;
      }),
    );
    return await this.gRPCClientRequest<ValidateCryptoHotWalletsReply.AsObject>('validateCryptoHotWallets', request);
  }

  async importCryptoHotWallets(params: ImportCryptoHotWalletsRequest.AsObject) {
    const request = new ImportCryptoHotWalletsRequest();
    request.setRecordsList(
      params.recordsList.map((item) => {
        const wallet = new SystemCryptoHotWallet();
        wallet.setId(item.id);
        wallet.setAddress(item.address);
        wallet.setBalance(item.balance);
        wallet.setCryptoNetworkType(item.cryptoNetworkType);
        wallet.setCryptoType(item.cryptoType);
        wallet.setMerchantId(item.merchantId);
        wallet.setStatus(item.status);
        wallet.setTotalBalance(item.totalBalance);
        return wallet;
      }),
    );
    return await this.gRPCClientRequest<ImportCryptoHotWalletsReply.AsObject>('importCryptoHotWallets', request);
  }

  async listCryptoHotWallets(params: ListCryptoHotWalletsRequest.AsObject) {
    const request = new ListCryptoHotWalletsRequest();
    request.setAddressesList(params.addressesList);
    request.setCryptoNetworkTypesList(params.cryptoNetworkTypesList);
    request.setCryptoTypesList(params.cryptoTypesList);
    request.setMerchantIdsList(params.merchantIdsList);
    request.setPage(params.page);
    request.setSize(params.size);
    request.setStatusesList(params.statusesList);
    return await this.gRPCClientRequest<ListCryptoHotWalletsReply.AsObject>('listCryptoHotWallets', request);
  }

  async getSystemCryptoHotWallets(params: GetSystemCryptoHotWalletsRequest.AsObject) {
    const request = new GetSystemCryptoHotWalletsRequest();
    request.setAmount(params.amount);
    request.setCryptoNetworkType(params.cryptoNetworkType);
    request.setCryptoType(params.cryptoType);
    request.setMerchantId(params.merchantId);
    return await this.gRPCClientRequest<GetSystemCryptoHotWalletsReply.AsObject>('getSystemCryptoHotWallets', request);
  }
}

export const gRPCUltronClient = new gRPCClient();
