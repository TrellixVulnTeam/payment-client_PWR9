import { useAppSelector } from 'redux/store';
import {
  selectAuthStatus,
  selectUserModuleIdsList,
  selectUserPermission,
  selectUserPermissionList,
} from 'redux/features/auth/slice';
import { StatusEnum } from 'redux/constant';
import { KEY_ACCESS_TOKEN } from 'services/grpc/abstract/gRPCClient';

export default function useAuth() {
  const accessToken = localStorage.getItem(KEY_ACCESS_TOKEN);

  const authStatus = useAppSelector(selectAuthStatus);
  const moduleIdsList = useAppSelector(selectUserModuleIdsList);
  const permissionList = useAppSelector(selectUserPermissionList);
  const userPermissions = useAppSelector(selectUserPermission);

  const isFetchingAuth = Boolean(authStatus === StatusEnum.IDLE && accessToken);
  const isAuthenticating = Boolean([StatusEnum.LOADING, StatusEnum.IDLE].includes(authStatus) && accessToken);
  const isAuthenticated = Boolean(authStatus === StatusEnum.SUCCEEDED && accessToken);

  return {
    moduleIdsList,
    permissionList,
    userPermissions,
    isFetchingAuth,
    isAuthenticating,
    isAuthenticated,
  };
}
