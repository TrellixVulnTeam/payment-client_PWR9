import {
  CreateSystemEWalletReply,
  CreateSystemEWalletRequest,
  EWalletStatus,
  ImportSystemEWalletsRequest,
  ListSystemEWalletsReply,
  SystemEWallet,
  UpdateSystemEWalletStatusReply,
  ValidateSystemEWalletsReply,
} from '@mcuc/stark/tony_pb';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { StatusEnum } from 'redux/constant';

import { GRPCClientResponse } from 'services/grpc/abstract/gRPCClient';
import {
  createSystemEWalletThunk,
  importSystemEWalletsThunk,
  listSystemEWalletsThunk,
  updateSystemEWalletStatusThunk,
  validateSystemEWalletsThunk,
} from './thunks';

export interface PaymentsState {
  status: StatusEnum;
  ewallets: SystemEWallet.AsObject[];
  totalRecord: number;
  // for toggle status
  selectedEWalletInfo?: SystemEWallet.AsObject;
  // for add account
  creatingStatus: StatusEnum;
  errorWhileCreating: any;
  // for verify import account
  verifyStatus: StatusEnum;
  errorWhileVerify: any;
  listEWalletInfosInvalid: CreateSystemEWalletRequest.AsObject[];
  listEWalletInfosOverwrite: CreateSystemEWalletRequest.AsObject[];
  listEWalletInfosReady: CreateSystemEWalletRequest.AsObject[];
  listEWalletInfosDuplicated: CreateSystemEWalletRequest.AsObject[];
  // for import
  importStatus: StatusEnum;
  errorWhileImport: any;
}
const adapter = createEntityAdapter();

const initialState = adapter.getInitialState<PaymentsState>({
  status: StatusEnum.IDLE,
  ewallets: [],
  totalRecord: 0,
  // for toggle status
  selectedEWalletInfo: null,
  creatingStatus: StatusEnum.IDLE,
  errorWhileCreating: null,
  // for verify import account
  verifyStatus: StatusEnum.IDLE,
  errorWhileVerify: null,
  listEWalletInfosInvalid: [],
  listEWalletInfosOverwrite: [],
  listEWalletInfosReady: [],
  listEWalletInfosDuplicated: [],
  // for import
  importStatus: StatusEnum.IDLE,
  errorWhileImport: null,
});

const slice = createSlice({
  name: 'walletEWallet',
  initialState,
  reducers: {
    setSelectedEWalletInfo: (state, action) => {
      return {
        ...state,
        selectedEWalletInfo: action?.payload?.data,
      };
    },
    resetImportAccount: (state) => {
      return {
        ...state,
        verifyStatus: StatusEnum.IDLE,
        errorWhileVerify: null,
        listEWalletInfosReady: [],
        listEWalletInfosDuplicated: [],
      };
    },
  },
  extraReducers: {
    // fetch ewallets infos
    [listSystemEWalletsThunk.pending.type]: (state, action) => {
      return {
        ...state,
        status: StatusEnum.LOADING,
      };
    },
    // fetch ewallets success
    [listSystemEWalletsThunk.fulfilled.type]: (state, action) => {
      const { error, response }: GRPCClientResponse<ListSystemEWalletsReply.AsObject> = action.payload;
      if (!!error) {
        return {
          ...state,
          status: StatusEnum.LOADING,
          totalPage: 1,
        };
      }
      return {
        ...state,
        status: StatusEnum.SUCCEEDED,
        ewallets: response?.recordsList || [],
        totalRecord: response?.total || 0,
      };
    },
    // toggle status
    [updateSystemEWalletStatusThunk.pending.type]: (state, action) => {
      const id = action?.meta?.arg?.id;
      const index = state?.ewallets?.findIndex((x) => x.id === id);
      return {
        ...state,
        status: StatusEnum.LOADING,
        ewallets: [
          ...state.ewallets.slice(0, index),
          {
            ...state.ewallets[index],
            status:
              state.ewallets[index].status === EWalletStatus.EWALLET_ACTIVE
                ? EWalletStatus.EWALLET_IN_ACTIVE
                : EWalletStatus.EWALLET_ACTIVE,
          },
          ...state.ewallets.slice(index + 1),
        ],
      };
    },
    [updateSystemEWalletStatusThunk.fulfilled.type]: (state, action) => {
      const { error }: GRPCClientResponse<UpdateSystemEWalletStatusReply.AsObject> = action.payload;
      if (!!error) {
        const id = action?.meta?.arg?.id;
        const index = state?.ewallets?.findIndex((x) => x.id === id);
        return {
          ...state,
          status: StatusEnum.FAILED,
          // revert if error
          ewallets: [
            ...state.ewallets.slice(0, index),
            {
              ...state.ewallets[index],
              status:
                state.ewallets[index].status === EWalletStatus.EWALLET_ACTIVE
                  ? EWalletStatus.EWALLET_IN_ACTIVE
                  : EWalletStatus.EWALLET_ACTIVE,
            },
            ...state.ewallets.slice(index + 1),
          ],
        };
      }
      return {
        ...state,
        status: StatusEnum.SUCCEEDED,
      };
    },
    // add new account
    [createSystemEWalletThunk.pending.type]: (state, action) => {
      return {
        ...state,
        creatingStatus: StatusEnum.LOADING,
        errorWhileCreating: null,
      };
    },
    [createSystemEWalletThunk.fulfilled.type]: (state, action) => {
      const { error }: GRPCClientResponse<CreateSystemEWalletReply.AsObject> = action.payload;
      if (!!error) {
        return {
          ...state,
          creatingStatus: StatusEnum.FAILED,
          errorWhileCreating: error,
        };
      }
      return {
        ...state,
        creatingStatus: StatusEnum.SUCCEEDED,
        errorWhileCreating: null,
      };
    },
    // verify import data
    [validateSystemEWalletsThunk.pending.type]: (state) => {
      return {
        ...state,
        verifyStatus: StatusEnum.LOADING,
        errorWhileVerify: null,
      };
    },
    [validateSystemEWalletsThunk.fulfilled.type]: (state, action) => {
      const { error, response }: GRPCClientResponse<ValidateSystemEWalletsReply.AsObject> = action.payload;
      console.log({ response })
      if (!!error) {
        return {
          ...state,
          verifyStatus: StatusEnum.FAILED,
          errorWhileVerify: error,
        };
      }
      return {
        ...state,
        verifyStatus: StatusEnum.SUCCEEDED,
        errorWhileVerify: null,
        listEWalletInfosReady: response?.validRecordsList || [],
        listEWalletInfosDuplicated: response?.duplicatedRecordsList || [],
        listEWalletInfosInvalid: response?.invalidRecordsList || [],
        listEWalletInfosOverwrite: response?.duplicatedIdRecordsList || [],
      };
    },
    // import
    [importSystemEWalletsThunk.pending.type]: (state) => {
      return {
        ...state,
        importStatus: StatusEnum.LOADING,
        errorWhileImport: null,
      };
    },
    [importSystemEWalletsThunk.fulfilled.type]: (state, action) => {
      const { error }: GRPCClientResponse<ImportSystemEWalletsRequest.AsObject> = action.payload;
      if (!!error) {
        return {
          ...state,
          importStatus: StatusEnum.FAILED,
          errorWhileImport: error,
        };
      }
      return {
        ...state,
        importStatus: StatusEnum.SUCCEEDED,
        errorWhileImport: null,
      };
    },
  },
});

const { reducer } = slice;
export default reducer;

export const selectWalletsSlice = (state: any) => state.walletEWallets;
export const selectEWalletInfos = (state: any) => state.walletEWallets?.ewallets;
export const selectTotalPage = (state: any) => state.walletEWallets?.totalPage;
export const selectTotalRecord = (state: any) => state.walletEWallets?.totalRecord;
export const selectSelectedWalletInfo = (state: any) => state.walletEWallets?.selectedEWalletInfo;
export const isAlreadyUsedForMerchant = (state: any) => state.walletEWallets?.errorWhileCreating?.code === 2;

export const selectListEWalletsReady = (state: any) => state.walletEWallets?.listEWalletInfosReady;
export const selectListEWalletsDuplicated = (state: any) => state.walletEWallets?.listEWalletInfosDuplicated;
export const selectListEWalletsInvalid = (state: any) => state.walletEWallets?.listEWalletInfosInvalid;
export const selectListEWalletsOverwrite = (state: any) => state.walletEWallets?.listEWalletInfosOverwrite;

export const isFetchingList = (state: any) => state.walletEWallets?.status === StatusEnum.LOADING;
export const isCreating = (state: any) => state.walletEWallets?.creatingStatus === StatusEnum.LOADING;
export const isVerifying = (state: any) => state.walletEWallets?.verifyStatus === StatusEnum.LOADING;
export const isImporting = (state: any) => state.walletEWallets?.importStatus === StatusEnum.LOADING;

export const selectErrorWhileImport = (state: any) => state.walletEWallets?.errorWhileImport?.message;

export const { setSelectedEWalletInfo, resetImportAccount } = slice.actions;
