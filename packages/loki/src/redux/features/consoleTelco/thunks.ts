import {
  UpdateChargeCardProvidersSettingRequest,
  UpdateUsingThirdPartySettingRequest,
  UpdateTopUpAutoApprovalSettingRequest,
} from '@mcuc/stark/morgan_pb';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { gRPCMorganClient } from 'services/grpc/morgan/client';
import { sleep } from 'utils/common';

export const getSettingThunk = createAsyncThunk('consoleTelco/getSetting', async () => {
  await sleep(1000);
  return await gRPCMorganClient.getSettings();
});

export const updateTopUpAutoApprovalSettingThunk = createAsyncThunk(
  'consoleTelco/updateTopUpAutoApprovalSetting',
  async (payload: UpdateTopUpAutoApprovalSettingRequest.AsObject) => {
    return await gRPCMorganClient.updateTopUpAutoApprovalSetting(payload);
  },
);

export const updateUsingThirdPartySettingThunk = createAsyncThunk(
  'consoleTelco/updateUsingThirdPartySetting',
  async (payload: UpdateUsingThirdPartySettingRequest.AsObject) => {
    return await gRPCMorganClient.updateUsingThirdPartySetting(payload);
  },
);

export const updateChargeCardProvidersSettingThunk = createAsyncThunk(
  'consoleTelco/updateChargeCardProvidersSetting',
  async (payload: UpdateChargeCardProvidersSettingRequest.AsObject) => {
    return await gRPCMorganClient.updateChargeCardProvidersSetting(payload);
  },
);

export const updateGetCardProvidersSettingThunk = createAsyncThunk(
  'consoleTelco/updateGetCardProvidersSetting',
  async (payload: UpdateChargeCardProvidersSettingRequest.AsObject) => {
    return await gRPCMorganClient.updateGetCardProvidersSetting(payload);
  },
);
