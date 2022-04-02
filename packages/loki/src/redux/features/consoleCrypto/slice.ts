import { createSlice, createSelector } from '@reduxjs/toolkit';
import { Error } from 'grpc-web';
import { stateError, stateSucceeded, StatusEnum } from 'redux/constant';
import { RootState } from 'redux/reducers';
import { getCryptoSettingsThunk, updateAutoTransferCryptoWithdrawThunk } from './thunks';

type InitialState = {
  status: StatusEnum;
  error: Error;
  autoTransferWithdrawCrypto: boolean;
};

const initialState: InitialState = {
  status: StatusEnum.IDLE,
  error: null,
  autoTransferWithdrawCrypto: false,
};

const slice = createSlice({
  name: 'consoleCrypto',
  initialState,
  reducers: {
    toggleAuto: (state, action) => {
      const { autoName } = action.payload;
      state[autoName] = !state[autoName];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getCryptoSettingsThunk.pending, (state) => {
        state.status = StatusEnum.LOADING;
        state.error = null;
      })
      .addCase(getCryptoSettingsThunk.fulfilled, (state, action) => {
        const { response, error } = action.payload;
        if (error) return stateError(state, error);
        state.autoTransferWithdrawCrypto = response.autoTransferWithdrawCrypto;
        stateSucceeded(state);
      })
      .addCase(updateAutoTransferCryptoWithdrawThunk.fulfilled, (state, action) => {
        const { error } = action.payload;
        if (error) return stateError(state, error);
        state.autoTransferWithdrawCrypto = !state.autoTransferWithdrawCrypto;
        stateSucceeded(state);
      });
  },
});

const { reducer } = slice;

export const { toggleAuto } = slice.actions;

export default reducer;

export const selectConsoleState = (state: RootState) => state.consoleCrypto;

export const selectConsoleStatusCrypto = createSelector(selectConsoleState, (state) => state.status);
export const selectAutoTransferWithdrawCrypto = createSelector(
  selectConsoleState,
  (state) => state.autoTransferWithdrawCrypto,
);
