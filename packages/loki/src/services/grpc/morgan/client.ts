import { Card } from '@mcuc/groot/groot_pb';
import { MorganClient } from '@mcuc/stark/MorganServiceClientPb';
import {
  CreateTelcoWithdrawRequest,
  CreateTelcoWithdrawReply,
  CreateTelcoTopUpRequest,
  CreateTelcoTopUpReply,
  CancelTelcoWithdrawRequest,
  CancelTelcoWithdrawReply,
  ApproveTelcoWithdrawRequest,
  ApproveTelcoWithdrawReply,
  ApproveTelcoTopUpRequest,
  ApproveTelcoTopUpReply,
  RejectTelcoTopUpRequest,
  RejectTelcoTopUpReply,
  RejectTelcoWithdrawRequest,
  RejectTelcoWithdrawReply,
  GetSettingsRequest,
  GetSettingsReply,
  UpdateUsingThirdPartySettingReply,
  UpdateUsingThirdPartySettingRequest,
  UpdateChargeCardProvidersSettingRequest,
  Provider,
  UpdateChargeCardProvidersSettingReply,
  UpdateTopUpAutoApprovalSettingRequest,
  UpdateTopUpAutoApprovalSettingReply,
  UpdateGetCardProvidersSettingRequest,
  UpdateGetCardProvidersSettingReply,
} from '@mcuc/stark/morgan_pb';
import gRPCClientAbstract from '../abstract/gRPCClient';

class gRPCClient extends gRPCClientAbstract {
  constructor() {
    super(MorganClient, 'MorganClient');
  }

  async createTelcoWithdraw(params: CreateTelcoWithdrawRequest.AsObject) {
    const request = new CreateTelcoWithdrawRequest();
    request.setAmount(params.amount);
    request.setTelcoName(params.telcoName);
    return await this.gRPCClientRequest<CreateTelcoWithdrawReply.AsObject>('createTelcoWithdraw', request);
  }

  async createTelcoTopUp(params: CreateTelcoTopUpRequest.AsObject) {
    const request = new CreateTelcoTopUpRequest();
    request.setTxId(params.txId);
    if (params.card) {
      const card = new Card();
      card.setAmount(params.card.amount);
      card.setCode(params.card.code);
      card.setPrice(params.card.price);
      card.setSerial(params.card.serial);
      request.setCard(card);
    }
    return await this.gRPCClientRequest<CreateTelcoTopUpReply.AsObject>('createTelcoTopUp', request);
  }

  async cancelTelcoWithdraw(params: CancelTelcoWithdrawRequest.AsObject) {
    const request = new CancelTelcoWithdrawRequest();
    request.setPaymentId(params.paymentId);
    return await this.gRPCClientRequest<CancelTelcoWithdrawReply.AsObject>('cancelTelcoWithdraw', request);
  }

  async approveTelcoTopUp(params: ApproveTelcoTopUpRequest.AsObject) {
    const request = new ApproveTelcoTopUpRequest();
    request.setNote(params.note);
    request.setPaymentId(params.paymentId);
    return await this.gRPCClientRequest<ApproveTelcoTopUpReply.AsObject>('approveTelcoTopUp', request);
  }

  async approveTelcoWithdraw(params: ApproveTelcoWithdrawRequest.AsObject) {
    const request = new ApproveTelcoWithdrawRequest();
    request.setNote(params.note);
    request.setPaymentId(params.paymentId);
    return await this.gRPCClientRequest<ApproveTelcoWithdrawReply.AsObject>('approveTelcoWithdraw', request);
  }

  async rejectTelcoTopUp(params: RejectTelcoTopUpRequest.AsObject) {
    const request = new RejectTelcoTopUpRequest();
    request.setPaymentId(params.paymentId);
    request.setNote(params.note);
    request.setIsMerchantCall(params.isMerchantCall);
    return await this.gRPCClientRequest<RejectTelcoTopUpReply.AsObject>('rejectTelcoTopUp', request);
  }

  async rejectTelcoWithdraw(params: RejectTelcoWithdrawRequest.AsObject) {
    const request = new RejectTelcoWithdrawRequest();
    request.setPaymentId(params.paymentId);
    request.setNote(params.note);
    request.setIsMerchantCall(params.isMerchantCall);
    return await this.gRPCClientRequest<RejectTelcoWithdrawReply.AsObject>('rejectTelcoWithdraw', request);
  }

  async getSettings() {
    const request = new GetSettingsRequest();
    return await this.gRPCClientRequest<GetSettingsReply.AsObject>('getSettings', request);
  }

  async updateTopUpAutoApprovalSetting(params: UpdateTopUpAutoApprovalSettingRequest.AsObject) {
    const request = new UpdateTopUpAutoApprovalSettingRequest();
    request.setTopUpAutoApproval(params.topUpAutoApproval);
    return await this.gRPCClientRequest<UpdateTopUpAutoApprovalSettingReply.AsObject>(
      'updateTopUpAutoApprovalSetting',
      request,
    );
  }

  async updateUsingThirdPartySetting(params: UpdateUsingThirdPartySettingRequest.AsObject) {
    const request = new UpdateUsingThirdPartySettingRequest();
    request.setEnableThirdParty(params.enableThirdParty);
    return await this.gRPCClientRequest<UpdateUsingThirdPartySettingReply.AsObject>(
      'updateUsingThirdPartySetting',
      request,
    );
  }

  async updateChargeCardProvidersSetting(params: UpdateChargeCardProvidersSettingRequest.AsObject) {
    const request = new UpdateChargeCardProvidersSettingRequest();
    request.setProvidersList(
      params.providersList.map((item) => {
        const provider = new Provider();
        provider.setEnable(item.enable);
        provider.setName(item.name);
        provider.setPriority(item.priority);
        return provider;
      }),
    );
    return await this.gRPCClientRequest<UpdateChargeCardProvidersSettingReply.AsObject>(
      'updateChargeCardProvidersSetting',
      request,
    );
  }

  async updateGetCardProvidersSetting(params: UpdateGetCardProvidersSettingRequest.AsObject) {
    const request = new UpdateGetCardProvidersSettingRequest();
    request.setProvidersList(
      params.providersList.map((item) => {
        const provider = new Provider();
        provider.setEnable(item.enable);
        provider.setName(item.name);
        provider.setPriority(item.priority);
        return provider;
      }),
    );
    return await this.gRPCClientRequest<UpdateGetCardProvidersSettingReply.AsObject>(
      'updateGetCardProvidersSetting',
      request,
    );
  }
}

export const gRPCMorganClient = new gRPCClient();
