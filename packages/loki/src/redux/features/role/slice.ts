import { Role, ListRolesReply, Permission } from '@greyhole/myrole/myrole_pb';
import { createSlice, createSelector, createEntityAdapter, PayloadAction } from '@reduxjs/toolkit';
import { stateError, stateLoading, stateSucceeded, StatusEnum } from 'redux/constant';
import { RootState } from 'redux/reducers';
import { GRPCClientResponse } from 'services/grpc/abstract/gRPCClient';
import { createRoleThunk, getListRolesThunk, getRoleThunk, updateRolePermissionThunk, updateRoleThunk } from './thunks';

type GroupId = number;
type RoleId = number;
type ActionId = number;
type ResourceId = number;

type ActionIdsByResourceId = Record<ResourceId, ActionId[]>;

type GroupState = {
  entities: Record<RoleId, Role.AsObject>;
  ids: RoleId[];
  status: StatusEnum;
  roleSelected: RoleId;
  roleListByGroupId: Record<GroupId, Role.AsObject[]>;
  permissionsByRoleId: Record<RoleId, ActionIdsByResourceId>;
};

const adapter = createEntityAdapter<Role.AsObject>();

const normalizeGroup = (list: Role.AsObject[]) => {
  const mapping = {};
  list.forEach((role) => {
    const groupId = role.group.id;
    if (!mapping[groupId]) {
      mapping[groupId] = [];
    }
    mapping[groupId].push(role);
  });
  return mapping;
};

const normalizeRole = (list: Role.AsObject[]) => {
  const resourceActionIdsByRoleId = {};
  list.forEach((role) => {
    const { id: roleId, permissionsList } = role;

    const permissions = {};
    permissionsList.forEach((p) => {
      const { actionsList } = p;
      if (actionsList.length > 0) {
        const resourceId = actionsList[0].resource.id;
        permissions[resourceId] = actionsList.map((a) => a.id);
      }
    });

    resourceActionIdsByRoleId[roleId] = permissions;
  });
  return resourceActionIdsByRoleId;
};

const normalizePermission = (list: Permission.AsObject[]) => {
  let actionIdsByResourceId = {};
  list.forEach((permission) => {
    permission.actionsList.forEach((action) => {
      if (actionIdsByResourceId[action.resource.id]) {
        actionIdsByResourceId[action.resource.id].push(action.id);
      } else {
        actionIdsByResourceId[action.resource.id] = [action.id];
      }
    });
  });
  return actionIdsByResourceId;
};

const initialState = adapter.getInitialState<GroupState>({
  entities: {},
  ids: [],
  status: StatusEnum.IDLE,
  roleSelected: null,
  roleListByGroupId: {},
  permissionsByRoleId: {},
});

const slice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    selectRole(state, action) {
      state.roleSelected = action.payload.roleId;
    },
    unselectRole(state) {
      state.roleSelected = null;
    },
    toggleAction(state, action) {
      const roleId = state.roleSelected;
      const { resourceId, actionId } = action.payload;

      const actionList = state.permissionsByRoleId[roleId][resourceId];
      if (actionList) {
        const index = actionList.indexOf(actionId);
        if (index === -1) {
          actionList.push(actionId);
        } else {
          actionList.splice(index, 1);
        }
      } else {
        state.permissionsByRoleId[roleId][resourceId] = [actionId];
      }
    },
    toggleActionAll(state, action) {
      const { resourceId, actionList } = action.payload;
      const roleId = state.roleSelected;
      state.permissionsByRoleId[roleId][resourceId] = actionList;
    },
  },
  extraReducers: {
    [getRoleThunk.fulfilled.type]: (state, action: PayloadAction<GRPCClientResponse<Role.AsObject>>) => {
      const { response: role } = action.payload;
      if (role) {
        if (role.permissionsList && role.permissionsList.length) {
          state.permissionsByRoleId[role.id] = normalizePermission(role.permissionsList);
        }
      }
      adapter.upsertOne(state, role);
    },
    [getListRolesThunk.pending.type]: stateLoading,
    [getListRolesThunk.fulfilled.type]: (state, action) => {
      const { error, response }: GRPCClientResponse<ListRolesReply.AsObject> = action.payload;
      if (error) return stateError(state, error);

      state.permissionsByRoleId = normalizeRole(response.recordsList);
      state.roleListByGroupId = normalizeGroup(response.recordsList);

      adapter.upsertMany(state, response.recordsList);

      stateSucceeded(state);
    },
    [createRoleThunk.fulfilled.type]: (state, action: PayloadAction<GRPCClientResponse<Role.AsObject>>) => {
      const { response } = action.payload;
      if (response) {
        adapter.addOne(state, response);
      }
    },
    [updateRoleThunk.fulfilled.type]: (state, action: PayloadAction<GRPCClientResponse<Role.AsObject>>) => {
      const { response } = action.payload;
      if (response) {
        adapter.updateOne(state, {
          id: response.id,
          changes: response,
        });
      }
    },
    [updateRolePermissionThunk.fulfilled.type]: (state, action: PayloadAction<GRPCClientResponse<Role.AsObject>>) => {
      const { response: role } = action.payload;
      if (role) {
        if (role.permissionsList.length) {
          state.permissionsByRoleId[role.id] = normalizePermission(role.permissionsList);
        }
      }
    },
  },
});

const { reducer } = slice;

export const { selectRole, unselectRole, toggleAction, toggleActionAll } = slice.actions;

export default reducer;

export const selectRoleState = (state: RootState) => state.role;

export const {
  selectAll: selectRoles,
  selectById: selectRoleById,
  selectEntities: selectRoleEntities,
} = adapter.getSelectors(selectRoleState);

export const selectRoleStatus = createSelector(selectRoleState, (state) => state.status);
export const selectRoleSelected = createSelector(selectRoleState, (state) => state.roleSelected);
export const selectPermissionByRoleId = createSelector(selectRoleState, (state) => state.permissionsByRoleId);
