import { Status } from '@mcuc/stark/stark_pb';
import { GetPaymentDetailReply } from '@mcuc/stark/vision_pb';
import { t } from 'i18next';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Chip from '@material-ui/core/Chip';
import React from 'react';
import _get from 'lodash-es/get';

import { useAppDispatch, useAppSelector } from 'redux/store';
import { getIsMerchantUserBankAccountVerifiedThunk } from 'redux/features/payments/thunks';
import { selectMerchantEntities } from 'redux/features/merchants/slice';

import FormInfo from 'components/FormInfo';
import AllowedTo from 'components/AllowedTo';
import PageLoader from 'components/PageLoader';
import StatusReceipt from 'components/Status/Receipt';
import LayoutPaper from 'components/Layout/LayoutPaper';
import { Button, ButtonVariants } from 'components/StyleGuide/Button';
import { Typography, TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';

import useUsersMap from 'hooks/useUsersMap';
import { formatCurrency } from 'utils/common';
import { combineCryptoTypeAndNetwork } from 'utils/constant/crypto';
import {
  getBank,
  getMethodType,
  CURRENCY_TYPE,
  getUserPerformed,
  getListCheckPaymentMethod,
  getPermissionForApproveWithdraw,
} from 'utils/constant/payment';
import { PerformPermission } from 'configs/routes/permission';
import IconCheckSuccess from 'assets/icons/ILT/lib/CheckSuccess';

import DialogAccountVerification from '../DialogAccountVerification';
import DialogBalanceCheck from '../DialogBalanceCheck';
import DialogEditStatus from '../DialogEditStatus';
import DialogRefused from '../DialogRefused';

export const columnsDefine = [
  {
    Header: t('Date & time'),
    accessor: 'name',
    width: '200px',
  },
  {
    Header: t('Action'),
    accessor: 'id',
  },
];

type WithdrawDetailProps = {
  payment: GetPaymentDetailReply.AsObject;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    verification: {
      backgroundColor: '#D6FFEC',
      border: '1px solid #29E08B',
      color: '#29E08B',
      marginLeft: 12,
    },
  }),
);

const WithdrawDetail: React.FunctionComponent<WithdrawDetailProps> = ({ payment }) => {
  const classes = useStyles();

  const dispatch = useAppDispatch();

  const [dialog, setDialog] = React.useState({
    name: '',
    value: undefined,
  });
  const [statusVerifying, setStatusVerifying] = React.useState(true);
  const [isVerified, setIsVerified] = React.useState(false);

  const merchantsMap = useAppSelector(selectMerchantEntities);
  const { usersMap } = useUsersMap([+payment.payment?.createdBy || undefined]);

  const method = _get(payment, 'payment.method');
  const status = _get(payment, 'payment.status');

  const { isBank, isCrypto, isTelco } = getListCheckPaymentMethod(method);

  const bankContents = isBank
    ? [
        {
          title: t('Method'),
          value: getMethodType(payment.payment?.method)?.name || '-',
        },
        {
          title: t('Payee provider'),
          value: getBank(payment.paymentDetail.banking.merchantUserBankName)?.name || '-',
        },
        {
          title: t('Payee account'),
          value: payment.paymentDetail.banking.merchantUserAccountNumber || '-',
        },
        {
          title: t('Payee name'),
          value: payment.paymentDetail.banking.merchantUserAccountName || '-',
        },
        {
          title: t('User payment ID'),
          value: getUserPerformed(payment.payment?.createdBy, merchantsMap, usersMap)?.id || '-',
        },
        {
          title: `${t('Amount')} (${CURRENCY_TYPE.VND})`,
          value: formatCurrency(payment.paymentDetail.banking.amount) || '-',
        },
        {
          title: t('Status'),
          value: <StatusReceipt value={payment.payment?.status} />,
        },
      ]
    : [];

  const telcoContents = isTelco
    ? [
        {
          title: t('Method'),
          value: getMethodType(payment.payment?.method)?.name || '-',
        },
        {
          title: `${t('Card value')} (${CURRENCY_TYPE.VND})`,
          value: payment.paymentDetail.telco.amount ? formatCurrency(payment.paymentDetail.telco.amount) : '-',
        },
        {
          title: `${t('Amount')} (${CURRENCY_TYPE.VND})`,
          value: payment.paymentDetail.telco.amount ? formatCurrency(payment.paymentDetail.telco.amount) : '-',
        },
        {
          title: t('Status'),
          value: <StatusReceipt value={payment.payment?.status} />,
        },
      ]
    : [];

  const cryptoContents = isCrypto
    ? [
        {
          title: t('Method'),
          value: getMethodType(payment.payment?.method)?.name || '-',
        },
        {
          title: `${t('Amount')} (${CURRENCY_TYPE.USDT})`,
          value: payment.paymentDetail.crypto.amount || '-',
        },
        {
          title: `${t('Payee name')}`,
          value: combineCryptoTypeAndNetwork(
            payment.paymentDetail.crypto.cryptoType,
            payment.paymentDetail.crypto.cryptoNetworkType,
          ),
        },
        {
          title: `${t('Payee account')}`,
          value: payment.paymentDetail.crypto.receiverAddress,
        },
        {
          title: t('Status'),
          value: <StatusReceipt value={payment.payment.status} />,
        },
      ]
    : [];

  React.useEffect(() => {
    async function doFetch() {
      if (isBank) {
        const { response } = await dispatch(
          getIsMerchantUserBankAccountVerifiedThunk({
            accountName: payment.paymentDetail.banking.merchantUserAccountName,
            accountNumber: payment.paymentDetail.banking.merchantUserAccountNumber,
          }),
        ).unwrap();

        if (response) {
          setIsVerified(response.verified);
        }
      }
      setStatusVerifying(false);
    }
    doFetch();
  }, [dispatch, payment, isBank]);

  const handleCloseDialog = () => {
    setDialog({
      name: '',
      value: undefined,
    });
  };

  const handleOpenRefusedDialog = () => {
    setDialog({
      name: 'refused',
      value: undefined,
    });
  };

  const isShowVerified =
    isBank && (isVerified || [Status.APPROVED, Status.SUBMITTED, Status.COMPLETED].includes(status));

  const performApproval = getPermissionForApproveWithdraw(method);

  return (
    <>
      <LayoutPaper
        header={
          <Box display="flex">
            <Typography variant={TypoVariants.head2}>{t('Withdraw detail')}</Typography>
            {!statusVerifying && isShowVerified && (
              <Chip
                className={classes.verification}
                variant="outlined"
                icon={<IconCheckSuccess style={{ fontSize: 20, color: '#29E08B' }} />}
                label={
                  <Typography variant={TypoVariants.head4} type={TypoTypes.success}>
                    {t('Account Verified')}
                  </Typography>
                }
              />
            )}
          </Box>
        }
      >
        <>
          {/* Bank Transfer */}
          {isBank && (
            <>
              {statusVerifying ? (
                <PageLoader />
              ) : (
                <>
                  <FormInfo contents={bankContents} />
                  {!statusVerifying && (
                    <AllowedTo
                      perform={
                        isVerified
                          ? performApproval
                          : PerformPermission.paymentWithdrawDetail.verifyMerchantUserBankAccount
                      }
                      watch={[isVerified, status]}
                    >
                      {(status === Status.APPROVED || status === Status.CREATED) && (
                        <Button
                          fullWidth={false}
                          variant={ButtonVariants.primary}
                          color="primary"
                          onClick={() => {
                            if (status === Status.APPROVED) {
                              setDialog({
                                name: 'editStatus',
                                value: undefined,
                              });
                            }
                            if (status === Status.CREATED) {
                              setDialog({
                                name: isVerified ? 'balance' : 'verify',
                                value: undefined,
                              });
                            }
                          }}
                        >
                          <Typography variant={TypoVariants.button1} type={TypoTypes.invert}>
                            {status === Status.APPROVED ? t('Edit') : isVerified ? t('Approve') : t('Account verify')}
                          </Typography>
                        </Button>
                      )}
                    </AllowedTo>
                  )}
                </>
              )}
            </>
          )}

          {/* Telco */}
          {isTelco && (
            <>
              <FormInfo contents={telcoContents} />
              <AllowedTo perform={[PerformPermission.paymentWithdrawDetail.approveTelcoWithdraw]} watch={[status]}>
                {status === Status.CREATED && (
                  <Button
                    fullWidth={false}
                    variant={ButtonVariants.primary}
                    onClick={() =>
                      setDialog({
                        name: 'balance',
                        value: undefined,
                      })
                    }
                  >
                    <Typography variant={TypoVariants.button1} type={TypoTypes.invert}>
                      {t('Approve')}
                    </Typography>
                  </Button>
                )}
              </AllowedTo>
            </>
          )}

          {/* Crypto */}
          {isCrypto && (
            <>
              <FormInfo contents={cryptoContents} />
              <AllowedTo perform={PerformPermission.paymentWithdrawDetail.approveCryptoWithdraw} watch={[status]}>
                {status === Status.CREATED && (
                  <Button
                    fullWidth={false}
                    variant={ButtonVariants.primary}
                    onClick={() =>
                      setDialog({
                        name: 'balance',
                        value: undefined,
                      })
                    }
                  >
                    <Typography variant={TypoVariants.button1} type={TypoTypes.invert}>
                      {t('Approve')}
                    </Typography>
                  </Button>
                )}
              </AllowedTo>
            </>
          )}
        </>
      </LayoutPaper>

      {/* Dialogs */}
      {dialog.name === 'refused' && <DialogRefused payment={payment} onClose={handleCloseDialog} />}

      {dialog.name === 'editStatus' && <DialogEditStatus payment={payment} onClose={handleCloseDialog} />}

      {dialog.name === 'balance' && (
        <DialogBalanceCheck
          payment={payment}
          onClose={handleCloseDialog}
          onOpenRefusedDialog={handleOpenRefusedDialog}
        />
      )}

      {dialog.name === 'verify' && (
        <DialogAccountVerification
          payment={payment}
          onClose={handleCloseDialog}
          onVerification={setIsVerified}
          onOpenRefusedDialog={handleOpenRefusedDialog}
        />
      )}
    </>
  );
};

export default WithdrawDetail;
