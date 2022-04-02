import { GetUserReply, ListUsersReply, LockUserReply, UnlockUserReply, UpdateUserReply } from '@greyhole/myid/myid_pb';
import { createEntityAdapter, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { stateError, stateLoading, stateSucceeded, StatusEnum } from 'redux/constant';
import { RootState } from 'redux/reducers';
import { GRPCClientResponse } from 'services/grpc/abstract/gRPCClient';
import { parseJson } from 'utils/common';
import { getUserThunk, updateUserThunk, listUsersThunk, unlockUserThunk, lockUserThunk } from './thunks';
import { UserCustom, UserMetadata } from './types';

export interface InitState {
  error: any;
  status: StatusEnum;
  statusCreated: StatusEnum;
  statusUpdate: StatusEnum;
  ids: string[];
  entities: Record<string, UserCustom>;
  pagination: {
    page: number;
    pageSize: number;
    totalPage: number;
    totalRecord: number;
    cursor: number;
    nextCursor: number;
    prevCursor: number[];
  };
}

const usersAdapter = createEntityAdapter<UserCustom>({
  selectId: (entity) => entity.userId,
});

const initialState = usersAdapter.getInitialState<InitState>({
  status: StatusEnum.IDLE,
  error: null,
  statusCreated: StatusEnum.IDLE,
  statusUpdate: StatusEnum.IDLE,
  ids: [],
  entities: {},
  pagination: {
    page: 1,
    pageSize: 50,
    totalPage: 1,
    totalRecord: 0,
    cursor: 0,
    nextCursor: 1,
    prevCursor: [],
  },
});

const slice = createSlice({
  name: 'users',
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
  },
  extraReducers: {
    // * listUsersThunk
    [listUsersThunk.pending.type]: stateLoading,
    [listUsersThunk.fulfilled.type]: (state, action: PayloadAction<GRPCClientResponse<ListUsersReply.AsObject>>) => {
      const { response, error } = action.payload;
      if (error) stateError(state, error);
      const usersList = response?.usersList.map((item) => {
        const metadata: UserMetadata['metadata'] = parseJson(item.metadata);
        return {
          ...item,
          metadata,
          displayName: metadata.fullName || item.username,
        };
      });
      usersAdapter.setAll(state, usersList);

      state.pagination.nextCursor = response.nextCursor;
      state.pagination.totalRecord = response.total;
      state.pagination.totalPage = Math.ceil(response.total / state.pagination.pageSize);

      stateSucceeded(state);
    },
    // * getUserThunk
    [getUserThunk.pending.type]: stateLoading,
    [getUserThunk.fulfilled.type]: (state, action: PayloadAction<GRPCClientResponse<GetUserReply.AsObject>>) => {
      const { response, error } = action.payload;
      if (error) return stateError(state, error);
      const metadata: UserMetadata['metadata'] = parseJson(response.user.metadata);
      usersAdapter.upsertOne(state, {
        ...response.user,
        displayName: metadata.fullName || response.user.username,
        metadata,
      });
      stateSucceeded(state);
    },
    // * updateUserThunk
    [updateUserThunk.pending.type]: (state) => {
      state.statusUpdate = StatusEnum.LOADING;
    },
    [updateUserThunk.fulfilled.type]: (state, action: PayloadAction<GRPCClientResponse<UpdateUserReply.AsObject>>) => {
      const { response, error } = action.payload;
      if (error) return stateError(state, error);
      const metadata: UserMetadata['metadata'] = parseJson(response.user.metadata);
      usersAdapter.upsertOne(state, {
        ...response.user,
        displayName: metadata.fullName || response.user.username,
        metadata,
      });
      state.statusUpdate = StatusEnum.IDLE;
    },
    // * unlockUserThunk
    [unlockUserThunk.fulfilled.type]: (state, action: PayloadAction<GRPCClientResponse<UnlockUserReply.AsObject>>) => {
      const { response, error } = action.payload;
      if (error) return stateError(state, error);
      const user = response.user;
      if (user) {
        state.entities[user.userId].status = user.status;
      }
      stateSucceeded(state);
    },
    // * lockUserThunk
    [lockUserThunk.fulfilled.type]: (state, action: PayloadAction<GRPCClientResponse<LockUserReply.AsObject>>) => {
      const { response, error } = action.payload;
      if (error) return stateError(state, error);
      const user = response.user;
      if (user) {
        state.entities[user.userId].status = user.status;
      }
      stateSucceeded(state);
    },
  },
});

const { reducer } = slice;

export const { changePage, changePageSize } = slice.actions;

export default reducer;

export const { selectAll: selectUsers, selectById: selectUserById } = usersAdapter.getSelectors(
  (state: RootState) => state.users,
);

export const selectUserState = (state: RootState) => state.users;

export const selectUserStatus = createSelector(selectUserState, (state) => state.status);

export const selectUserStatusUpdate = createSelector(selectUserState, (state) => state.statusUpdate);

export const selectUserPagination = createSelector(selectUserState, (state) => state.pagination);
