import { GetMerchantBalanceReply } from '@mcuc/natasha/natasha_pb';
import { t } from 'i18next';
import { useFormContext } from 'react-hook-form';
import React from 'react';

import FormData from 'components/Form';
import DropdownListField from 'components/StyleGuide/DropdownListField';
import InputMoneyFormat from 'components/StyleGuide/InputMoneyFormat';
import Option from 'components/StyleGuide/Option';
import TextField from 'components/StyleGuide/TextField';
import { InputSizes } from 'components/StyleGuide/Input';
import { FormFields, FormTypes } from 'components/Form/types';
import { CURRENCY_TYPE } from 'utils/constant/payment';
import { formatCurrency } from 'utils/common';

interface Props {
  onNext: () => void;
  onBack: () => void;
  onFirst: () => void;
  onClose: () => void;
  callback?: () => void;
  msgError: string;
  balance: GetMerchantBalanceReply.AsObject;
  isPaymentVoucher?: boolean;
  VoucherOptions: { name: string; value: number }[];
}

const Step1AddVoucherInfo = (props: Props) => {
  const { VoucherOptions, isPaymentVoucher } = { ...props };
  const methods = useFormContext();

  const receiptVoucherFields: FormFields[] = [
    {
      name: 'time',
      label: t('Time'),
      type: FormTypes.DATE,
      placeholder: `${t('Select')} ${t('Time')}`,
      rules: { required: t('This field is required') },
      width: { xs: 12 },
      readOnly: true,
      disabled: true,
    },
    {
      name: 'voucherType',
      label: t('Voucher type'),
      type: FormTypes.COMPONENT,
      placeholder: `${t('Select')} ${t('Voucher type')}`,
      rules: { required: t('This field is required') },
      width: { xs: 12, md: 6 },
      component: DropdownListField,
      size: InputSizes.lg,
      children: VoucherOptions.map((item) => (
        <Option value={item.value} key={item.value}>
          {t(item.name)}
        </Option>
      )),
    },
    {
      name: 'voucherAmount',
      label: `${t('Voucher amount')} (${CURRENCY_TYPE.VND})`,
      type: FormTypes.INPUT_MONEY,
      placeholder: `${t('Fill your {{key}}', { key: t('Voucher amount') })}`,
      rules: {
        required: t('This field is required'),
        min: {
          value: 1000,
          message: t('{{key}} must be greater than or equal to {{number}}', {
            key: t('Voucher amount'),
            number: formatCurrency(1000),
          }),
        },
      },
      width: { xs: 12, md: 6 },
    },
    {
      name: 'note',
      label: t('Note'),
      type: FormTypes.TEXT_AREA,
      maxLength: 255,
      placeholder: t('Type your note here'),
      rules: {},
      width: { xs: 12 },
      rows: 5,
    },
  ];

  const paymentVoucherFields: FormFields[] = [
    {
      name: 'time',
      label: t('Time'),
      type: FormTypes.DATE,
      placeholder: t('Fill your {{key}}', { key: t('Time') }),
      rules: { required: t('This field is required') },
      width: { xs: 12, md: 6 },
      readOnly: true,
      disabled: true,
    },
    {
      name: 'voucherType',
      label: t('Voucher type'),
      type: FormTypes.COMPONENT,
      placeholder: t('Select {{key}}', { key: t('Voucher type') }),
      rules: { required: t('This field is required') },
      width: { xs: 12, md: 6 },
      component: DropdownListField,
      size: InputSizes.lg,
      children: VoucherOptions.map((item) => (
        <Option value={item.value} key={item.value}>
          {t(item.name)}
        </Option>
      )),
    },
    {
      name: 'availableBalance',
      label: `${t('Available Balance')} (${CURRENCY_TYPE.VND})`,
      type: FormTypes.COMPONENT,
      width: { xs: 12, md: 6 },
      component: TextField,
      size: InputSizes.lg,
      fieldProps: {
        component: InputMoneyFormat,
        suffix: '',
        allowNegative: false,
      },
      readOnly: true,
    },
    {
      name: 'voucherAmount',
      label: `${t('Voucher amount')} (${CURRENCY_TYPE.VND})`,
      type: FormTypes.INPUT_MONEY,
      placeholder: t('Fill your {{key}}', { key: t('Voucher amount') }),
      rules: { required: t('This field is required') },
      width: { xs: 12, md: 6 },
    },
    {
      name: 'note',
      label: t('Note'),
      type: FormTypes.TEXT_AREA,
      maxLength: 255,
      placeholder: t('Type your note here'),
      rules: {},
      width: { xs: 12 },
      rows: 5,
    },
  ];

  return <FormData methods={methods} fields={isPaymentVoucher ? paymentVoucherFields : receiptVoucherFields} />;
};

export default React.memo(Step1AddVoucherInfo);
