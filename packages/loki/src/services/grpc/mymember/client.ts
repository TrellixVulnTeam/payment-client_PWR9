import { MyMemberClient } from '@greyhole/myrole/MyroleServiceClientPb';
import {
  GetPermissionsReply,
  GetPermissionsRequest,
  UpdateRolesReply,
  UpdateRolesRequest,
} from '@greyhole/myrole/myrole_pb';

import gRPCClientAbstract from '../abstract/gRPCClient';

class gRPCClient extends gRPCClientAbstract {
  constructor() {
    super(MyMemberClient, 'MyMemberClient');
  }

  async getPermissions(params: GetPermissionsRequest.AsObject) {
    const request = new GetPermissionsRequest();
    request.setUserId(params.userId);
    return await this.gRPCClientRequest<GetPermissionsReply.AsObject>('getPermissions', request);
  }

  async updateRoles(params: UpdateRolesRequest.AsObject) {
    const request = new UpdateRolesRequest();
    request.setUserId(params.userId);
    const groupRolesList = params.groupRolesList.map((item) => {
      const groupRole = new UpdateRolesRequest.GroupRole();
      groupRole.setGroupId(item.groupId);
      groupRole.setRoleIdsList(item.roleIdsList);
      return groupRole;
    });
    request.setGroupRolesList(groupRolesList);
    return await this.gRPCClientRequest<UpdateRolesReply.AsObject>('updateRoles', request);
  }
}

export const gRPCMyIdClient = new gRPCClient();
