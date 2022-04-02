import { lazy } from 'react';
import {
  MERCHANT,
  FORGOT_PASSWORD,
  LOGIN,
  STATISTICS,
  USER_MANAGEMENT,
  VERIFY,
  RESET_PASSWORD,
  NEW_PASSWORD,
  PAYMENT_TOPUP,
  PAYMENT_TOPUP_DETAIL,
  PAYMENT_WITHDRAW,
  PAYMENT_WITHDRAW_DETAIL,
  MERCHANT_DETAIL,
  MERCHANT_MONEY,
  RECEIPT_VOUCHER,
  PAYMENT_VOUCHER,
  REPORT_OVERVIEW,
  USER_PROFILE,
  USER_INFO,
  WALLET_BANK,
  WALLET_EWALLET,
  PERMISSION,
  HOME,
  WALLET_UMO,
  REPORT_SALE,
  // CONSOLE_UMO,
  REPORT_SALE_TIME,
  REPORT_SALE_MERCHANT,
  REPORT_SALE_METHOD,
  REPORT_SALE_TELLER,
  CONSOLE_TELCO,
  VOUCHER_RECEIPT_DETAIL,
  VOUCHER_PAYMENT_DETAIL,
  CONSOLE_CRYPTO,
  WALLET_HOT_WALLET,
} from 'configs/routes/path';
import LayoutDashboard from 'components/Layout/LayoutDashboard';
import { LayoutPortal } from 'components/Layout/LayoutPortal';
import { PerformPermission } from './permission';
import { Perform } from 'components/AllowedTo';

// * Portal
const LoginPage = lazy(() => import('pages/LoginPage'));
const VerifyPage = lazy(() => import('pages/Verify'));
const ForgotPasswordPage = lazy(() => import('pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('pages/ResetPasswordPage'));
const NewPasswordPage = lazy(() => import('pages/NewPasswordPage'));

// * Authenticated
const HomePage = lazy(() => import('pages/HomePage'));
const StatisticsPage = lazy(() => import('pages/StatisticsPage'));
const TopUpPage = lazy(() => import('pages/TopUp'));
const TopUpDetail = lazy(() => import('pages/TopUpDetail'));
const WithdrawPage = lazy(() => import('pages/Withdraw'));
const WithdrawDetailPage = lazy(() => import('pages/WithdrawDetail'));
const MerchantListPage = lazy(() => import('pages/Merchant'));
const MerchantDetailPage = lazy(() => import('pages/MerchantDetail'));
const MerchantMoneyPage = lazy(() => import('pages/MerchantMoney'));
const ReceiptVoucherPage = lazy(() => import('pages/MerchantDetail/ReceiptVoucher'));
const PaymentVoucherPage = lazy(() => import('pages/MerchantDetail/PaymentVoucher'));
const VoucherDetailPage = lazy(() => import('pages/MerchantDetail/VoucherDetail'));
const ReportOverviewPage = lazy(() => import('pages/ReportOverviewPage'));
const ReportSalePage = lazy(() => import('pages/ReportSalePage'));
const ReportSaleTimePage = lazy(() => import('pages/ReportSaleTimePage'));
const ReportSaleMerchantPage = lazy(() => import('pages/ReportSaleMerchantPage'));
const ReportSaleMethodPage = lazy(() => import('pages/ReportSaleMethodPage'));
const ReportSaleTellerPage = lazy(() => import('pages/ReportSaleTellerPage'));
const UserProfilePage = lazy(() => import('pages/UserProfile'));
const UserInfoPage = lazy(() => import('pages/UserInfoPage'));
const WalletBankPage = lazy(() => import('pages/WalletBankPage'));
const WalletEWalletPage = lazy(() => import('pages/WalletEWalletPage'));
const WalletHotWalletPage = lazy(() => import('pages/WalletHotWalletPage'));
const WalletUMOPage = lazy(() => import('pages/WalletUMOPage'));
const UserManagementPage = lazy(() => import('pages/UserManagement'));
const PermissionPage = lazy(() => import('pages/PermissionPage'));
const AutoApproval = lazy(() => import('pages/ConsoleTelco'));
// const ConsoleUMO = lazy(() => import('pages/ConsoleUMO'));
const ConsoleCrypto = lazy(() => import('pages/ConsoleCrypto'));

interface RouteProps {
  path: string;
  component: any;
  layout: any;
  exact?: boolean;
  restricted?: boolean;
  private?: boolean;
  permissions?: Perform;
}

const routes: Array<RouteProps> = [
  // * Portal
  {
    path: LOGIN,
    component: LoginPage,
    exact: true,
    restricted: true,
    layout: LayoutPortal,
  },
  {
    path: VERIFY,
    component: VerifyPage,
    exact: true,
    layout: LayoutPortal,
  },
  {
    path: FORGOT_PASSWORD,
    component: ForgotPasswordPage,
    exact: true,
    layout: LayoutPortal,
  },
  {
    path: RESET_PASSWORD,
    component: ResetPasswordPage,
    exact: true,
    layout: LayoutPortal,
  },
  {
    path: NEW_PASSWORD,
    component: NewPasswordPage,
    exact: true,
    layout: LayoutPortal,
  },
  // * Authenticated
  {
    exact: true,
    private: true,
    path: HOME,
    component: HomePage,
    layout: LayoutDashboard,
    permissions: [],
  },
  {
    private: true,
    path: STATISTICS,
    component: StatisticsPage,
    permissions: Object.values(PerformPermission.statistics),
    layout: LayoutDashboard,
  },
  {
    private: true,
    path: PAYMENT_TOPUP,
    component: TopUpPage,
    permissions: PerformPermission.paymentTopUp.listPayments,
    layout: LayoutDashboard,
  },
  {
    private: true,
    path: PAYMENT_TOPUP_DETAIL,
    component: TopUpDetail,
    permissions: PerformPermission.paymentTopUpDetail.getPaymentDetail,
    layout: LayoutDashboard,
  },
  {
    private: true,
    path: PAYMENT_WITHDRAW,
    component: WithdrawPage,
    permissions: PerformPermission.paymentWithdraw.listPayments,
    layout: LayoutDashboard,
  },
  {
    private: true,
    path: PAYMENT_WITHDRAW_DETAIL,
    component: WithdrawDetailPage,
    permissions: PerformPermission.paymentWithdrawDetail.getPaymentDetail,
    layout: LayoutDashboard,
  },
  {
    private: true,
    exact: true,
    path: MERCHANT,
    component: MerchantListPage,
    permissions: PerformPermission.merchant.listMerchants,
    layout: LayoutDashboard,
  },
  {
    private: true,
    path: MERCHANT_DETAIL,
    component: MerchantDetailPage,
    permissions: PerformPermission.merchantDetail.getMerchant,
    layout: LayoutDashboard,
  },
  {
    private: true,
    path: MERCHANT_MONEY,
    component: MerchantMoneyPage,
    permissions: [PerformPermission.merchantMoneyIn.listPayments, PerformPermission.merchantMoneyOut.listPayments],
    layout: LayoutDashboard,
  },
  {
    private: true,
    path: RECEIPT_VOUCHER,
    component: ReceiptVoucherPage,
    permissions: [PerformPermission.merchantReceipt.listVouchers],
    layout: LayoutDashboard,
  },
  {
    private: true,
    path: PAYMENT_VOUCHER,
    component: PaymentVoucherPage,
    permissions: [PerformPermission.merchantPayment.listVouchers],
    layout: LayoutDashboard,
  },
  {
    private: true,
    path: VOUCHER_PAYMENT_DETAIL,
    component: VoucherDetailPage,
    permissions: [PerformPermission.merchantPayment.getVoucher],
    layout: LayoutDashboard,
  },
  {
    private: true,
    path: VOUCHER_RECEIPT_DETAIL,
    component: VoucherDetailPage,
    permissions: [PerformPermission.merchantReceipt.getVoucher],
    layout: LayoutDashboard,
  },
  {
    private: true,
    path: REPORT_OVERVIEW,
    component: ReportOverviewPage,
    layout: LayoutDashboard,
    permissions: Object.values(PerformPermission.reportOverview),
  },
  {
    private: true,
    path: REPORT_SALE,
    component: ReportSalePage,
    layout: LayoutDashboard,
    permissions: [
      PerformPermission.saleReportMerchant.getSellReportByMerchant,
      PerformPermission.saleReportMethod.getSellReportByPaymentMethod,
      PerformPermission.saleReportTeller.getSellReportByTeller,
      PerformPermission.saleReportTime.getSellReportByTimeRange,
    ],
  },
  {
    private: true,
    path: REPORT_SALE_TIME,
    component: ReportSaleTimePage,
    layout: LayoutDashboard,
    permissions: PerformPermission.saleReportTime.getSellReportByTimeRange,
  },
  {
    private: true,
    path: REPORT_SALE_MERCHANT,
    component: ReportSaleMerchantPage,
    layout: LayoutDashboard,
    permissions: PerformPermission.saleReportMerchant.getSellReportByMerchant,
  },
  {
    private: true,
    path: REPORT_SALE_METHOD,
    component: ReportSaleMethodPage,
    layout: LayoutDashboard,
    permissions: PerformPermission.saleReportMethod.getSellReportByPaymentMethod,
  },
  {
    private: true,
    path: REPORT_SALE_TELLER,
    component: ReportSaleTellerPage,
    layout: LayoutDashboard,
    permissions: PerformPermission.saleReportTeller.getSellReportByTeller,
  },
  {
    private: true,
    path: USER_PROFILE,
    component: UserProfilePage,
    permissions: [PerformPermission.userManagementUserList.getUser],
    layout: LayoutDashboard,
  },
  {
    private: true,
    path: USER_INFO,
    component: UserInfoPage,
    permissions: [PerformPermission.userManagementUserList.getUser],
    layout: LayoutDashboard,
  },
  {
    private: true,
    path: WALLET_BANK,
    component: WalletBankPage,
    permissions: PerformPermission.walletBank.listSystemBankAccounts,
    layout: LayoutDashboard,
  },
  {
    private: true,
    path: WALLET_EWALLET,
    component: WalletEWalletPage,
    permissions: PerformPermission.walletEWallet.listSystemEWallets,
    layout: LayoutDashboard,
  },
  {
    private: true,
    path: WALLET_HOT_WALLET,
    component: WalletHotWalletPage,
    permissions: PerformPermission.walletHotWallet.listCryptoHotWallets,
    layout: LayoutDashboard,
  },
  {
    private: true,
    path: WALLET_UMO,
    component: WalletUMOPage,
    permissions: PerformPermission.walletUMO.listCryptoWallets,
    layout: LayoutDashboard,
  },
  {
    private: true,
    path: USER_MANAGEMENT,
    component: UserManagementPage,
    permissions: [
      PerformPermission.userManagementUserList.listUsers,
      PerformPermission.userManagementUserActionLog.listLogs,
    ],
    layout: LayoutDashboard,
  },
  {
    private: true,
    path: PERMISSION,
    component: PermissionPage,
    permissions: [
      PerformPermission.permissionMapping.updateRolePermission,
      PerformPermission.permissionAction.listActions,
      PerformPermission.permissionGroup.listGroups,
      PerformPermission.permissionResource.listResources,
      PerformPermission.permissionRole.listRoles,
    ],
    layout: LayoutDashboard,
  },
  {
    private: true,
    path: CONSOLE_TELCO,
    component: AutoApproval,
    permissions: [PerformPermission.adminConsoleTelco.getSettings],
    layout: LayoutDashboard,
  },
  // {
  //   private: true,
  //   path: CONSOLE_UMO,
  //   component: ConsoleUMO,
  //   permissions: [PerformPermission.adminConsoleUMO.loadCryptoWallet],
  //   layout: LayoutDashboard,
  // },
  {
    private: true,
    path: CONSOLE_CRYPTO,
    component: ConsoleCrypto,
    permissions: [PerformPermission.adminConsoleCrypto.getCryptoSettings],
    layout: LayoutDashboard,
  },
];

export default routes;
