import { UpdateAutoTransferCryptoWithdrawRequest } from '@mcuc/stark/ultron_pb';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { gRPCUltronClient } from 'services/grpc/ultron/client';
import { sleep } from 'utils/common';

export const getCryptoSettingsThunk = createAsyncThunk('consoleCrypto/getCryptoSettings', async () => {
  await sleep(1000);
  return await gRPCUltronClient.getCryptoSettings();
});

export const updateAutoTransferCryptoWithdrawThunk = createAsyncThunk(
  'consoleCrypto/updateAutoTransferCryptoWithdraw',
  async (payload: UpdateAutoTransferCryptoWithdrawRequest.AsObject) => {
    return await gRPCUltronClient.updateAutoTransferCryptoWithdraw(payload);
  },
);
