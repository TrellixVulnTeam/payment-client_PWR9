import {
  CreateRoleRequest,
  GetRoleRequest,
  UpdateRolePermissionRequest,
  UpdateRoleRequest,
} from '@greyhole/myrole/myrole_pb';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { gRPCMyRoleClient } from 'services/grpc/myrole/client';

export const getRoleThunk = createAsyncThunk('role/get', async (payload: GetRoleRequest.AsObject) => {
  return await gRPCMyRoleClient.getRole(payload);
});

export const getListRolesThunk = createAsyncThunk('role/list', async () => {
  return await gRPCMyRoleClient.listRoles();
});

export const createRoleThunk = createAsyncThunk('role/create', async (payload: CreateRoleRequest.AsObject) => {
  return await gRPCMyRoleClient.createRole(payload);
});

export const updateRoleThunk = createAsyncThunk('role/update', async (payload: UpdateRoleRequest.AsObject) => {
  return await gRPCMyRoleClient.updateRole(payload);
});

export const updateRolePermissionThunk = createAsyncThunk(
  'role/updateRolePermission',
  async (payload: UpdateRolePermissionRequest.AsObject) => {
    return await gRPCMyRoleClient.updateRolePermission(payload);
  },
);
