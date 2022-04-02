import { t } from 'i18next';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

import { useAppDispatch } from 'redux/store';
import { isCreating } from 'redux/features/walletBanks/slice';
import { selectDisplayMerchants } from 'redux/features/merchants/slice';
import { createSystemBankAccountThunk } from 'redux/features/walletBanks/thunks';

import FormData from 'components/Form';
import AlopayDialog from 'components/Dialog';
import TextField from 'components/StyleGuide/TextField';
import Button, { ButtonSizes } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';
import { FormFields, FormTypes } from 'components/Form/types';
import useQuery from 'hooks/useQuery';
import useErrorMessage from 'hooks/useErrorMessage';
import { BANKS, CURRENCY_TYPE } from 'utils/constant/payment';
import { formatOptions } from 'utils/common';
import { convertNumber } from 'utils/common/numberFormat';
import { regexpSpecialCharacter } from './const';

interface Props {
  callback?: () => void;
}

type FormValues = {
  bankName: number;
  accountNumber: string;
  accountName: string;
  balance: number;
  dailyBalanceLimit: number;
  merchantId: number;
};

const CreateAccountModal = (props: Props) => {
  const { callback } = { ...props };
  const queryParams = useQuery();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);
  const merchants = useSelector(selectDisplayMerchants);
  const loading = useSelector(isCreating);

  const strMerchantId = queryParams.get('merchant');
  const merchantSelected = merchants.find((x) => x.id === +strMerchantId) || merchants[0];

  const { setError, errorMessage } = useErrorMessage();

  const methods = useForm<FormValues>({
    defaultValues: {
      accountName: null,
      accountNumber: null,
      balance: null,
      bankName: null,
      dailyBalanceLimit: null,
      merchantId: null,
    },
  });

  const { handleSubmit, reset, setValue } = methods;

  useEffect(() => {
    if (merchantSelected) {
      setValue('merchantId', merchantSelected.id);
    }
  }, [merchantSelected, open, setValue]);

  const fields: FormFields[] = [
    {
      name: 'bankName',
      label: t('Bank'),
      type: FormTypes.SELECT,
      placeholder: t('Select'),
      rules: { required: t('This field is required') },
      width: { xs: 12 },
      options: BANKS,
    },
    {
      name: 'accountNumber',
      label: t('Account number'),
      type: FormTypes.INPUT_NUMBER,
      placeholder: t('Fill your {{key}}', { key: t('Account number').toLowerCase() }),
      rules: {
        required: t('This field is required'),
        minLength: {
          value: 8,
          message: t('Account number must be more than {{number}} characters', { number: 8 }),
        },
      },
      width: { xs: 12 },
      component: TextField,
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
      placeholder: t('Fill your {{key}}', { key: t('First balance').toLowerCase() }),
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
      createSystemBankAccountThunk({
        ...values,
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
          message: t(`This account is already used for Merchant {{merchant}}. Please re-check.`, {
            merchant: selected.name || '',
          }),
        });
      } else {
        setError(error);
      }
    }
  }

  const handleClose = () => {
    setOpen(false);
    reset({}, { keepDirty: false });
    setError();
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
        title={t('Add New Account')}
        fullWidth
        open={open}
        onClose={handleClose}
        actions={
          <Button type="submit" size={ButtonSizes.lg} loading={loading} onClick={handleSubmit(handleAdd)}>
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
