export const PerformPermission = {
  // ? User Management - User list
  userManagementUserList: {
    resendCreatePasswordOtp: 'userManagementUserList.resendCreatePasswordOtp',
    getUser: 'userManagementUserList.getUser',
    unlockUser: 'userManagementUserList.unlockUser',
    lockUser: 'userManagementUserList.lockUser',
    createUser: 'userManagementUserList.createUser',
    listUsers: 'userManagementUserList.listUsers',
    updateUser: 'userManagementUserList.updateUser',
    getUsers: 'userManagementUserList.getUsers',
  },

  // ? User Management - User action log
  userManagementUserActionLog: {
    listLogs: 'userManagementUserActionLog.listLogs',
  },

  // ? Payment - Top-up
  paymentTopUp: {
    listPayments: 'paymentTopUp.listPayments',
    autoApproval: 'paymentTopUp.autoApproval',
    createBankingTopUp: 'paymentTopUp.createBankingTopUp',
    createEWalletTopUp: 'paymentTopUp.createEWalletTopUp',
  },

  // ? Payment Top-up - Detail
  paymentTopUpDetail: {
    getBankAccountVerified: 'paymentTopUpDetail.getBankAccountVerified',
    getPaymentDetail: 'paymentTopUpDetail.getPaymentDetail',
    approveBankingTopUp: 'paymentTopUpDetail.approveBankingTopUp',
    approveTelcoTopUp: 'paymentTopUpDetail.approveTelcoTopUp',
    approveCryptoTopUp: 'paymentTopUpDetail.approveCryptoTopUp',
    approveEWalletTopUp: 'paymentTopUpDetail.approveEWalletTopUp',
    rejectBankingTopUp: 'paymentTopUpDetail.rejectBankingTopUp',
    rejectTelcoTopUp: 'paymentTopUpDetail.rejectTelcoTopUp',
    rejectCryptoTopUp: 'paymentTopUpDetail.rejectCryptoTopUp',
    rejectEWalletTopUp: 'paymentTopUpDetail.rejectEWalletTopUp',
  },

  // ? Payment - Withdraw
  paymentWithdraw: {
    listPayments: 'paymentWithdraw.listPayments',
  },

  // ? Payment Withdraw- Detail
  paymentWithdrawDetail: {
    getPaymentDetail: 'paymentWithdrawDetail.getPaymentDetail',
    verifyMerchantUserBankAccount: 'paymentWithdrawDetail.verifyMerchantUserBankAccount',
    approveBankingWithdraw: 'paymentWithdrawDetail.approveBankingWithdraw',
    approveTelcoWithdraw: 'paymentWithdrawDetail.approveTelcoWithdraw',
    approveCryptoWithdraw: 'paymentWithdrawDetail.approveCryptoWithdraw',
    rejectBankingWithdraw: 'paymentWithdrawDetail.rejectBankingWithdraw',
    rejectTelcoWithdraw: 'paymentWithdrawDetail.rejectTelcoWithdraw',
    rejectCryptoWithdraw: 'paymentWithdrawDetail.rejectCryptoWithdraw',
    submitBankingWithdraw: 'paymentWithdrawDetail.submitBankingWithdraw',
    submitCryptoWithdraw: 'paymentWithdrawDetail.submitCryptoWithdraw',
  },

  // ? Merchant
  merchant: {
    listMerchants: 'merchant.listMerchants',
  },

  // ? Merchant - Detail
  merchantDetail: {
    getMerchant: 'merchantDetail.getMerchant',
    getMerchantBalance: 'merchantDetail.getMerchantBalance',
  },

  // ? Merchant - Money in
  merchantMoneyIn: {
    listPayments: 'merchantMoneyIn.listPayments',
  },

  // ? Merchant - Money out
  merchantMoneyOut: {
    listPayments: 'merchantMoneyOut.listPayments',
  },

  // ? Merchant - Receipt
  merchantReceipt: {
    submitVoucher: 'merchantReceipt.submitVoucher',
    createVoucher: 'merchantReceipt.createVoucher',
    getVoucher: 'merchantReceipt.getVoucher',
    listVouchers: 'merchantReceipt.listVouchers',
  },

  // ? Merchant - Payment
  merchantPayment: {
    cancelVoucher: 'merchantPayment.cancelVoucher',
    submitVoucher: 'merchantPayment.submitVoucher',
    createVoucher: 'merchantPayment.createVoucher',
    getVoucher: 'merchantPayment.getVoucher',
    listVouchers: 'merchantPayment.listVouchers',
  },

  // ? Permission - Resource
  permissionResource: {
    updateResource: 'permissionResource.updateResource',
    getResource: 'permissionResource.getResource',
    listResources: 'permissionResource.listResources',
    createResource: 'permissionResource.createResource',
  },

  // ? Permission - Action
  permissionAction: {
    updateAction: 'permissionAction.updateAction',
    getAction: 'permissionAction.getAction',
    listActions: 'permissionAction.listActions',
    createAction: 'permissionAction.createAction',
  },

  // ? Permission - Group
  permissionGroup: {
    updateGroup: 'permissionGroup.updateGroup',
    getGroup: 'permissionGroup.getGroup',
    listGroups: 'permissionGroup.listGroups',
    createGroup: 'permissionGroup.createGroup',
  },

  // ? Permission - Role
  permissionRole: {
    updateRole: 'permissionRole.updateRole',
    getRole: 'permissionRole.getRole',
    listRoles: 'permissionRole.listRoles',
    createRole: 'permissionRole.createRole',
  },

  // ? Permission - Mapping
  permissionMapping: {
    updateRolePermission: 'permissionMapping.updateRolePermission',
  },

  // ? Permission - Statistics
  statistics: {
    getTotalAmount: 'statistics.getTotalAmount',
    getProcessingPerformance: 'statistics.getProcessingPerformance',
    getStatistic: 'statistics.getStatistic',
  },

  // ? Report Overview
  reportOverview: {
    getTopTeller: 'reportOverview.getTopTeller',
    getAllocationWithdrawRate: 'reportOverview.getAllocationWithdrawRate',
    getTopPaymentMethod: 'reportOverview.getTopPaymentMethod',
    getAllocationTopUpRate: 'reportOverview.getAllocationTopUpRate',
    getProfitRate: 'reportOverview.getProfitRate',
    getPaymentToday: 'reportOverview.getPaymentToday',
    getIncomeStatement: 'reportOverview.getIncomeStatement',
  },

  // ? Report - User report
  reportUserReport: {},

  // ? Sale Report - Time
  saleReportTime: {
    getSellReportByTimeRange: 'saleReportTime.getSellReportByTimeRange',
  },

  // ? Sale Report - Teller
  saleReportTeller: {
    getSellReportByTeller: 'saleReportTeller.getSellReportByTeller',
  },

  // ? Sale Report - Method
  saleReportMethod: {
    getSellReportByPaymentMethod: 'saleReportMethod.getSellReportByPaymentMethod',
  },

  // ? Sale Report - Merchant
  saleReportMerchant: {
    getSellReportByMerchant: 'saleReportMerchant.getSellReportByMerchant',
  },

  // ? report - Financial report
  reportFinancialReport: {},

  // ? Profile
  profile: {
    read: 'profile.read',
    changePassword: 'profile.changePassword',
    updateMetadata: 'profile.updateMetadata',
  },

  // ? Wallet - Bank
  walletBank: {
    validateImportSystemBankAccount: 'walletBank.validateImportSystemBankAccount',
    importSystemBankAccount: 'walletBank.importSystemBankAccount',
    createSystemBankAccount: 'walletBank.createSystemBankAccount',
    listSystemBankAccounts: 'walletBank.listSystemBankAccounts',
    updateSystemBankAccountStatus: 'walletBank.updateSystemBankAccountStatus',
  },

  // ? Wallet - EWallet
  walletEWallet: {
    validateImportSystemBankAccount: 'walletEWallet.validateImportSystemBankAccount',
    importSystemEWallets: 'walletEWallet.importSystemEWallets',
    createSystemEWallet: 'walletEWallet.createSystemEWallet',
    listSystemEWallets: 'walletEWallet.listSystemEWallets',
    updateSystemEWalletStatus: 'walletEWallet.updateSystemEWalletStatus',
  },

  // ? Wallet - UMO
  walletUMO: {
    importCryptoWallets: 'walletUmo.importCryptoWallets',
    listCryptoWallets: 'walletUmo.listCryptoWallets',
  },

  // ? Wallet - Hot Wallet
  walletHotWallet: {
    listCryptoHotWallets: 'walletHotWallet.listCryptoHotWallets',
    importCryptoHotWallets: 'walletHotWallet.importCryptoHotWallets',
    getSystemCryptoHotWalletsThunk: 'walletHotWallet.getSystemCryptoHotWalletsThunk',
  },

  // ? Admin Console - Telco
  adminConsoleTelco: {
    getSettings: 'adminConsoleTelco.getSettings',
    updateUsingThirdPartySetting: 'adminConsoleTelco.updateUsingThirdPartySetting',
    updateGetCardProvidersSetting: 'adminConsoleTelco.updateGetCardProvidersSetting',
    updateTopUpAutoApprovalSetting: 'adminConsoleTelco.updateTopUpAutoApprovalSetting',
    updateChargeCardProvidersSettingThunk: 'adminConsoleTelco.updateChargeCardProvidersSetting',
  },

  // ? Admin Console - UMO
  adminConsoleUMO: {
    loadCryptoWallet: 'adminConsoleUmo.loadCryptoWallet',
  },

  // ? Admin Console - Crypto
  adminConsoleCrypto: {
    getCryptoSettings: 'adminConsoleCrypto.getCryptoSettings',
    updateAutoTransferCryptoWithdraw: 'adminConsoleCrypto.updateAutoTransferCryptoWithdraw',
  },
};
