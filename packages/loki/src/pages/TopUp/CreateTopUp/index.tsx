import { SystemEWallet } from '@mcuc/stark/tony_pb';
import { SystemBank } from '@mcuc/stark/pepper_pb';
import { yupResolver } from '@hookform/resolvers/yup';
import i18n from 'i18n';
import { t } from 'i18next';
import { Box } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import * as yup from 'yup';
import React from 'react';
import { useForm } from 'react-hook-form';

import { StatusEnum } from 'redux/constant';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { selectMerchant } from 'redux/features/merchants/slice';
import { isSystemEWallet } from 'redux/features/payments/types';
import { getSystemEWalletsThunk } from 'redux/features/walletEWallets/thunks';
import { listSystemBankAccountByPaymentInfoThunk } from 'redux/features/walletBanks/thunks';
import { createPaymentTopUpThunk, getPaymentInfoByPaymentCodeThunk } from 'redux/features/payments/thunks';

import FormData from 'components/Form';
import AlopayDialog from 'components/Dialog';
import { PerformPermission } from 'configs/routes/permission';
import { isLegalPermission } from 'components/AllowedTo/utils';
import { FormFields, FormTypes } from 'components/Form/types';
import { Button, ButtonSizes } from 'components/StyleGuide/Button';
import { Typography, TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { CURRENCY_TYPE, getBank, getEWallet, getMethodType } from 'utils/constant/payment';
import useAuth from 'hooks/useAuth';
import useErrorMessage from 'hooks/useErrorMessage';
import { MethodType } from '@mcuc/stark/stark_pb';

const useStyles = makeStyles<Theme>((theme) => ({
  formContent: {
    marginTop: theme.spacing(3),
  },
  formSelect: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing(3),
  },
}));

type FormValues = {
  method: string;
  provider: string;
  merchant: string;
  payeeName: string;
  payeeAccount: string;
  paymentCode: string;
  amount: number;
  payerAccount: string;
  payerName: string;
  creatorNote: string;
};

const defaultValues = {
  method: undefined,
  provider: undefined,
  merchant: undefined,
  payerAccount: '',
  payerName: '',
  paymentCode: '',
  payeeAccount: '',
  payeeName: '',
  creatorNote: '',
  amount: undefined,
};

type DialogCreateTopUpProps = {
  refreshListPayments: () => void;
};

const schema = yup.object().shape({
  provider: yup.string().required(i18n.t('This field is required')),
  payeeName: yup.string().required(i18n.t('This field is required')),
  payeeAccount: yup.string().required(i18n.t('This field is required')),
  paymentCode: yup.string().required(i18n.t('This field is required')),
  payerAccount: yup.string().required(i18n.t('This field is required')),
  payerName: yup.string().required(i18n.t('This field is required')),
  merchant: yup.string().required(i18n.t('This field is required')),
  method: yup.string().required(i18n.t('This field is required')),
  amount: yup
    .number()
    .typeError(i18n.t('Amount must be a number'))
    .min(1000, i18n.t('Amount must be greater than or equal to {{number}}', { number: '1.000' }))
    .required(i18n.t('This field is required')),
  creatorNote: yup
    .string()
    .required(i18n.t('This field is required'))
    .max(255, i18n.t('Other reasons must be at most {{number}} characters', { number: '255' })),
});

const isPaymentCodeBank = (method: string) => method === 'T';
const isPaymentCodeEWallet = (method: string) => method === 'E';

const DialogCreateTopUp: React.FunctionComponent<DialogCreateTopUpProps> = ({ refreshListPayments }) => {
  const classes = useStyles();
  const dispatch = useAppDispatch();

  const { userPermissions } = useAuth();
  const { errorMessage, setError } = useErrorMessage();
  const merchants = useAppSelector(selectMerchant);

  const [methodType, setMethodType] = React.useState<MethodType | undefined>();
  const [status, setStatus] = React.useState(StatusEnum.IDLE);
  const [open, setOpen] = React.useState(false);
  const [payeeOptions, setPayeeOptions] = React.useState<Array<SystemEWallet.AsObject | SystemBank.AsObject>>([]);

  const methods = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: defaultValues,
  });

  const { reset, watch, setValue, handleSubmit, clearErrors, setError: setErrorForm } = methods;

  const watchPaymentCode = watch('paymentCode');

  const handleCreateTopUp = async (data: FormValues) => {
    if (status === StatusEnum.LOADING) return;

    setStatus(StatusEnum.LOADING);

    const { response, error } = await dispatch(
      createPaymentTopUpThunk({
        method: methodType,
        merchantUserAccount: data.payerAccount,
        merchantUserName: data.payerName,
        systemAccount: data.payeeAccount,
        systemName: data.payeeName,
        amount: data.amount,
        paymentCode: data.paymentCode,
        note: data.creatorNote,
      }),
    ).unwrap();

    if (response) {
      handleClose();
      refreshListPayments();
    }

    if (error) {
      if (error.code === 2) {
        setError({
          code: undefined,
          message: t('Payment code is incorrect'),
        });
      } else {
        setError(error);
      }
    }
    setStatus(StatusEnum.IDLE);
  };

  const handleOpen = () => {
    setOpen(true);
    setError({
      code: undefined,
      message: '',
    });
    handleReset();
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangePaymentCode = async (event: React.BaseSyntheticEvent) => {
    const { value = '' } = event.target;
    if (!value) return;

    const method = value[0];
    const isAllowedCreate =
      (isPaymentCodeBank(method) &&
        isLegalPermission(PerformPermission.paymentTopUp.createBankingTopUp, userPermissions)) ||
      (isPaymentCodeEWallet(method) &&
        isLegalPermission(PerformPermission.paymentTopUp.createEWalletTopUp, userPermissions));

    if (isAllowedCreate) {
      const { response, error } = await dispatch(getPaymentInfoByPaymentCodeThunk({ code: value })).unwrap();

      setValue('payeeAccount', '');
      setValue('payeeName', '');

      if (response) {
        clearErrors();

        const { bankName, eWalletName, merchantId, paymentMethod } = response;

        if (bankName) {
          const { response, error } = await dispatch(
            listSystemBankAccountByPaymentInfoThunk({
              bankName: bankName,
              merchantId,
            }),
          ).unwrap();

          console.log('test', { error });

          if (error && !isLegalPermission(PerformPermission.walletBank.listSystemBankAccounts, userPermissions)) {
            console.log('error');
            setErrorForm('payeeAccount', {
              message: t('You are not authorized to {{action}}', {
                action: t('List System Bank Accounts'),
              }),
            });
          }

          setPayeeOptions(response ? response.recordsList : []);
          setValue('provider', getBank(bankName)?.name);
        }

        if (eWalletName) {
          const { response, error } = await dispatch(
            getSystemEWalletsThunk({
              eWalletName,
              merchantId,
            }),
          ).unwrap();

          if (error && !isLegalPermission(PerformPermission.walletEWallet.listSystemEWallets, userPermissions)) {
            setErrorForm('payeeAccount', {
              message: t('You are not authorized to {{action}}', {
                action: t('List System E-Wallet'),
              }),
            });
          }

          setPayeeOptions(response ? response.systemEWalletsList : []);
          setValue('provider', getEWallet(eWalletName)?.name);
        }

        setMethodType(paymentMethod);
        setValue('method', getMethodType(paymentMethod)?.name);

        if (merchantId) {
          const merchant = merchants.find((item) => item.id === merchantId);
          if (merchant) {
            setValue('merchant', merchant.name);
          }
        }
      }

      if (error) {
        if (error.code === 30301) {
          setError({
            code: undefined,
            message: t('Payment code is incorrect'),
          });
          setValue('merchant', '');
          setValue('method', '');
          setValue('provider', '');
        } else {
          setError(error);
        }
      } else {
        setError();
      }
    } else {
      setError({
        code: undefined,
        message: isPaymentCodeBank(method)
          ? t(`You are not authorized to {{action}} {{paymentType}} for {{methodType}}`, {
              action: t('Create').toLowerCase(),
              paymentType: t('Top-Up'),
              methodType: t('Banking'),
            })
          : isPaymentCodeEWallet(method)
          ? t(`You are not authorized to {{action}} {{paymentType}} for {{methodType}}`, {
              action: t('Create').toLowerCase(),
              paymentType: t('Top-Up'),
              methodType: t('E-Wallet'),
            })
          : t('There was an error. Please try again'),
      });
      setValue('merchant', '');
      setValue('method', '');
      setValue('provider', '');
    }
  };

  const handleChangePayeeAccount = (value: string) => {
    const info = payeeOptions.find((item) => {
      if (isSystemEWallet(item)) {
        return item.accountPhoneNumber === value;
      }
      return item.accountNumber === value;
    });
    if (info) {
      clearErrors('payeeName');
      setValue('payeeAccount', value);
      setValue('payeeName', info.accountName);
    }
  };

  const handleReset = () => {
    reset(defaultValues);
  };

  const fields: FormFields[] = [
    {
      type: FormTypes.INPUT,
      name: 'paymentCode',
      label: t('Payment code'),
      placeholder: t('Fill your {{key}}', { key: t('Payment code').toLowerCase() }),
      rules: { required: t('This field is required') },
      width: { xs: 12 },
      onBlur: handleChangePaymentCode,
    },
    {
      type: FormTypes.INPUT,
      name: 'merchant',
      label: t('Merchant'),
      placeholder: t('Merchant'),
      rules: { required: t('This field is required') },
      width: { xs: 4 },
      readOnly: true,
    },
    {
      type: FormTypes.INPUT,
      name: 'method',
      label: t('Method'),
      placeholder: t('Method'),
      rules: { required: t('This field is required') },
      width: { xs: 4 },
      readOnly: true,
    },
    {
      type: FormTypes.INPUT,
      name: 'provider',
      label: t('Provider'),
      placeholder: t('Provider'),
      rules: { required: t('This field is required') },
      width: { xs: 4 },
      readOnly: true,
    },
    {
      type: FormTypes.SELECT,
      name: 'payeeAccount',
      label: t('Payee account'),
      placeholder: t('Fill your {{key}}', { key: t('Payee account').toLowerCase() }),
      rules: { required: t('This field is required') },
      width: { xs: 6 },
      disabled: watchPaymentCode === '',
      options: payeeOptions.map((item) => ({
        name: item.accountName,
        value: isSystemEWallet(item) ? item.accountPhoneNumber : item.accountNumber,
      })),
      onChange: handleChangePayeeAccount,
      autoComplete: true,
      autoCompleteProps: {
        placeholderSearch: t('Search by {{key}}', { key: `${t('Name')} ${t('Or')} ${t('Number')}`.toLowerCase() }),
        filterOptions: (options, state) => {
          return state.inputValue === ''
            ? options
            : options.filter((op) => (op.name + op.value).includes(state.inputValue));
        },
        renderOption: (option) => (
          <Box width="100%" pb={1}>
            <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
              {option.value}
            </Typography>
            <Typography variant={TypoVariants.body2} weight={TypoWeights.light} type={TypoTypes.sub}>
              {option.name}
            </Typography>
          </Box>
        ),
      },
    },
    {
      type: FormTypes.INPUT,
      name: 'payeeName',
      label: t('Payee name'),
      placeholder: t('Fill your {{key}}', { key: t('Payee name').toLowerCase() }),
      rules: { required: t('This field is required') },
      width: { xs: 6 },
      disabled: watchPaymentCode === '',
    },
    {
      type: FormTypes.INPUT,
      name: 'payerAccount',
      label: t('Payer account'),
      placeholder: t('Fill your {{key}}', { key: t('Payer account').toLowerCase() }),
      rules: { required: t('This field is required') },
      width: { xs: 6 },
      disabled: watchPaymentCode === '',
    },
    {
      type: FormTypes.INPUT,
      name: 'payerName',
      label: t('Payer name'),
      placeholder: t('Fill your {{key}}', { key: t('Payer name').toLowerCase() }),
      rules: { required: t('This field is required') },
      width: { xs: 6 },
      disabled: watchPaymentCode === '',
    },
    {
      type: FormTypes.INPUT_MONEY,
      name: 'amount',
      label: `${t('Amount')} (${CURRENCY_TYPE.VND})`,
      placeholder: t('Fill your {{key}}', { key: t('Amount').toLowerCase() }),
      rules: {
        required: t('This field is required'),
      },
      width: { xs: 12 },
      disabled: watchPaymentCode === '',
    },
    {
      type: FormTypes.TEXT_AREA,
      name: 'creatorNote',
      label: t('Created note'),
      placeholder: t('Type your note here'),
      rules: { required: t('This field is required') },
      width: { xs: 12 },
      maxLength: 255,
      rows: 5,
      disabled: watchPaymentCode === '',
    },
  ];

  return (
    <>
      <Button fullWidth onClick={handleOpen}>
        <Typography variant={TypoVariants.button1} type={TypoTypes.invert}>
          {t('Create new {{key}}', { key: t('Top-up').toLowerCase() })}
        </Typography>
      </Button>
      <AlopayDialog
        preventClose={methods.formState.isDirty}
        title={t('Create new {{key}}', { key: t('Top-up') })}
        fullWidth
        open={open}
        onClose={handleClose}
        maxWidth="md"
        errorMessage={errorMessage}
        isStroke={true}
        actions={
          <Button
            fullWidth
            size={ButtonSizes.lg}
            loading={status === StatusEnum.LOADING}
            onClick={handleSubmit(handleCreateTopUp)}
          >
            <Typography variant={TypoVariants.button1} type={TypoTypes.invert}>
              {t('Create')}
            </Typography>
          </Button>
        }
      >
        <Box className={classes.formContent}>
          <FormData methods={methods} fields={fields} />
        </Box>
      </AlopayDialog>
    </>
  );
};

export default DialogCreateTopUp;
