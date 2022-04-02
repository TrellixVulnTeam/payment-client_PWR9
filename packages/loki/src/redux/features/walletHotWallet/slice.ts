import { createSlice, createEntityAdapter, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { StatusEnum } from 'redux/constant';
import { RootState } from 'redux/reducers';
import { GRPCClientResponse } from 'services/grpc/abstract/gRPCClient';
import {
  SystemCryptoHotWallet,
  ImportCryptoHotWalletsReply,
  ListCryptoHotWalletsReply,
  ValidateCryptoHotWalletsReply,
} from '@mcuc/stark/ultron_pb';
import { importCryptoHotWalletsThunk, listCryptoHotWalletsThunk, validateCryptoHotWalletsThunk } from './thunks';
import { Error } from 'grpc-web';

type InitialState = {
  entities: Record<string, SystemCryptoHotWallet.AsObject>;
  ids: string[];
  listEWalletInfosInvalid: SystemCryptoHotWallet.AsObject[];
  listEWalletInfosOverwrite: SystemCryptoHotWallet.AsObject[];
  listWalletReadyImport: SystemCryptoHotWallet.AsObject[];
  listWalletDuplicatedImport: SystemCryptoHotWallet.AsObject[];
  statusListing: StatusEnum;
  statusImport: StatusEnum;
  totalRecord: number;
  error: Error | null;
};

const adapter = createEntityAdapter<SystemCryptoHotWallet.AsObject>();

const initialState = adapter.getInitialState<InitialState>({
  entities: {},
  ids: [],
  listEWalletInfosInvalid: [],
  listEWalletInfosOverwrite: [],
  listWalletReadyImport: [],
  listWalletDuplicatedImport: [],
  statusListing: StatusEnum.IDLE,
  statusImport: StatusEnum.IDLE,
  totalRecord: 0,
  error: null,
});

const slice = createSlice({
  name: 'cryptoHotWallet',
  initialState,
  reducers: {
    resetImportWallet: (state) => {
      state.statusImport = StatusEnum.IDLE;
      state.listWalletReadyImport = [];
      state.listWalletDuplicatedImport = [];
    },
  },
  extraReducers: {
    // * listCryptoHotWalletsThunk
    [listCryptoHotWalletsThunk.pending.type]: (state) => {
      state.statusListing = StatusEnum.LOADING;
      state.error = null;
    },
    [listCryptoHotWalletsThunk.fulfilled.type]: (
      state,
      action: PayloadAction<GRPCClientResponse<ListCryptoHotWalletsReply.AsObject>>,
    ) => {
      const { response, error } = action.payload;
      if (error) {
        state.error = error;
        return;
      }
      adapter.setAll(state, response.recordsList);
      state.totalRecord = response.total;
      state.statusListing = StatusEnum.IDLE;
    },
    // * validateCryptoHotWalletsThunk
    [validateCryptoHotWalletsThunk.pending.type]: (state) => {
      state.statusImport = StatusEnum.LOADING;
    },
    [validateCryptoHotWalletsThunk.fulfilled.type]: (
      state,
      action: PayloadAction<GRPCClientResponse<ValidateCryptoHotWalletsReply.AsObject>>,
    ) => {
      const { response, error } = action.payload;
      if (error) return;
      state.statusImport = StatusEnum.IDLE;
      state.listWalletReadyImport = response.validRecordsList;
      state.listWalletDuplicatedImport = response.duplicatedRecordsList;
      state.listEWalletInfosInvalid = response.invalidRecordsList;
      state.listEWalletInfosOverwrite = response.duplicatedIdRecordsList;
    },
    // * importCryptoHotWalletsThunk
    [importCryptoHotWalletsThunk.pending.type]: (state) => {
      state.statusImport = StatusEnum.LOADING;
    },
    [importCryptoHotWalletsThunk.pending.type]: (
      state,
      action: PayloadAction<GRPCClientResponse<ImportCryptoHotWalletsReply.AsObject>>,
    ) => {},
  },
});

const { reducer } = slice;

export default reducer;

export const selectCryptoHotWallet = (state: RootState) => state.cryptoHotWallet;

export const {
  selectAll: selectCryptoHotWalletAll,
  selectById: selectCryptoHotWalletById,
  selectIds: selectCryptoHotWalletIds,
  selectEntities: selectCryptoHotWalletEntities,
} = adapter.getSelectors(selectCryptoHotWallet);

export const selectCryptoHotWalletTotalRecord = createSelector(selectCryptoHotWallet, (state) => state.totalRecord);
export const selectCryptoHotWalletStatusImport = createSelector(selectCryptoHotWallet, (state) => state.statusImport);
export const selectCryptoHotWalletErrorImport = createSelector(selectCryptoHotWallet, (state) => state.error);
export const selectCryptoHotWalletStatusListing = createSelector(selectCryptoHotWallet, (state) => state.statusListing);
export const selectListHotWalletReadyImport = createSelector(
  selectCryptoHotWallet,
  (state) => state.listWalletReadyImport,
);
export const selectListHotWalletDuplicatedImport = createSelector(
  selectCryptoHotWallet,
  (state) => state.listWalletDuplicatedImport,
);
export const selectListHotWalletOverwriteImport = createSelector(
  selectCryptoHotWallet,
  (state) => state.listEWalletInfosOverwrite,
);
export const selectListHotWalletInvalidImport = createSelector(
  selectCryptoHotWallet,
  (state) => state.listEWalletInfosInvalid,
);
