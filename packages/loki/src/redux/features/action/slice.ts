import { Action, ListActionsReply } from '@greyhole/myrole/myrole_pb';
import { createSlice, createEntityAdapter, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { stateError, stateLoading, stateSucceeded, StatusEnum } from 'redux/constant';
import { RootState } from 'redux/reducers';
import { GRPCClientResponse } from 'services/grpc/abstract/gRPCClient';
import { createActionThunk, getListActionsThunk, updateActionThunk } from './thunks';

type ActionId = number;
type ResourceId = number;

type ActionState = {
  actionListByResourceId: Record<ResourceId, Action.AsObject[]>;
  entities: Record<ActionId, Action.AsObject>;
  ids: ActionId[];
  status: StatusEnum;
};

const adapter = createEntityAdapter<Action.AsObject>();

const initialState = adapter.getInitialState<ActionState>({
  entities: {},
  ids: [],
  status: StatusEnum.IDLE,
  actionListByResourceId: {},
});

const slice = createSlice({
  name: 'action',
  initialState,
  reducers: {},
  extraReducers: {
    [getListActionsThunk.pending.type]: stateLoading,
    [getListActionsThunk.fulfilled.type]: (
      state,
      action: PayloadAction<GRPCClientResponse<ListActionsReply.AsObject>>,
    ) => {
      const { response, error } = action.payload;
      if (error) return stateError(state, error);

      state.actionListByResourceId = {};
      response.actionsList.forEach((action) => {
        if (state.actionListByResourceId[action.resource.id]) {
          state.actionListByResourceId[action.resource.id].push(action);
        } else {
          state.actionListByResourceId[action.resource.id] = [action];
        }
      });

      adapter.upsertMany(state, response.actionsList);
      stateSucceeded(state);
    },
    [createActionThunk.fulfilled.type]: (state, { payload }: PayloadAction<GRPCClientResponse<Action.AsObject>>) => {
      const { response: action } = payload;
      if (action) {
        adapter.addOne(state, action);

        if (state.actionListByResourceId[action.resource.id]) {
          state.actionListByResourceId[action.resource.id].push(action);
        } else {
          state.actionListByResourceId[action.resource.id] = [action];
        }
      }
    },
    [updateActionThunk.fulfilled.type]: (
      state,
      {
        payload,
        meta,
      }: PayloadAction<GRPCClientResponse<Action.AsObject>, string, { arg: { action: Action.AsObject } }>,
    ) => {
      const { action: oldAction } = meta.arg;

      const { response: action } = payload;

      if (action) {
        adapter.updateOne(state, {
          id: action.id,
          changes: action,
        });

        // If we update action to new resource
        // We have to delete it in old resource
        if (oldAction.resource.id !== action.resource.id) {
          state.actionListByResourceId[oldAction.resource.id] = state.actionListByResourceId[
            oldAction.resource.id
          ].filter((ac) => ac.id !== action.id);
        }

        // Update new data for action
        const actionList = state.actionListByResourceId[action.resource.id] ?? [];
        if (actionList) {
          const index = actionList.findIndex((ac) => ac.id === action.id);
          if (index === -1) {
            actionList.push(action);
          } else {
            actionList[index] = action;
          }
        } else {
          state.actionListByResourceId[action.resource.id] = [action];
        }
      }
    },
  },
});

const { reducer } = slice;

export default reducer;

export const selectActionState = (state: RootState) => state.action;

export const {
  selectAll: selectActions,
  selectById: selectActionById,
  selectIds: selectActionIds,
  selectEntities: selectActionEntities,
} = adapter.getSelectors(selectActionState);

export const selectActionListByResourceId = createSelector(selectActionState, (state) => state.actionListByResourceId);
