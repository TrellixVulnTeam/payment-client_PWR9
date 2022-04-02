import { ListLogsRequest, MeRequest } from '@greyhole/mylog/mylog_pb';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { gRPCMyLogClient } from 'services/grpc/mylog/client';

export const getListLogsThunk = createAsyncThunk('logs/getList', async (payload: ListLogsRequest.AsObject) => {
  return await gRPCMyLogClient.listLogs(payload);
});

export const getMeLogs = createAsyncThunk('logs/getList', async (payload: MeRequest.AsObject) => {
  return await gRPCMyLogClient.me(payload);
});
