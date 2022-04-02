import { createSlice, createSelector } from '@reduxjs/toolkit';
import { RootState } from 'redux/reducers';
import { parseJson } from 'utils/common';
import { UserInfoCustom, UserMetadata } from '../users/types';
import { getUsersThunk } from './thunks';

type CommonState = {
  usersMap: Record<number, UserInfoCustom>;
};
const initialState: CommonState = {
  usersMap: {},
};

const slice = createSlice({
  name: 'common',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUsersThunk.fulfilled, (state, action) => {
      const { meta } = action;
      const { response } = action.payload;

      if (response) {
        // * Fill data for check exist of userId
        meta.arg.userIdsList.forEach((userId) => {
          state.usersMap[userId] = {} as any;
        });

        response.usersList.forEach((user) => {
          const metadata: UserMetadata['metadata'] = parseJson(user.metadata);
          state.usersMap[user.userId] = {
            ...user,
            metadata,
            displayName: metadata.fullName || user.username,
          };
        });
      }
    });
  },
});

const { reducer } = slice;

export default reducer;

export const selectCommonState = (state: RootState) => state.common;

export const selectUsersMap = createSelector(selectCommonState, (state) => state.usersMap);
