import { Group, ListGroupsReply } from '@greyhole/myrole/myrole_pb';
import { createSlice, createSelector, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit';
import { stateError, stateLoading, stateSucceeded, StatusEnum } from 'redux/constant';
import { RootState } from 'redux/reducers';
import { GRPCClientResponse } from 'services/grpc/abstract/gRPCClient';
import { createGroupThunk, getListGroupThunk, updateGroupThunk } from './thunks';

type GroupState = {
  entities: Record<string, Group.AsObject>;
  ids: string[];
  status: StatusEnum;
};

const adapter = createEntityAdapter<Group.AsObject>();

const initialState = adapter.getInitialState<GroupState>({
  entities: {},
  ids: [],
  status: StatusEnum.IDLE,
});

const slice = createSlice({
  name: 'group',
  initialState,
  reducers: {},
  extraReducers: {
    [getListGroupThunk.pending.type]: stateLoading,
    [getListGroupThunk.fulfilled.type]: (
      state,
      action: PayloadAction<GRPCClientResponse<ListGroupsReply.AsObject>>,
    ) => {
      const { response, error } = action.payload;
      if (error) return stateError(state, error);
      adapter.upsertMany(state, response.groupsList);
      stateSucceeded(state);
    },
    [createGroupThunk.fulfilled.type]: (state, action: PayloadAction<GRPCClientResponse<Group.AsObject>>) => {
      const { response } = action.payload;
      if (response) {
        adapter.addOne(state, response);
      }
    },
    [updateGroupThunk.fulfilled.type]: (state, action: PayloadAction<GRPCClientResponse<Group.AsObject>>) => {
      const { response } = action.payload;
      if (response) {
        adapter.updateOne(state, {
          id: response.id,
          changes: response,
        });
      }
    },
  },
});

const { reducer } = slice;

export default reducer;

export const selectGroupState = (state: RootState) => state.group;

export const {
  selectAll: selectGroups,
  selectById: selectGroupById,
  selectEntities: selectGroupEntities,
  selectIds: selectGroupIds,
} = adapter.getSelectors(selectGroupState);

export const selectGroupStatus = createSelector(selectGroupState, (group) => group.status);
