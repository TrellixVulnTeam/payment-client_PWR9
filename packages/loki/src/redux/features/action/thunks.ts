import { Action, CreateActionRequest, GetActionRequest, UpdateActionRequest } from '@greyhole/myrole/myrole_pb';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { gRPCMyRoleClient } from 'services/grpc/myrole/client';

export const getActionThunk = createAsyncThunk('action/get', async (params: GetActionRequest.AsObject) => {
  return await gRPCMyRoleClient.getAction(params);
});

export const getListActionsThunk = createAsyncThunk('action/list', async () => {
  return await gRPCMyRoleClient.listActions();
});

export const createActionThunk = createAsyncThunk('action/create', async (payload: CreateActionRequest.AsObject) => {
  return await gRPCMyRoleClient.createAction(payload);
});

export const updateActionThunk = createAsyncThunk(
  'action/update',
  async (payload: { action: Action.AsObject; newAction: UpdateActionRequest.AsObject }) => {
    return await gRPCMyRoleClient.updateAction(payload.newAction);
  },
);
