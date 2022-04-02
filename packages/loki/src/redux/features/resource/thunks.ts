import { CreateResourceRequest, UpdateResourceRequest } from '@greyhole/myrole/myrole_pb';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { gRPCMyRoleClient } from 'services/grpc/myrole/client';

export const getListResourcesThunk = createAsyncThunk('resource/list', async () => {
  return await gRPCMyRoleClient.listResources();
});

export const createResourceThunk = createAsyncThunk(
  'resource/create',
  async (payload: CreateResourceRequest.AsObject) => {
    return await gRPCMyRoleClient.createResource(payload);
  },
);

export const updateResourceThunk = createAsyncThunk(
  'resource/update',
  async (payload: UpdateResourceRequest.AsObject) => {
    return await gRPCMyRoleClient.updateResource(payload);
  },
);
