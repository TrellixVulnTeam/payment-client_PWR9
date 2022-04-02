import {
  SystemBank,
  CreateSystemBankAccountReply,
  CreateSystemBankAccountRequest,
  ImportSystemBankAccountReply,
  ListSystemBankAccountsReply,
  UpdateSystemBankAccountStatusReply,
  ValidateImportSystemBankAccountReply,
} from '@mcuc/stark/pepper_pb';
import { createEntityAdapter, createSlice } from '@reduxjs/toolkit';
import { StatusEnum } from 'redux/constant';

import { GRPCClientResponse } from 'services/grpc/abstract/gRPCClient';
import {
  createSystemBankAccountThunk,
  importSystemBankAccountThunk,
  listSystemBankAccountsThunk,
  updateSystemBankAccountStatusThunk,
  validateImportSystemBankAccountThunk,
} from './thunks';

export interface PaymentsState {
  status: StatusEnum;
  banks: SystemBank.AsObject[];
  totalRecord: number;
  // for toggle status
  selectedBankInfo?: SystemBank.AsObject;
  // for add account
  creatingStatus: StatusEnum;
  errorWhileCreating: any;
  // for verify import account
  verifyStatus: StatusEnum;
  errorWhileVerify: any;
  listBankInfosInvalid: CreateSystemBankAccountRequest.AsObject[];
  listBankInfosReady: CreateSystemBankAccountRequest.AsObject[];
  listBankInfosDuplicated: CreateSystemBankAccountRequest.AsObject[];
  listBankInfosOverwrite: CreateSystemBankAccountRequest.AsObject[];
  // for import
  importStatus: StatusEnum;
  errorWhileImport: any;
}
const adapter = createEntityAdapter();

const initialState = adapter.getInitialState<PaymentsState>({
  status: StatusEnum.IDLE,
  banks: [],
  totalRecord: 0,
  // for toggle status
  creatingStatus: StatusEnum.IDLE,
  errorWhileCreating: null,
  // for verify import account
  verifyStatus: StatusEnum.IDLE,
  errorWhileVerify: null,
  listBankInfosInvalid: [],
  listBankInfosReady: [],
  listBankInfosDuplicated: [],
  listBankInfosOverwrite: [],
  // for import
  importStatus: StatusEnum.IDLE,
  errorWhileImport: null,
});

const slice = createSlice({
  name: 'walletBank',
  initialState,
  reducers: {
    setSelectedBankInfo: (state, action) => {
      return {
        ...state,
        selectedBankInfo: action?.payload?.data,
      };
    },
    resetImportAccount: (state) => {
      return {
        ...state,
        verifyStatus: StatusEnum.IDLE,
        errorWhileVerify: null,
        listBankInfosReady: [],
        listBankInfosDuplicated: [],
        listBankInfosInvalid: [],
        listBankInfosOverwrite: [],
      };
    },
  },
  extraReducers: {
    [listSystemBankAccountsThunk.pending.type]: (state, action) => {
      return {
        ...state,
        status: StatusEnum.LOADING,
      };
    },
    [listSystemBankAccountsThunk.fulfilled.type]: (state, action) => {
      const { error, response }: GRPCClientResponse<ListSystemBankAccountsReply.AsObject> = action.payload;
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
        banks: response?.recordsList || [],
        totalRecord: response?.total || 0,
      };
    },
    [updateSystemBankAccountStatusThunk.pending.type]: (state, action) => {
      const id = action?.meta?.arg?.id;
      const index = state?.banks?.findIndex((x) => x.id === id);
      return {
        ...state,
        status: StatusEnum.LOADING,
        banks: [
          ...state.banks.slice(0, index),
          {
            ...state.banks[index],
            status: (state.banks[index] as any).status === 1 ? 0 : 1,
          },
          ...state.banks.slice(index + 1),
        ],
      };
    },
    [updateSystemBankAccountStatusThunk.fulfilled.type]: (state, action) => {
      const { error }: GRPCClientResponse<UpdateSystemBankAccountStatusReply.AsObject> = action.payload;
      if (!!error) {
        const id = action?.meta?.arg?.id;
        const index = state?.banks?.findIndex((x) => x.id === id);
        return {
          ...state,
          status: StatusEnum.FAILED,
          // revert if error
          banks: [
            ...state.banks.slice(0, index),
            {
              ...state.banks[index],
              status: (state.banks[index] as any).status === 1 ? 0 : 1,
            },
            ...state.banks.slice(index + 1),
          ],
        };
      }
      return {
        ...state,
        status: StatusEnum.SUCCEEDED,
      };
    },
    // add new account
    [createSystemBankAccountThunk.pending.type]: (state, action) => {
      return {
        ...state,
        creatingStatus: StatusEnum.LOADING,
        errorWhileCreating: null,
      };
    },
    [createSystemBankAccountThunk.fulfilled.type]: (state, action) => {
      const { error }: GRPCClientResponse<CreateSystemBankAccountReply.AsObject> = action.payload;
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
    [validateImportSystemBankAccountThunk.pending.type]: (state) => {
      return {
        ...state,
        verifyStatus: StatusEnum.LOADING,
        errorWhileVerify: null,
      };
    },
    [validateImportSystemBankAccountThunk.fulfilled.type]: (state, action) => {
      const { error, response }: GRPCClientResponse<ValidateImportSystemBankAccountReply.AsObject> = action.payload;
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
        listBankInfosInvalid: response?.invalidRecordsList || [],
        listBankInfosReady: response?.validRecordsList || [],
        listBankInfosDuplicated: response?.duplicatedRecordsList || [],
        listBankInfosOverwrite: response?.duplicatedAccountIdRecordsList || [],
      };
    },
    // import
    [importSystemBankAccountThunk.pending.type]: (state) => {
      return {
        ...state,
        importStatus: StatusEnum.LOADING,
        errorWhileImport: null,
      };
    },
    [importSystemBankAccountThunk.fulfilled.type]: (state, action) => {
      const { error }: GRPCClientResponse<ImportSystemBankAccountReply.AsObject> = action.payload;
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

export const selectWalletsSlice = (state: any) => state.walletBanks;
export const selectBankInfos = (state: any) => state.walletBanks?.banks;
export const selectTotalPage = (state: any) => state.walletBanks?.totalPage;
export const selectTotalRecord = (state: any) => state.walletBanks?.totalRecord;
export const selectSelectedBankInfo = (state: any) => state.walletBanks?.selectedBankInfo;
export const isAlreadyUsedForMerchant = (state: any) => state.walletBanks?.errorWhileCreating?.code === 2;

export const selectListBanksReady = (state: any) => state.walletBanks?.listBankInfosReady;
export const selectListBanksInvalid = (state: any) => state.walletBanks?.listBankInfosInvalid;
export const selectListBanksOverwrite = (state: any) => state.walletBanks?.listBankInfosOverwrite;
export const selectListBanksDuplicated = (state: any) => state.walletBanks?.listBankInfosDuplicated;

export const isFetchingList = (state: any) => state.walletBanks?.status === StatusEnum.LOADING;
export const isCreating = (state: any) => state.walletBanks?.creatingStatus === StatusEnum.LOADING;
export const isVerifying = (state: any) => state.walletBanks?.verifyStatus === StatusEnum.LOADING;
export const isImporting = (state: any) => state.walletBanks?.importStatus === StatusEnum.LOADING;

export const selectErrorWhileImport = (state: any) => state.walletBanks?.errorWhileImport?.message;

export const { setSelectedBankInfo, resetImportAccount } = slice.actions;
