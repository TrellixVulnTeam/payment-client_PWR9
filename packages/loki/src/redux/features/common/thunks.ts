import { GetUsersRequest } from '@greyhole/myid/myid_pb';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { gRPCUsersClient } from 'services/grpc/users/client';

export const getUsersThunk = createAsyncThunk('common/getUsers', async (payload: GetUsersRequest.AsObject) => {
  return await gRPCUsersClient.getUsers(payload);
});
