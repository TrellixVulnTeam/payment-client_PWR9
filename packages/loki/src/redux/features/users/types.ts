import { User, UserInfo } from '@greyhole/myid/myid_pb';
import { StatusEnum } from 'redux/constant';

export interface UsersState {
  error: any;
  status: StatusEnum;
  page: number;
  size: number;
  statusCreated: StatusEnum;
  errorCreated: any;
  displayIds: number[];
  ids: string[];
  entities: Record<string, User.AsObject>;
  pagination: {
    totalPage: number;
    totalRecord: number;
  };
}

export type UserListThunk = {
  page: number;
  size: number;
};

export type UserMetadata = {
  metadata: { fullName: string; picture: string };
};

type CustomInfo = {
  displayName: string;
};

export type UserCustom = Omit<User.AsObject, 'metadata'> & CustomInfo & UserMetadata;

export type UserInfoCustom = Omit<UserInfo.AsObject, 'metadata'> & CustomInfo & UserMetadata;
