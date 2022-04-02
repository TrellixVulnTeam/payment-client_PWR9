import { TheCoffeeHouseClient } from '@greyhole/myid/MyidServiceClientPb';
import {
  CreateUserReply,
  CreateUserRequest,
  GetUserRequest,
  ListUsersReply,
  ListUsersRequest,
  UserChange,
  GetUserReply,
  LockUserReply,
  LockUserRequest,
  Role,
  Roles,
  UnlockUserReply,
  UnlockUserRequest,
  UpdateUserReply,
  UpdateUserRequest,
  ResendCreatePasswordOTPRequest,
  GetUsersRequest,
  GetUsersReply,
  ResendCreatePasswordOTPReply,
  PhoneNumber,
} from '@greyhole/myid/myid_pb';

import gRPCClientAbstract from '../abstract/gRPCClient';

class gRPCClient extends gRPCClientAbstract {
  constructor() {
    super(TheCoffeeHouseClient, 'TheCoffeeHouseClient');
  }

  async listUsers(p: ListUsersRequest.AsObject) {
    const request = new ListUsersRequest();

    request.setCursor(p.cursor);
    request.setLimit(p.limit);
    request.setGroupIdsList(p.groupIdsList);
    request.setRoleIdsList(p.roleIdsList);
    request.setQuery(p.query);
    request.setStatusesList(p.statusesList);

    return await this.gRPCClientRequest<ListUsersReply.AsObject>('listUsers', request);
  }

  async createUser(p: CreateUserRequest.AsObject) {
    const request = new CreateUserRequest();

    const rolesList = p.rolesList.map(({ roleId, groupId }) => {
      const role = new Role();
      role.setRoleId(roleId);
      role.setGroupId(groupId);
      return role;
    });

    if (p.phoneNumber) {
      const phoneNumber = new PhoneNumber();
      phoneNumber.setCountryCode(p.phoneNumber.countryCode);
      phoneNumber.setNationalNumber(p.phoneNumber.nationalNumber);
      request.setPhoneNumber(phoneNumber);
    }

    request.setEmail(p.email);
    request.setMetadata(p.metadata);
    request.setUsername(p.username);
    request.setRolesList(rolesList);

    return await this.gRPCClientRequest<CreateUserReply.AsObject>('createUser', request);
  }

  async getUser(params: GetUserRequest.AsObject) {
    const request = new GetUserRequest();

    request.setId(params.id);

    return await this.gRPCClientRequest<GetUserReply.AsObject>('getUser', request);
  }

  async getUsers(params: GetUsersRequest.AsObject) {
    const request = new GetUsersRequest();
    request.setUserIdsList(params.userIdsList);
    return await this.gRPCClientRequest<GetUsersReply.AsObject>('getUsers', request);
  }

  async updateUser(p: UpdateUserRequest.AsObject) {
    const req = new UpdateUserRequest();
    const change = p.changesList[0];
    const changesList = [];
    if (change.roles?.rolesList) {
      const userChange = new UserChange();
      const rs = new Roles();
      const listOfRoles = change.roles?.rolesList.map(({ groupId, roleId }) => {
        const r = new Role();
        groupId && r.setGroupId(groupId);
        roleId && r.setRoleId(roleId);
        return r;
      });
      rs.setRolesList(listOfRoles);
      userChange.setRoles(rs);
      changesList.push(userChange);
    }
    if (change.email) {
      const userChange = new UserChange();
      userChange.setEmail(change.email);
      changesList.push(userChange);
    }
    if (change.phoneNumber) {
      const userChange = new UserChange();
      const phoneNumber = new PhoneNumber();

      phoneNumber.setCountryCode(change.phoneNumber.countryCode);
      phoneNumber.setNationalNumber(change.phoneNumber.nationalNumber);

      userChange.setPhoneNumber(phoneNumber);
      changesList.push(userChange);
    }
    if (change.metadata) {
      const userChange = new UserChange();
      userChange.setMetadata(change.metadata);
      changesList.push(userChange);
    }
    req.setChangesList(changesList);
    req.setId(p.id);
    return await this.gRPCClientRequest<UpdateUserReply.AsObject>('updateUser', req);
  }

  async lockUser(params: LockUserRequest.AsObject) {
    const request = new LockUserRequest();
    request.setId(params.id);

    return await this.gRPCClientRequest<LockUserReply.AsObject>('lockUser', request);
  }

  async unlockUser(params: UnlockUserRequest.AsObject) {
    const request = new UnlockUserRequest();
    request.setId(params.id);

    return await this.gRPCClientRequest<UnlockUserReply.AsObject>('unlockUser', request);
  }

  async resendCreatePasswordOTP(params: ResendCreatePasswordOTPRequest.AsObject) {
    const request = new ResendCreatePasswordOTPRequest();
    request.setUserId(params.userId);
    return await this.gRPCClientRequest<ResendCreatePasswordOTPReply.AsObject>('resendCreatePasswordOTP', request);
  }
}

export const gRPCUsersClient = new gRPCClient();
