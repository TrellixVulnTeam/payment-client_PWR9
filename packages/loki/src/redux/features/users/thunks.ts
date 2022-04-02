import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  ListUsersRequest,
  CreateUserRequest,
  GetUserRequest,
  UpdateUserRequest,
  LockUserRequest,
  UnlockUserRequest,
  ResendCreatePasswordOTPRequest,
} from '@greyhole/myid/myid_pb';
import { gRPCUsersClient } from 'services/grpc/users/client';

export const listUsersThunk = createAsyncThunk('users/listUsers', async (payload: ListUsersRequest.AsObject) => {
  return await gRPCUsersClient.listUsers(payload);
});

export const createServiceUserThunk = createAsyncThunk(
  'users/createUser',
  async (payload: CreateUserRequest.AsObject) => {
    return await gRPCUsersClient.createUser(payload);
  },
);

export const getUserThunk = createAsyncThunk('users/getUser', async (payload: GetUserRequest.AsObject) => {
  return await gRPCUsersClient.getUser(payload);
});

export const updateUserThunk = createAsyncThunk(
  'users/updateUser',
  async (payload: UpdateUserRequest.AsObject) => {
    return await gRPCUsersClient.updateUser(payload);
  },
);

export const lockUserThunk = createAsyncThunk('users/lockUser', async (payload: LockUserRequest.AsObject) => {
  return await gRPCUsersClient.lockUser(payload);
});

export const unlockUserThunk = createAsyncThunk('users/unlockUser', async (payload: UnlockUserRequest.AsObject) => {
  return await gRPCUsersClient.unlockUser(payload);
});

export const resendCreatePasswordOTPThunk = createAsyncThunk(
  'auth/resendCreatePasswordOTP',
  async (payload: ResendCreatePasswordOTPRequest.AsObject) => {
    return await gRPCUsersClient.resendCreatePasswordOTP(payload);
  },
);
