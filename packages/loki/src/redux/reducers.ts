import { combineReducers } from '@reduxjs/toolkit';
import common from 'redux/features/common/slice';
import auth from 'redux/features/auth/slice';
import users from 'redux/features/users/slice';
import merchants from 'redux/features/merchants/slice';
import merchantMoney from 'redux/features/merchantMoney/slice';
import payments from 'redux/features/payments/slice';
import walletBanks from 'redux/features/walletBanks/slice';
import walletEWallets from 'redux/features/walletEWallets/slice';
import statistics from 'redux/features/statistics/slice';
import report from 'redux/features/report/slice';
import vouchers from 'redux/features/vouchers/slice';
import action from 'redux/features/action/slice';
import resource from 'redux/features/resource/slice';
import group from 'redux/features/group/slice';
import role from 'redux/features/role/slice';
import console from 'redux/features/consoleTelco/slice';
import consoleCrypto from 'redux/features/consoleCrypto/slice';
import logs from 'redux/features/logs/slice';
import walletUMO from 'redux/features/walletUMO/slice';
import cryptoHotWallet from 'redux/features/walletHotWallet/slice';
import saleReport from 'redux/features/saleReport/slice';

const rootReducer = combineReducers({
  common,
  auth,
  users,
  merchants,
  merchantMoney,
  payments,
  walletBanks,
  walletEWallets,
  statistics,
  report,
  saleReport,
  vouchers,
  action,
  resource,
  group,
  role,
  console,
  logs,
  walletUMO,
  cryptoHotWallet,
  consoleCrypto,
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
