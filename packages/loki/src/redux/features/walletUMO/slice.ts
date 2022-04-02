import { createSlice, createEntityAdapter, PayloadAction, createSelector } from '@reduxjs/toolkit';
import { StatusEnum } from 'redux/constant';
import { RootState } from 'redux/reducers';
import {
  getCryptoWalletThunk,
  importCryptoWalletsThunk,
  validateCryptoWalletsThunk,
} from 'redux/features/walletUMO/thunks';
import { GRPCClientResponse } from 'services/grpc/abstract/gRPCClient';
import {
  CryptoWallet,
  ImportCryptoWalletsReply,
  ListCryptoWalletsReply,
  ValidateCryptoWalletsReply,
} from '@mcuc/stark/ultron_pb';

type InitialState = {
  entities: Record<string, CryptoWallet.AsObject>;
  ids: string[];
  listWalletReadyImport: CryptoWallet.AsObject[];
  listWalletDuplicatedImport: CryptoWallet.AsObject[];
  statusListing: StatusEnum;
  statusImport: StatusEnum;
  totalRecord: number;
};

const adapter = createEntityAdapter<CryptoWallet.AsObject>();

const initialState = adapter.getInitialState<InitialState>({
  entities: {},
  ids: [],
  listWalletReadyImport: [],
  listWalletDuplicatedImport: [],
  statusListing: StatusEnum.IDLE,
  statusImport: StatusEnum.IDLE,
  totalRecord: 0,
});

const slice = createSlice({
  name: 'walletUMO',
  initialState,
  reducers: {
    resetImportWallet: (state) => {
      state.statusImport = StatusEnum.IDLE;
      state.listWalletReadyImport = [];
      state.listWalletDuplicatedImport = [];
    },
  },
  extraReducers: {
    // * getCryptoWalletThunk
    [getCryptoWalletThunk.pending.type]: (state) => {
      state.statusListing = StatusEnum.LOADING;
    },
    [getCryptoWalletThunk.fulfilled.type]: (
      state,
      action: PayloadAction<GRPCClientResponse<ListCryptoWalletsReply.AsObject>>,
    ) => {
      const { response, error } = action.payload;
      if (error) return;
      adapter.setAll(state, response.recordsList);
      state.totalRecord = response.total;
      state.statusListing = StatusEnum.IDLE;
    },
    // * verifyCryptoWalletsToCreateThunk
    [validateCryptoWalletsThunk.pending.type]: (state) => {
      state.statusImport = StatusEnum.LOADING;
    },
    [validateCryptoWalletsThunk.fulfilled.type]: (
      state,
      action: PayloadAction<GRPCClientResponse<ValidateCryptoWalletsReply.AsObject>>,
    ) => {
      const { response, error } = action.payload;
      if (error) return;
      state.statusImport = StatusEnum.IDLE;
      state.listWalletReadyImport = response.validRecordsList;
      state.listWalletDuplicatedImport = response.duplicatedRecordsList;
    },
    // * importCryptoWalletsThunk
    [importCryptoWalletsThunk.pending.type]: (state) => {
      state.statusImport = StatusEnum.LOADING;
    },
    [importCryptoWalletsThunk.pending.type]: (
      state,
      action: PayloadAction<GRPCClientResponse<ImportCryptoWalletsReply.AsObject>>,
    ) => {},
  },
});

const { reducer } = slice;

export default reducer;

export const selectWalletUMOState = (state: RootState) => state.walletUMO;

export const {
  selectAll: selectCryptoWalletAll,
  selectById: selectCryptoWalletById,
  selectIds: selectCryptoWalletIds,
  selectEntities: selectCryptoWalletEntities,
} = adapter.getSelectors(selectWalletUMOState);

export const selectWalletUMOTotalRecord = createSelector(selectWalletUMOState, (state) => state.totalRecord);

export const selectWalletUMOStatusImport = createSelector(selectWalletUMOState, (state) => state.statusImport);

export const selectWalletUMOStatusListing = createSelector(selectWalletUMOState, (state) => state.statusListing);

export const selectWalletUMOTotal = createSelector(selectWalletUMOState, (state) => state.statusListing);

export const selectListWalletReadyImport = createSelector(selectWalletUMOState, (state) => state.listWalletReadyImport);

export const selectListWalletDuplicatedImport = createSelector(
  selectWalletUMOState,
  (state) => state.listWalletDuplicatedImport,
);
