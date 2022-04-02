import { CreateGroupRequest, UpdateGroupRequest } from '@greyhole/myrole/myrole_pb';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { gRPCMyRoleClient } from 'services/grpc/myrole/client';

export const getListGroupThunk = createAsyncThunk('group/list', async () => {
  return await gRPCMyRoleClient.listGroups();
});

export const createGroupThunk = createAsyncThunk('group/create', async (payload: CreateGroupRequest.AsObject) => {
  return await gRPCMyRoleClient.createGroup(payload);
});

export const updateGroupThunk = createAsyncThunk('group/update', async (payload: UpdateGroupRequest.AsObject) => {
  return await gRPCMyRoleClient.updateGroup(payload);
});
