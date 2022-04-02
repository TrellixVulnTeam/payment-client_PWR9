import {
  ChangePasswordRequest,
  ConfirmSignInRequest,
  CreatePasswordRequest,
  ResendSignInOTPRequest,
  ResetPasswordRequest,
  SignInRequest,
  SubmitResetPasswordRequest,
  UpdateMetadataRequest,
  VerifyResetPasswordRequest,
} from '@greyhole/myid/myid_pb';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { gRPCMyIdClient } from 'services/grpc/myid/client';

export const verifyAccessTokenThunk = createAsyncThunk('auth/verifyAccessToken', async (payload: any) => {
  return await gRPCMyIdClient.verifyAccessToken(payload.accessToken);
});

export const getAuthThunk = createAsyncThunk('auth/getAuthThunk', async () => {
  return await gRPCMyIdClient.getMe();
});

export const getMeThunk = createAsyncThunk('auth/getMe', async () => {
  return await gRPCMyIdClient.getMe();
});

export const signInThunk = createAsyncThunk('auth/login', async (payload: SignInRequest.AsObject) => {
  return await gRPCMyIdClient.signIn(payload);
});

export const confirmSignInThunk = createAsyncThunk(
  'auth/confirmSignIn',
  async (payload: ConfirmSignInRequest.AsObject) => {
    return await gRPCMyIdClient.confirmSignIn(payload);
  },
);

export const updateMetadataThunk = createAsyncThunk(
  'auth/updateMetadata',
  async (payload: UpdateMetadataRequest.AsObject) => {
    return await gRPCMyIdClient.updateMetadata(payload);
  },
);

export const changePasswordThunk = createAsyncThunk(
  'auth/changePassword',
  async (payload: ChangePasswordRequest.AsObject) => {
    return await gRPCMyIdClient.changePassword(payload);
  },
);

export const verifyResetPasswordThunk = createAsyncThunk(
  'auth/verifyResetPassword',
  async (payload: VerifyResetPasswordRequest.AsObject) => {
    return await gRPCMyIdClient.verifyResetPassword(payload);
  },
);

export const resetPasswordThunk = createAsyncThunk(
  'auth/resetPassword',
  async (payload: ResetPasswordRequest.AsObject) => {
    return await gRPCMyIdClient.resetPassword(payload);
  },
);

export const submitResetPasswordThunk = createAsyncThunk(
  'auth/submitResetPassword',
  async (payload: SubmitResetPasswordRequest.AsObject) => {
    return await gRPCMyIdClient.submitResetPassword(payload);
  },
);

export const createPasswordThunk = createAsyncThunk(
  'auth/createPassword',
  async (payload: CreatePasswordRequest.AsObject) => {
    return await gRPCMyIdClient.createPassword(payload);
  },
);

export const resendSignInOTPThunk = createAsyncThunk(
  'auth/resendSignInOTP',
  async (payload: ResendSignInOTPRequest.AsObject) => {
    return await gRPCMyIdClient.resendSignInOTP(payload);
  },
);
