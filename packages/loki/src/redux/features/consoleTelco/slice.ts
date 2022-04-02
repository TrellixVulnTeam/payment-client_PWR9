import { Provider } from '@mcuc/stark/morgan_pb';
import { createSlice, createSelector } from '@reduxjs/toolkit';
import { Error } from 'grpc-web';
import { stateError, stateSucceeded, StatusEnum } from 'redux/constant';
import { RootState } from 'redux/reducers';
import { getSettingThunk, updateTopUpAutoApprovalSettingThunk, updateUsingThirdPartySettingThunk } from './thunks';

type InitialState = {
  status: StatusEnum;
  error: Error;
  topUpAutoApproval: boolean;
  enableThirdParty: boolean;
  chargeCardProvidersList: Provider.AsObject[];
  getCardProvidersList: Provider.AsObject[];
};

const initialState: InitialState = {
  status: StatusEnum.IDLE,
  error: null,
  topUpAutoApproval: false,
  enableThirdParty: false,
  chargeCardProvidersList: [],
  getCardProvidersList: [],
};

const slice = createSlice({
  name: 'consoleTelco',
  initialState,
  reducers: {
    toggleAuto: (state, action) => {
      const { autoName } = action.payload;
      state[autoName] = !state[autoName];
    },
    toggleProviderEnable: (state, action) => {
      const { item, type } = action.payload;
      const prop = type === 'chargeCard' ? 'chargeCardProvidersList' : 'getCardProvidersList';
      state[prop] = state[prop].map((cardProvider) => {
        if (cardProvider.name === item.name) {
          return {
            ...cardProvider,
            enable: !item.enable,
          };
        }
        return cardProvider;
      });
    },
    updatePriority: (state, action) => {
      const { item, type } = action.payload;
      const prop = type === 'chargeCard' ? 'chargeCardProvidersList' : 'getCardProvidersList';
      state[prop] = state[prop].map((cardProvider) => {
        if (cardProvider.name === item.name) {
          return {
            ...cardProvider,
            priority: item.priority,
          };
        }
        return cardProvider;
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSettingThunk.pending, (state) => {
        state.status = StatusEnum.LOADING;
        state.error = null;
      })
      .addCase(getSettingThunk.fulfilled, (state, action) => {
        const { response, error } = action.payload;
        if (error) return stateError(state, error);
        state.topUpAutoApproval = response.topUpAutoApproval;
        state.enableThirdParty = response.enableThirdParty;
        state.chargeCardProvidersList = response.chargeCardProvidersList;
        state.getCardProvidersList = response.getCardProvidersList;
        stateSucceeded(state);
      })
      .addCase(updateTopUpAutoApprovalSettingThunk.fulfilled, (state, action) => {
        const { error } = action.payload;
        if (error) return stateError(state, error);
        state.topUpAutoApproval = !state.topUpAutoApproval;
        stateSucceeded(state);
      })
      .addCase(updateUsingThirdPartySettingThunk.fulfilled, (state, action) => {
        const { error } = action.payload;
        if (error) return stateError(state, error);
        state.enableThirdParty = !state.enableThirdParty;
        stateSucceeded(state);
      });
  },
});

const { reducer } = slice;

export const { toggleAuto, toggleProviderEnable, updatePriority } = slice.actions;

export default reducer;

export const selectConsoleState = (state: RootState) => state.console;

export const selectAutoApprovalStatus = createSelector(selectConsoleState, (state) => state.status);
export const selectTopUpAutoApprovalTelco = createSelector(selectConsoleState, (state) => state.topUpAutoApproval);
export const selectEnableThirdPartyTelco = createSelector(selectConsoleState, (state) => state.enableThirdParty);
export const selectChargeCardProvidersListTelco = createSelector(
  selectConsoleState,
  (state) => state.chargeCardProvidersList,
);
export const selectGetCardProvidersListTelco = createSelector(
  selectConsoleState,
  (state) => state.getCardProvidersList,
);
