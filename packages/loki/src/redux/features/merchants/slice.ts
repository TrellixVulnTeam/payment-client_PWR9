import { Merchant } from '@mcuc/natasha/natasha_pb';
import { createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { normalize, schema } from 'normalizr';
import { RootState } from 'redux/reducers';
import { getListMerchantsThunk, getMerchantThunk } from './thunks';
import { MerchantsState } from './types';

const merchantsAdapter = createEntityAdapter<Merchant.AsObject>();

const initialState = merchantsAdapter.getInitialState<MerchantsState>({
  loading: false,
  error: null,
  page: 1,
  size: 50,
  merchants: [],
  displayIds: [],
  ids: [],
  entities: {},
  selected: undefined,
});

function pending(state: MerchantsState) {
  state.loading = true;
}

function rejected(state: MerchantsState, action: any) {
  state.loading = false;
  state.error = action.payload;
}

const slice = createSlice({
  name: 'merchants',
  initialState,
  reducers: {},
  extraReducers: {
    [getListMerchantsThunk.pending.toString()]: pending,
    [getListMerchantsThunk.rejected.toString()]: rejected,
    [getListMerchantsThunk.fulfilled.toString()]: (state: MerchantsState, action) => {
      const { response, error } = action.payload;
      if (response) {
        const normalized = normalize(response.recordsList, [new schema.Entity('merchants')]);
        merchantsAdapter.upsertMany(state, normalized.entities.merchants!);
        state.displayIds = normalized.result;
        state.page = response.currentPage;
        state.size = response.currentSize;
      } else {
        state.displayIds = [];
      }
      state.loading = false;
      state.error = error;
    },
    [getMerchantThunk.pending.toString()]: pending,
    [getMerchantThunk.rejected.toString()]: rejected,
    [getMerchantThunk.fulfilled.toString()]: (state: MerchantsState, action) => {
      const { response, error } = action.payload;

      if (response) {
        state.selected = response.merchant;
      }

      state.loading = false;
      state.error = error;
    },
  },
});

const { reducer } = slice;

export default reducer;

export const selectMerchantState = (state: RootState) => state.merchants;

export const {
  selectAll: selectMerchant,
  selectById: selectMerchantById,
  selectEntities: selectMerchantEntities,
} = merchantsAdapter.getSelectors(selectMerchantState);

export const selectDisplayMerchants = createSelector(selectMerchantState, (merchants) =>
  merchants.displayIds.map((id) => merchants.entities[id]),
);

export const selectMerchantLoading = createSelector(selectMerchantState, (state) => state.loading);

export const selectMerchantSelected = createSelector(selectMerchantState, (state) => state.selected);
