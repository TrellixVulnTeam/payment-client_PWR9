import { yupResolver } from '@hookform/resolvers/yup';
import { MethodType, Status } from '@mcuc/stark/stark_pb';
import { GetPaymentDetailReply } from '@mcuc/stark/vision_pb';
import { t } from 'i18next';
import i18n from 'i18n';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import _get from 'lodash-es/get';
import * as yup from 'yup';

import FormData from 'components/Form';
import LayoutPaper from 'components/Layout/LayoutPaper';
import Button, { ButtonSizes, ButtonVariants } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { FormFields, FormTypes } from 'components/Form/types';

import { PerformPermission } from 'configs/routes/permission';
import {
  combineCryptoTypeAndNetwork,
  getCryptoTypeFeeFromNetworkType,
  truncateAddressCrypto,
} from 'utils/constant/crypto';
import { BANKS, CRYPTOS, CURRENCY_TYPE } from 'utils/constant/payment';
import DialogSubmitInvoice from '../DialogSubmitInvoice';
import { Box } from '@material-ui/core';
import { getSystemCryptoHotWalletsThunk } from 'redux/features/walletHotWallet/thunks';
import { useAppDispatch } from 'redux/store';
import { isLegalPermission } from 'components/AllowedTo/utils';
import useAuth from 'hooks/useAuth';

type WithdrawConductPaymentProps = {
  payment: GetPaymentDetailReply.AsObject;
};

const schemaBank = yup
  .object()
  .shape({
    payerProvider: yup.string().typeError(i18n.t('This field is required')).required(i18n.t('This field is required')),
    payerName: yup.string().typeError(i18n.t('This field is required')).required(i18n.t('This field is required')),
    payerAccount: yup.string().typeError(i18n.t('This field is required')).required(i18n.t('This field is required')),
    amount: yup
      .number()
      .typeError(i18n.t('{{key}} must be a number', { key: i18n.t('Amount') }))
      .min(0, i18n.t('{{key}} must be greater than or equal to {{number}}', { key: i18n.t('Amount'), number: 0 }))
      .required(i18n.t('This field is required')),
    fee: yup
      .number()
      .typeError(i18n.t('{{key}} must be a number', { key: i18n.t('Fee') }))
      .min(0, i18n.t('{{key}} must be greater than or equal to {{number}}', { key: i18n.t('Fee'), number: 0 }))
      .max(100, i18n.t('{{key}} must be less than or equal to {{number}}', { key: i18n.t('Fee'), number: 100 }))
      .required(i18n.t('This field is required')),
  })
  .required();

const schemaCrypto = yup
  .object()
  .shape({
    payerProvider: yup.string().typeError(i18n.t('This field is required')).required(i18n.t('This field is required')),
    payerName: yup.string().typeError(i18n.t('This field is required')).required(i18n.t('This field is required')),
    payerAccount: yup.string().typeError(i18n.t('This field is required')).required(i18n.t('This field is required')),
    amount: yup
      .number()
      .typeError(i18n.t('{{key}} must be a number', { key: i18n.t('Amount') }))
      .min(0, i18n.t('{{key}} must be greater than or equal to {{number}}', { key: i18n.t('Amount'), number: 0 }))
      .required(i18n.t('This field is required')),
    fee: yup
      .number()
      .typeError(i18n.t('{{key}} must be a number', { key: i18n.t('Fee') }))
      .min(0, i18n.t('{{key}} must be greater than or equal to {{number}}', { key: i18n.t('Fee'), number: 0 }))
      .required(i18n.t('This field is required')),
  })
  .required();

const defaultValuesBank = {
  payerProvider: null,
  fee: null,
  amount: null,
  payerAccount: null,
  payerName: null,
};

const defaultValuesCrypto = {
  payerProvider: null,
  fee: null,
  amount: null,
  payerName: null,
  payerAccount: null,
};

const WithdrawConductPayment: React.FunctionComponent<WithdrawConductPaymentProps> = ({ payment }) => {
  const dispatch = useAppDispatch();

  const { userPermissions } = useAuth();

  const isCrypto = payment.payment.method === MethodType.C;
  const isBank = payment.payment.method === MethodType.T;
  const isApproved = payment.payment.status === Status.APPROVED;

  // ! Note: FormData is validated according to yup
  const methods = useForm({
    defaultValues: isCrypto ? defaultValuesCrypto : defaultValuesBank,
    resolver: yupResolver(isCrypto ? schemaCrypto : schemaBank),
    mode: 'all',
  });

  const { reset, handleSubmit: submitForm, watch, setValue, setError: setErrorForm } = methods;

  const watchProvider = watch('payerProvider');

  const [dialogActive, setDialogActive] = useState({
    name: '',
    value: undefined,
  });
  const [payerAccount, setPayerAccount] = useState([]);

  useEffect(() => {
    if (isCrypto && payment) {
      (async () => {
        const { response, error } = await dispatch(
          getSystemCryptoHotWalletsThunk({
            amount: payment.paymentDetail.crypto.amount,
            merchantId: payment.payment.merchantId,
            cryptoType: payment.paymentDetail.crypto.cryptoType,
            cryptoNetworkType: payment.paymentDetail.crypto.cryptoNetworkType,
          }),
        ).unwrap();

        if (
          error &&
          !isLegalPermission(PerformPermission.walletHotWallet.getSystemCryptoHotWalletsThunk, userPermissions)
        ) {
          setErrorForm('payerAccount', {
            message: t('You are not authorized to {{action}}', {
              action: t('List System Crypto Hot Wallets'),
            }),
          });
        }
        setPayerAccount(response ? response.recordsList : []);
      })();
    }
  }, [dispatch, payment, isCrypto, setValue, setErrorForm, userPermissions]);

  useEffect(() => {
    if (isCrypto && payment) {
      reset({
        payerProvider: CRYPTOS[0].value,
        payerName: combineCryptoTypeAndNetwork(
          _get(payment, 'paymentDetail.crypto.cryptoType'),
          _get(payment, 'paymentDetail.crypto.cryptoNetworkType'),
        ),
      });
    }
  }, [reset, payment, isCrypto]);

  const handleSubmit = (data: any) => {
    setDialogActive({
      name: 'approve',
      value: data,
    });
  };

  const handleClose = () => {
    setDialogActive({
      name: '',
      value: undefined,
    });
  };

  const bankFields: FormFields[] = [
    {
      type: FormTypes.SELECT,
      label: t('Payer provider'),
      name: 'payerProvider',
      placeholder: t('Select'),
      rules: { required: t('This is field required') },
      width: { xs: 12 },
      options: BANKS,
    },
    {
      type: FormTypes.INPUT,
      label: t('Payer account'),
      name: 'payerAccount',
      placeholder: t('Fill your {{key}}', { key: t('Payer account').toLowerCase() }),
      rules: { required: t('This field is required') },
      width: { xs: 6 },
    },
    {
      type: FormTypes.INPUT,
      label: t('Payer name'),
      name: 'payerName',
      placeholder: t('Fill your {{key}}', { key: t('Payer name').toLowerCase() }),
      rules: { required: t('This field is required') },
      width: { xs: 6 },
    },
    {
      type: FormTypes.INPUT_MONEY,
      label: `${t('Amount')} (${CURRENCY_TYPE.VND})`,
      name: 'amount',
      placeholder: t('Fill your {{key}}', { key: t('Amount').toLowerCase() }),
      rules: { required: t('This is field required') },
      width: { xs: 6 },
    },
    {
      type: FormTypes.INPUT_NUMBER,
      label: `${t('Fee')} (%)`,
      name: 'fee',
      placeholder: t('Fill your {{key}}', { key: t('Fee').toLowerCase() }),
      rules: { required: t('This is field required') },
      width: { xs: 6 },
    },
  ];

  const cryptoFields: FormFields[] = [
    {
      type: FormTypes.SELECT,
      label: t('Payer provider'),
      name: 'payerProvider',
      placeholder: t('Select'),
      rules: { required: t('This is field required') },
      width: { xs: 12 },
      options: CRYPTOS,
      defaultValue: CRYPTOS[0].value,
    },
    {
      type: FormTypes.SELECT,
      name: 'payerAccount',
      label: t('Payee account'),
      placeholder: t('Fill your {{key}}', { key: t('Payer account').toLowerCase() }),
      rules: { required: t('This field is required') },
      width: { xs: 6 },
      disabled: !watchProvider,
      options: payerAccount.map((item) => ({
        name: item.address,
        value: item.address,
      })),
      autoComplete: true,
      autoCompleteProps: {
        placeholderSearch: t('Search by {{key}}', { key: t('Address') }),
        filterOptions: (options, state) => {
          return state.inputValue === '' ? options : options.filter((op) => op.name.includes(state.inputValue));
        },
        renderOption: (option) => (
          <Box width="100%" pb={1}>
            <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
              {truncateAddressCrypto(option.name)}
            </Typography>
            <Box mt={0.5}>
              <Typography variant={TypoVariants.caption} weight={TypoWeights.light}>
                {option.name}
              </Typography>
            </Box>
          </Box>
        ),
      },
    },
    {
      type: FormTypes.INPUT,
      label: t('Payer name'),
      name: 'payerName',
      readOnly: true,
      rules: { required: t('This field is required') },
      placeholder: t('Fill your {{key}}', { key: t('Payer name').toLowerCase() }),
      width: { xs: 6 },
    },
    {
      type: FormTypes.INPUT_MONEY,
      label: `${t('Amount')} (${CURRENCY_TYPE.USDT})`,
      name: 'amount',
      rules: { required: t('This field is required') },
      placeholder: t('Fill your {{key}}', { key: t('Amount').toLowerCase() }),
      width: { xs: 6 },
      decimalSeparator: '.',
    },
    {
      type: FormTypes.INPUT_MONEY,
      label: `${t('Fee')} (${getCryptoTypeFeeFromNetworkType(
        _get(payment, 'paymentDetail.crypto.cryptoNetworkType'),
      )})`,
      name: 'fee',
      rules: { required: t('This is field required') },
      placeholder: t('Fill your {{key}}', { key: t('Fee').toLowerCase() }),
      width: { xs: 6 },
      decimalSeparator: '.',
    },
  ];

  return (
    <>
      {isApproved &&
        isLegalPermission(
          isBank
            ? PerformPermission.paymentWithdrawDetail.submitBankingWithdraw
            : PerformPermission.paymentWithdrawDetail.submitCryptoWithdraw,
          userPermissions,
        ) && (
          <LayoutPaper header={t('Conduct payment')}>
            <FormData
              methods={methods}
              onSubmit={submitForm(handleSubmit)}
              fields={isBank ? bankFields : cryptoFields}
              actions={
                <Button type="submit" fullWidth={false} variant={ButtonVariants.primary} size={ButtonSizes.md}>
                  <Typography variant={TypoVariants.button1} type={TypoTypes.invert}>
                    {t('Submit')}
                  </Typography>
                </Button>
              }
            />
          </LayoutPaper>
        )}
      {dialogActive.name === 'approve' && (
        <DialogSubmitInvoice conductPayment={dialogActive.value} payment={payment} onClose={handleClose} />
      )}
    </>
  );
};

export default WithdrawConductPayment;
