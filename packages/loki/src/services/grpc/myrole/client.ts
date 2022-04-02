import { MyRoleClient } from '@greyhole/myrole/MyroleServiceClientPb';
import {
  Action,
  CreateActionRequest,
  CreateGroupRequest,
  CreateModuleRequest,
  CreateResourceRequest,
  CreateRoleRequest,
  ListActionsReply,
  ListActionsRequest,
  ListGroupsReply,
  ListGroupsRequest,
  ListModulesReply,
  ListModulesRequest,
  ListResourcesReply,
  ListResourcesRequest,
  ListRolesReply,
  ListRolesRequest,
  GetActionRequest,
  Resource,
  UpdateActionRequest,
  UpdateGroupRequest,
  UpdateModuleRequest,
  UpdateResourceRequest,
  UpdateRolePermissionRequest,
  UpdateRoleRequest,
  GetRoleRequest,
  Role,
} from '@greyhole/myrole/myrole_pb';
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';

import gRPCClientAbstract from '../abstract/gRPCClient';

class gRPCClient extends gRPCClientAbstract {
  constructor() {
    super(MyRoleClient, 'MyRoleClient');
  }

  async listResources() {
    const request = new ListResourcesRequest();
    return await this.gRPCClientRequest<ListResourcesReply.AsObject>('listResources', request);
  }

  async createResource(params: CreateResourceRequest.AsObject) {
    const request = new CreateResourceRequest();
    request.setName(params.name);
    request.setDescription(params.description);
    return await this.gRPCClientRequest<Resource.AsObject>('createResource', request);
  }

  async updateResource(params: UpdateResourceRequest.AsObject) {
    const request = new UpdateResourceRequest();
    request.setId(params.id);
    request.setName(params.name);
    request.setDescription(params.description);
    return await this.gRPCClientRequest<Resource.AsObject>('updateResource', request);
  }

  async getAction(params: GetActionRequest.AsObject) {
    const request = new GetActionRequest();
    request.setId(params.id);
    return await this.gRPCClientRequest<Action.AsObject>('getAction', request);
  }

  async getRole(params: GetRoleRequest.AsObject) {
    const request = new GetRoleRequest();
    request.setId(params.id);
    return await this.gRPCClientRequest<Role.AsObject>('getRole', request);
  }

  async listActions() {
    const request = new ListActionsRequest();
    return await this.gRPCClientRequest<ListActionsReply.AsObject>('listActions', request);
  }

  async createAction(params: CreateActionRequest.AsObject) {
    const request = new CreateActionRequest();
    request.setName(params.name);
    request.setPath(params.path);
    request.setDescription(params.description);
    request.setResourceId(params.resourceId);
    return await this.gRPCClientRequest<Action.AsObject>('createAction', request);
  }

  async updateAction(params: UpdateActionRequest.AsObject) {
    const request = new UpdateActionRequest();
    request.setId(params.id);
    request.setName(params.name);
    request.setPath(params.path);
    request.setDescription(params.description);
    request.setResourceId(params.resourceId);
    return await this.gRPCClientRequest<Action.AsObject>('updateAction', request);
  }

  async listRoles() {
    const request = new ListRolesRequest();
    return await this.gRPCClientRequest<ListRolesReply.AsObject>('listRoles', request);
  }

  async createRole(params: CreateRoleRequest.AsObject) {
    const request = new CreateRoleRequest();
    request.setName(params.name);
    request.setDescription(params.description);
    request.setGroupId(params.groupId);
    return await this.gRPCClientRequest<Empty.AsObject>('createRole', request);
  }

  async updateRole(params: UpdateRoleRequest.AsObject) {
    const request = new UpdateRoleRequest();
    request.setId(params.id);
    request.setName(params.name);
    request.setDescription(params.description);
    request.setGroupId(params.groupId);
    return await this.gRPCClientRequest<Empty.AsObject>('updateRole', request);
  }

  async listModules() {
    const request = new ListModulesRequest();
    return await this.gRPCClientRequest<ListModulesReply.AsObject>('listRole', request);
  }

  async createModule(params: CreateModuleRequest.AsObject) {
    const request = new CreateModuleRequest();
    request.setName(params.name);
    request.setDescription(params.description);
    return await this.gRPCClientRequest<Empty.AsObject>('createModule', request);
  }

  async updateModule(params: UpdateModuleRequest.AsObject) {
    const request = new UpdateModuleRequest();
    request.setId(params.id);
    request.setName(params.name);
    request.setDescription(params.description);
    return await this.gRPCClientRequest<Empty.AsObject>('updateModule', request);
  }

  async listGroups() {
    const request = new ListGroupsRequest();
    return await this.gRPCClientRequest<ListGroupsReply.AsObject>('listGroups', request);
  }

  async createGroup(params: CreateGroupRequest.AsObject) {
    const request = new CreateGroupRequest();
    request.setName(params.name);
    request.setDescription(params.description);
    request.setModuleIdsList(params.moduleIdsList);
    return await this.gRPCClientRequest<Empty.AsObject>('createGroup', request);
  }

  async updateGroup(params: UpdateGroupRequest.AsObject) {
    const request = new UpdateGroupRequest();
    request.setId(params.id);
    request.setName(params.name);
    request.setDescription(params.description);
    return await this.gRPCClientRequest<Empty.AsObject>('updateGroup', request);
  }

  async updateRolePermission(params: UpdateRolePermissionRequest.AsObject) {
    const request = new UpdateRolePermissionRequest();
    const permissionList = params.permissionsList.map((item) => {
      const permission = new UpdateRolePermissionRequest.Permission();
      permission.setResourceId(item.resourceId);
      permission.setActionIdsList(item.actionIdsList);
      return permission;
    });
    request.setPermissionsList(permissionList);
    request.setGroupId(params.groupId);
    request.setRoleId(params.roleId);
    return await this.gRPCClientRequest<Empty.AsObject>('updateRolePermission', request);
  }
}

export const gRPCMyRoleClient = new gRPCClient();
