import { ListLogsReply, Log } from '@greyhole/mylog/mylog_pb';
import { createSlice, createEntityAdapter, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { Error } from 'grpc-web';
import { stateError, stateLoading, stateSucceeded, StatusEnum } from 'redux/constant';
import { RootState } from 'redux/reducers';
import { GRPCClientResponse } from 'services/grpc/abstract/gRPCClient';
import { getListLogsThunk } from './thunk';

type InitialState = {
  entities: Record<string, Log.AsObject>;
  ids: string[];
  status: StatusEnum;
  error: Error;
  pagination: {
    page: number;
    pageSize: number;
    totalPage: number;
    totalRecord: number;
    cursor: number;
    nextCursor: number;
    prevCursor: number[];
  };
};

const adapter = createEntityAdapter<Log.AsObject>();

const initialState: InitialState = {
  entities: {},
  ids: [],
  status: StatusEnum.IDLE,
  error: null,
  pagination: {
    page: 1,
    pageSize: 50,
    totalPage: 1,
    totalRecord: 0,
    cursor: 0,
    nextCursor: 1,
    prevCursor: [],
  },
};

const slice = createSlice({
  name: 'logs',
  initialState,
  reducers: {
    changePageSize: (state, action: PayloadAction<{ pageSize: number }>) => {
      const { pageSize } = action.payload;
      state.pagination.pageSize = pageSize;
      state.pagination.page = 1;
    },
    changePage: (state, action: PayloadAction<{ page: number }>) => {
      const { page } = action.payload;
      const isNextPage = page > state.pagination.page;
      if (isNextPage) {
        state.pagination.prevCursor.push(state.pagination.cursor);
        state.pagination.cursor = state.pagination.nextCursor;
      } else {
        state.pagination.cursor = state.pagination.prevCursor.pop();
      }
      state.pagination.page = page;
    },
    resetLogs: () => {
      return { ...initialState };
    },
  },
  extraReducers: {
    [getListLogsThunk.pending.type]: stateLoading,
    [getListLogsThunk.fulfilled.type]: (state, action: PayloadAction<GRPCClientResponse<ListLogsReply.AsObject>>) => {
      const { response, error } = action.payload;
      if (error) return stateError(state, error);

      adapter.setAll(state, response.logsList);

      state.pagination.nextCursor = response.nextCursor;
      state.pagination.totalRecord = response.total;
      state.pagination.totalPage = Math.ceil(response.total / state.pagination.pageSize);

      stateSucceeded(state);
    },
  },
});

const { reducer } = slice;

export const { resetLogs, changePage, changePageSize } = slice.actions;

export default reducer;

export const selectLogState = (state: RootState) => state.logs;

export const {
  selectAll: selectLogs,
  selectById: selectLogById,
  selectEntities: selectLogEntities,
  selectIds: selectLogIds,
} = adapter.getSelectors(selectLogState);

export const selectLogPagination = createSelector(selectLogState, (state) => state.pagination);
export const selectLogStatus = createSelector(selectLogState, (state) => state.status);
