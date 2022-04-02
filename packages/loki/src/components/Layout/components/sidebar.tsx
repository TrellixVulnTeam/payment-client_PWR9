import { t } from 'i18next';
import React from 'react';
import {
  CONSOLE_TELCO,
  // CONSOLE_UMO,
  CONSOLE_CRYPTO,
  MERCHANT,
  PAYMENT_TOPUP,
  PAYMENT_WITHDRAW,
  PERMISSION,
  REPORT_OVERVIEW,
  REPORT_SALE,
  STATISTICS,
  USER_MANAGEMENT,
  WALLET_BANK,
  WALLET_EWALLET,
  WALLET_UMO,
  WALLET_HOT_WALLET,
} from 'configs/routes/path';
import { PerformPermission } from 'configs/routes/permission';
import { Console, Merchant, Payment, Report, Statistics, UserManagement, Wallet } from 'assets/icons/ILT';

export type SidebarProps = {
  icon?: React.ReactNode;
  path: string;
  title: string;
  permissions?: string | string[];
  items?: SidebarProps[];
};

export const sidebarAdmin: Array<SidebarProps> = [
  {
    icon: <Statistics style={{ fontSize: 24 }} />,
    path: STATISTICS,
    title: t('Statistics'),
    permissions: Object.values(PerformPermission.statistics),
  },
  {
    icon: <Merchant width="24" height="24" />,
    path: MERCHANT,
    title: t('Merchant'),
    permissions: PerformPermission.merchant.listMerchants,
  },
  {
    icon: <Report style={{ fontSize: 24 }} />,
    path: '',
    title: t('Report'),
    permissions: [
      ...Object.values(PerformPermission.reportOverview),
      PerformPermission.saleReportMerchant.getSellReportByMerchant,
      PerformPermission.saleReportMethod.getSellReportByPaymentMethod,
      PerformPermission.saleReportTeller.getSellReportByTeller,
      PerformPermission.saleReportTime.getSellReportByTimeRange,
    ],
    items: [
      {
        path: REPORT_OVERVIEW,
        title: t('Overview'),
        permissions: Object.values(PerformPermission.reportOverview),
      },
      {
        path: REPORT_SALE,
        title: t('Sale Report'),
        permissions: [
          PerformPermission.saleReportMerchant.getSellReportByMerchant,
          PerformPermission.saleReportMethod.getSellReportByPaymentMethod,
          PerformPermission.saleReportTeller.getSellReportByTeller,
          PerformPermission.saleReportTime.getSellReportByTimeRange,
        ],
      },
    ],
  },
  {
    icon: <Payment style={{ fontSize: 24 }} />,
    path: '',
    title: t('Payment'),
    permissions: [PerformPermission.paymentTopUp.listPayments, PerformPermission.paymentWithdraw.listPayments],
    items: [
      {
        path: PAYMENT_TOPUP,
        title: t('Top-up'),
        permissions: PerformPermission.paymentTopUp.listPayments,
      },
      {
        path: PAYMENT_WITHDRAW,
        title: t('Withdraw'),
        permissions: PerformPermission.paymentWithdraw.listPayments,
      },
    ],
  },
  {
    icon: <Wallet style={{ fontSize: 24 }} />,
    path: '',
    title: t('Wallet'),
    permissions: [
      PerformPermission.walletBank.listSystemBankAccounts,
      PerformPermission.walletEWallet.listSystemEWallets,
      PerformPermission.walletUMO.listCryptoWallets,
      PerformPermission.walletHotWallet.listCryptoHotWallets,
    ],
    items: [
      {
        path: WALLET_BANK,
        title: t('Bank'),
        permissions: PerformPermission.walletBank.listSystemBankAccounts,
      },
      {
        path: WALLET_EWALLET,
        title: t('E-Wallet'),
        permissions: PerformPermission.walletEWallet.listSystemEWallets,
      },
      {
        path: WALLET_UMO,
        title: t('UMO'),
        permissions: PerformPermission.walletUMO.listCryptoWallets,
      },
      {
        path: WALLET_HOT_WALLET,
        title: t('UMO Hot Wallet'),
        permissions: PerformPermission.walletHotWallet.listCryptoHotWallets,
      },
    ],
  },
  {
    icon: <UserManagement style={{ fontSize: 24 }} />,
    path: '',
    title: t('Management'),
    permissions: [
      // * User management
      PerformPermission.userManagementUserList.listUsers,
      PerformPermission.userManagementUserActionLog.listLogs,
      // * Permission
      PerformPermission.permissionMapping.updateRolePermission,
      PerformPermission.permissionAction.listActions,
      PerformPermission.permissionGroup.listGroups,
      PerformPermission.permissionRole.listRoles,
      PerformPermission.permissionResource.listResources,
    ],
    items: [
      {
        path: USER_MANAGEMENT,
        title: t('User management'),
        permissions: [
          PerformPermission.userManagementUserList.listUsers,
          PerformPermission.userManagementUserActionLog.listLogs,
        ],
      },
      {
        path: PERMISSION,
        title: t('Permission'),
        permissions: [
          PerformPermission.permissionMapping.updateRolePermission,
          PerformPermission.permissionAction.listActions,
          PerformPermission.permissionGroup.listGroups,
          PerformPermission.permissionRole.listRoles,
          PerformPermission.permissionResource.listResources,
        ],
      },
    ],
  },
  {
    icon: <Console style={{ fontSize: 24 }} />,
    path: '',
    title: t('Admin console'),
    permissions: [
      PerformPermission.adminConsoleTelco.getSettings,
      PerformPermission.adminConsoleCrypto.getCryptoSettings,
      PerformPermission.adminConsoleUMO.loadCryptoWallet,
    ],
    items: [
      {
        path: CONSOLE_TELCO,
        title: t('Telco'),
        permissions: [PerformPermission.adminConsoleTelco.getSettings],
      },
      {
        path: CONSOLE_CRYPTO,
        title: t('Crypto'),
        permissions: [PerformPermission.adminConsoleCrypto.getCryptoSettings],
      },
      // {
      //   path: CONSOLE_UMO,
      //   title: 'UMO',
      //   permissions: [PerformPermission.adminConsoleUMO.loadCryptoWallet],
      // },
    ],
  },
];
