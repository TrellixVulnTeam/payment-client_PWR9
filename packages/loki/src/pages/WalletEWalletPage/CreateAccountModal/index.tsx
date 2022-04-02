import _get from 'lodash-es/get';
import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { PhoneNumber } from '@greyhole/myid/myid_pb';

import { useAppDispatch } from 'redux/store';
import { isCreating } from 'redux/features/walletBanks/slice';
import { selectDisplayMerchants } from 'redux/features/merchants/slice';
import { createSystemEWalletThunk } from 'redux/features/walletEWallets/thunks';

import FormData from 'components/Form';
import AlopayDialog from 'components/Dialog';
import { FormFields, FormTypes } from 'components/Form/types';
import Button, { ButtonSizes } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';

import useQuery from 'hooks/useQuery';
import useErrorMessage from 'hooks/useErrorMessage';

import { formatOptions } from 'utils/common';
import { convertNumber } from 'utils/common/numberFormat';
import { CURRENCY_TYPE } from 'utils/constant/payment';
import { PROVIDERS } from '../const';
import { regexpSpecialCharacter } from './const';

interface Props {
  callback?: () => void;
}

type FormValues = {
  accountWalletName: number;
  accountPhoneNumber: string;
  accountName: string;
  balance: number;
  merchantId: number;
};

const CreateAccountModal = (props: Props) => {
  const { callback } = { ...props };
  const queryParams = useQuery();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  const loading = useSelector(isCreating);
  const merchants = useSelector(selectDisplayMerchants);

  const strMerchantId = queryParams.get('merchant');
  const merchantSelected = merchants.find((x) => x.id === +strMerchantId) || merchants[0];

  const { setError, errorMessage } = useErrorMessage();

  const methods = useForm<FormValues>({
    defaultValues: {
      accountName: null,
      accountPhoneNumber: null,
      accountWalletName: null,
      balance: null,
      merchantId: null,
    },
  });

  const { setValue } = methods;

  useEffect(() => {
    if (merchantSelected) {
      setValue('merchantId', merchantSelected.id);
    }
  }, [merchantSelected, open, setValue]);

  const { handleSubmit, reset } = methods;

  const fields: FormFields[] = [
    {
      name: 'accountWalletName',
      label: t('{{key}} name', { key: t('E-Wallet') }),
      type: FormTypes.SELECT,
      placeholder: t('Select'),
      rules: { required: t('This field is required') },
      width: { xs: 12 },
      options: PROVIDERS,
    },
    {
      name: 'accountPhoneNumber',
      label: t('Phone number'),
      type: FormTypes.PHONE_NUMBER,
      placeholder: t('Fill your {{key}}', { key: t('Account number').toLowerCase() }),
      rules: {
        required: t('This field is required'),
        validate: (value: PhoneNumber.AsObject) => {
          return (
            (value.nationalNumber?.length >= 10 && value.nationalNumber?.length <= 11) ||
            t('Phone number must be 10 or 11 digits')
          );
        },
      },
      width: { xs: 12 },
    },
    {
      name: 'accountName',
      label: t('Account name'),
      type: FormTypes.INPUT,
      placeholder: t('Fill your {{key}}', { key: t('Account name').toLowerCase() }),
      rules: {
        required: t('This field is required'),
        pattern: {
          value: regexpSpecialCharacter,
          message: t('Account name must be not contain special character, number or accented characters'),
        },
      },
      width: { xs: 12 },
    },
    {
      name: 'balance',
      label: `${t('First balance')} (${CURRENCY_TYPE.VND})`,
      type: FormTypes.INPUT_MONEY,
      placeholder: t('Fill your {{key}}', { key: t('First balance') }),
      rules: { required: t('This field is required') },
      width: { xs: 12 },
    },
    {
      name: 'dailyBalanceLimit',
      label: `${t('Daily balance limit')} (${CURRENCY_TYPE.VND})`,
      type: FormTypes.INPUT_MONEY,
      placeholder: t('Fill your {{key}}', { key: t('Daily balance limit').toLowerCase() }),
      rules: { required: t('This field is required') },
      width: { xs: 12 },
    },
    {
      name: 'merchantId',
      label: t('Merchant'),
      type: FormTypes.SELECT,
      placeholder: t('Select'),
      rules: { required: t('This field is required') },
      width: { xs: 12 },
      options: formatOptions(merchants, { name: 'name', value: 'id' }),
    },
  ];

  async function handleAdd(values) {
    const { response, error } = await dispatch(
      createSystemEWalletThunk({
        ...values,
        accountPhoneNumber: _get(values, 'accountPhoneNumber.nationalNumber'),
        balance: convertNumber(values.balance),
        dailyBalanceLimit: convertNumber(values.dailyBalanceLimit),
      }),
    ).unwrap();

    if (response) {
      if (callback) {
        setTimeout(() => {
          callback();
        }, 500);
      }
      setOpen(false);
      reset({}, { keepDirty: false });
    } else {
      if (error.message.includes('constraint')) {
        const selected = merchants.find((merchant) => merchant.id === values.merchantId);
        setError({
          code: undefined,
          message: t(`This phone number is already used for Merchant {{merchant}}. Please re-check.`, {
            merchant: selected.name || '',
          }),
        });
      } else if (error.code === 2) {
        setError({
          code: undefined,
          message: t('Phone number is invalid. Ex: (+84) 0xxx xxx xxx'),
        });
      } else {
        setError(error);
      }
    }
  }

  const handleClose = () => {
    setOpen(false);
    setError();
    reset({}, { keepDirty: false });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  return (
    <>
      <Button onClick={handleOpen} size={ButtonSizes.md}>
        <Typography variant={TypoVariants.button1} type={TypoTypes.invert}>
          {t('Add account')}
        </Typography>
      </Button>
      <AlopayDialog
        preventClose={methods.formState.isDirty}
        title={t('Add new {{key}}', { key: t('Account').toLowerCase() })}
        fullWidth
        open={open}
        onClose={handleClose}
        actions={
          <Button size={ButtonSizes.lg} loading={loading} onClick={handleSubmit(handleAdd)}>
            {t('Add')}
          </Button>
        }
        errorMessage={errorMessage}
      >
        <FormData methods={methods} fields={fields} />
      </AlopayDialog>
    </>
  );
};

export default CreateAccountModal;
