import { MyIDClient } from '@greyhole/myid/MyidServiceClientPb';
import {
  SignInReply,
  SignInRequest,
  UpdateMetadataRequest,
  ConfirmSignInReply,
  ConfirmSignInRequest,
  MeReply,
  ResetPasswordReply,
  ResetPasswordRequest,
  ChangePasswordRequest,
  VerifyResetPasswordRequest,
  SubmitResetPasswordRequest,
  CreateAccessTokenReply,
  CreateAccessTokenRequest,
  UpdateEmailRequest,
  UpdateEmailReply,
  VerifyEmailRequest,
  VerifyEmailReply,
  CreatePasswordRequest,
  ResendSignInOTPRequest,
  ResendSignInOTPReply,
} from '@greyhole/myid/myid_pb';
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';

import gRPCClientAbstract from '../abstract/gRPCClient';

class gRPCClient extends gRPCClientAbstract {
  constructor() {
    super(MyIDClient, 'MyIDClient');
  }

  async signIn(params: SignInRequest.AsObject) {
    const request = new SignInRequest();
    request.setUsername(params.username);
    request.setPassword(params.password);

    return await this.gRPCClientRequest<SignInReply.AsObject>('signIn', request);
  }

  async confirmSignIn(params: ConfirmSignInRequest.AsObject) {
    const request = new ConfirmSignInRequest();
    request.setOtpId(params.otpId);
    request.setOtp(params.otp);
    return await this.gRPCClientRequest<ConfirmSignInReply.AsObject>('confirmSignIn', request);
  }

  async resendSignInOTP(params: ResendSignInOTPRequest.AsObject) {
    const request = new ResendSignInOTPRequest();
    request.setOtpId(params.otpId);
    return await this.gRPCClientRequest<ResendSignInOTPReply.AsObject>('resendSignInOTP', request);
  }

  async resetPassword(params: ResetPasswordRequest.AsObject) {
    const request = new ResetPasswordRequest();
    if (params.email) request.setEmail(params.email);
    if (params.phoneNumber) request.setPhoneNumber(params.phoneNumber);
    return await this.gRPCClientRequest<ResetPasswordReply.AsObject>('resetPassword', request);
  }

  async changePassword(r: ChangePasswordRequest.AsObject) {
    const request = new ChangePasswordRequest();
    request.setCurrentPassword(r.currentPassword);
    request.setNewPassword(r.newPassword);
    request.setConfirmNewPassword(r.confirmNewPassword);
    return await this.gRPCClientRequest('changePassword', request);
  }

  async updateMetadata(params: UpdateMetadataRequest.AsObject) {
    const request = new UpdateMetadataRequest();
    request.setMetadata(params.metadata);

    return await this.gRPCClientRequest('updateMetadata', request);
  }

  async verifyResetPassword(params: VerifyResetPasswordRequest.AsObject) {
    const request = new VerifyResetPasswordRequest();
    request.setOtpId(params.otpId);
    request.setOtp(params.otp);
    return await this.gRPCClientRequest<Empty>('verifyResetPassword', request);
  }

  async submitResetPassword(params: SubmitResetPasswordRequest.AsObject) {
    const request = new SubmitResetPasswordRequest();
    request.setNewPassword(params.newPassword);
    request.setConfirmNewPassword(params.confirmNewPassword);
    request.setOtpId(params.otpId);
    request.setOtp(params.otp);
    return await this.gRPCClientRequest<Empty>('submitResetPassword', request);
  }

  async createAccessToken(params: CreateAccessTokenRequest.AsObject) {
    const request = new CreateAccessTokenRequest();
    request.setIdToken(params.idToken);
    return await this.gRPCClientRequest<CreateAccessTokenReply.AsObject>('createAccessToken', request);
  }

  async updateEmail(params: UpdateEmailRequest.AsObject) {
    const request = new UpdateEmailRequest();
    request.setEmail(params.email);
    return await this.gRPCClientRequest<UpdateEmailReply.AsObject>('updateEmail', request);
  }

  async verifyEmail(params: VerifyEmailRequest.AsObject) {
    const request = new VerifyEmailRequest();
    request.setOtpId(params.otpId);
    request.setOtp(params.otp);
    return await this.gRPCClientRequest<VerifyEmailReply.AsObject>('verifyEmail', request);
  }

  async createPassword(params: CreatePasswordRequest.AsObject) {
    const request = new CreatePasswordRequest();
    request.setOtpId(params.otpId);
    request.setOtp(params.otp);
    request.setNewPassword(params.newPassword);
    request.setConfirmNewPassword(params.confirmNewPassword);
    return await this.gRPCClientRequest('createPassword', request);
  }

  async verifyAccessToken(params: CreateAccessTokenRequest.AsObject) {
    const request = new CreateAccessTokenRequest();
    request.setIdToken(params.idToken);
    return await this.gRPCClientRequest<CreateAccessTokenReply.AsObject>('createAccessToken', request);
  }

  async getMe() {
    const empty = new Empty();
    return await this.gRPCClientRequest<MeReply.AsObject>('me', empty);
  }
}

export const gRPCMyIdClient = new gRPCClient();
