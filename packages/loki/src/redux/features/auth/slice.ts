import { StatusCode as grpcStatusCode } from 'grpc-web';
import { ConfirmSignInReply, MeReply, OTP, Permission, SignInReply, TokenInfo } from '@greyhole/myid/myid_pb';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { t } from 'i18next';
import { stateError, stateLoading, stateSucceeded, StatusEnum } from 'redux/constant';
import { RootState } from 'redux/reducers';
import { GRPCClientResponse, KEY_ACCESS_TOKEN } from 'services/grpc/abstract/gRPCClient';
import { parseJson } from 'utils/common';
import { getErrorMessageFromCode } from 'utils/constant/message';
import { signInThunk, getMeThunk, confirmSignInThunk, getAuthThunk, updateMetadataThunk } from './thunks';
import { combineResourceWithActionList } from 'components/AllowedTo/utils';
import { UserInfoCustom, UserMetadata } from '../users/types';

export interface AuthState {
  status: StatusEnum;
  statusAuth: StatusEnum;
  error: string | null;
  errorAuth: string | null;
  accessToken: string | null;
  tokenInfo: TokenInfo.AsObject | null;
  confirmOtp: OTP.AsObject | null;
  userInfo: UserInfoCustom | null;
  userPermissions: string[];
  moduleIdsList: number[];
  permissionList: Permission.AsObject[];
}

const initialState: AuthState = {
  confirmOtp: null,
  tokenInfo: null,
  accessToken: null,
  ...{
    status: StatusEnum.IDLE,
    error: null,
    userInfo: null,
  },
  ...{
    statusAuth: StatusEnum.IDLE,
    errorAuth: null,
    userPermissions: [],
    moduleIdsList: [],
    permissionList: [],
  },
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: () => {
      localStorage.removeItem(KEY_ACCESS_TOKEN);
      return { ...initialState };
    },
  },
  extraReducers: {
    // Sign In
    [signInThunk.pending.type]: stateLoading,
    [signInThunk.fulfilled.type]: (state, action: PayloadAction<GRPCClientResponse<SignInReply.AsObject>>) => {
      const { response, error } = action.payload;
      if (response) {
        state.confirmOtp = response.confirmOtp;
        return stateSucceeded(state);
      }

      // ! ERROR
      // * 30203: Username or password wrong
      if (error.code !== 30203) {
        return stateError(state, error);
      }

      const messageParsed: { attempts: number; max_attempts: number } = parseJson(error.message);
      if (messageParsed.max_attempts > 0) {
        state.error = t(
          `Your password is not correct. You have {{number}} more attempts and your account will be locked for security. Please try again carefully.`,
          { number: messageParsed.max_attempts - messageParsed.attempts },
        );
      } else {
        state.error = getErrorMessageFromCode(error.code);
      }

      state.status = StatusEnum.FAILED;
    },
    // * Get me
    [getMeThunk.pending.type]: stateLoading,
    [getMeThunk.fulfilled.type]: (state, action: PayloadAction<GRPCClientResponse<MeReply.AsObject>>) => {
      const { response, error } = action.payload;
      if (error) {
        if (error.code === grpcStatusCode.UNAUTHENTICATED) {
          localStorage.removeItem(KEY_ACCESS_TOKEN);
        }
        return stateError(state, error);
      }
      const metadata: UserMetadata['metadata'] = parseJson(response.user.metadata);
      state.userInfo = {
        ...response.user,
        metadata,
        displayName: metadata.fullName || response.user.username,
      };
      state.moduleIdsList = response.moduleIdsList;
      state.permissionList = response.permissionsList;
      state.userPermissions = combineResourceWithActionList(response.permissionsList);

      stateSucceeded(state);
    },
    // * Confirm Sign in
    [confirmSignInThunk.pending.type]: (state) => {
      localStorage.removeItem(KEY_ACCESS_TOKEN);
      state.statusAuth = StatusEnum.LOADING;
    },
    [confirmSignInThunk.fulfilled.type]: (
      state,
      action: PayloadAction<GRPCClientResponse<ConfirmSignInReply.AsObject>>,
    ) => {
      const { response, error } = action.payload;
      if (error) return stateError(state, error);

      // ! SET TOKEN
      localStorage.setItem(KEY_ACCESS_TOKEN, response.tokenInfo.accessToken);

      state.tokenInfo = response.tokenInfo;
      state.statusAuth = StatusEnum.SUCCEEDED;
    },
    // * Get Auth
    [getAuthThunk.pending.type]: (state) => {
      state.statusAuth = StatusEnum.LOADING;
    },
    [getAuthThunk.rejected.type]: (state, action: PayloadAction<GRPCClientResponse<MeReply.AsObject>>) => {
      const { error } = action.payload;
      if (error) {
        state.statusAuth = StatusEnum.FAILED;
        state.errorAuth = getErrorMessageFromCode(error.code);
      }
    },
    [getAuthThunk.fulfilled.type]: (state, action: PayloadAction<GRPCClientResponse<MeReply.AsObject>>) => {
      const { response } = action.payload;
      if (response) {
        const metadata = parseJson(response.user.metadata);
        state.userInfo = {
          ...response.user,
          metadata,
          displayName: metadata.fullName || response.user.username,
        };
        state.moduleIdsList = response.moduleIdsList;
        state.permissionList = response.permissionsList;
        state.userPermissions = combineResourceWithActionList(response.permissionsList);

        state.statusAuth = StatusEnum.SUCCEEDED;
      } else {
        localStorage.removeItem(KEY_ACCESS_TOKEN);
        state.statusAuth = StatusEnum.FAILED;
      }
    },
    // * Update Metadata
    [updateMetadataThunk.fulfilled.type]: (
      state,
      { payload, meta }: PayloadAction<GRPCClientResponse<Object>, string, { arg: { metadata: string } }>,
    ) => {
      const { response } = payload;
      if (response) {
        state.userInfo.metadata = parseJson(meta.arg.metadata);
      }
    },
  },
});

const { reducer } = slice;

export const { logout } = slice.actions;

export default reducer;

export const selectAuthState = (state: RootState) => state.auth;

export const selectAuthError = createSelector(selectAuthState, (state) => state.error);

export const selectAuthStatus = createSelector(selectAuthState, (state) => state.statusAuth);

export const selectUserStatus = createSelector(selectAuthState, (state) => state.status);

export const selectUserInfo = createSelector(selectAuthState, (state) => state.userInfo);

export const selectTokenInfo = createSelector(selectAuthState, (state) => state.tokenInfo);

export const selectConfirmOtp = createSelector(selectAuthState, (state) => state.confirmOtp);

export const selectAccessToken = createSelector(selectAuthState, (state) => state.accessToken);

export const selectUserModuleIdsList = createSelector(selectAuthState, (state) => state.moduleIdsList);

export const selectUserPermissionList = createSelector(selectAuthState, (state) => state.permissionList);

export const selectUserPermission = createSelector(selectAuthState, (state) => state.userPermissions);
