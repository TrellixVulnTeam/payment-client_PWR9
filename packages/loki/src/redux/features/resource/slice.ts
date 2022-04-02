import { Resource, ListResourcesReply } from '@greyhole/myrole/myrole_pb';
import { createSlice, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit';
import { stateError, stateLoading, stateSucceeded, StatusEnum } from 'redux/constant';
import { RootState } from 'redux/reducers';
import { GRPCClientResponse } from 'services/grpc/abstract/gRPCClient';
import { createResourceThunk, getListResourcesThunk, updateResourceThunk } from './thunks';

type ResourceState = {
  entities: Record<string, Resource.AsObject>;
  ids: string[];
  status: StatusEnum;
};

const adapter = createEntityAdapter<Resource.AsObject>();

const initialState = adapter.getInitialState<ResourceState>({
  entities: {},
  ids: [],
  status: StatusEnum.IDLE,
});

const slice = createSlice({
  name: 'resource',
  initialState,
  reducers: {},
  extraReducers: {
    [getListResourcesThunk.pending.type]: stateLoading,
    [getListResourcesThunk.fulfilled.type]: (
      state,
      action: PayloadAction<GRPCClientResponse<ListResourcesReply.AsObject>>,
    ) => {
      const { response, error } = action.payload;
      if (error) return stateError(state, error);
      adapter.upsertMany(state, response.resourcesList);
      stateSucceeded(state);
    },
    [createResourceThunk.fulfilled.type]: (state, action: PayloadAction<GRPCClientResponse<Resource.AsObject>>) => {
      const { response } = action.payload;
      if (response) {
        adapter.addOne(state, response);
      }
    },
    [updateResourceThunk.fulfilled.type]: (state, action: PayloadAction<GRPCClientResponse<Resource.AsObject>>) => {
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

export const selectResourceState = (state: RootState) => state.resource;

export const {
  selectAll: selectResources,
  selectById: selectResourceById,
  selectEntities: selectResourceEntities,
} = adapter.getSelectors(selectResourceState);
