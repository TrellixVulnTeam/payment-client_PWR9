import { t } from 'i18next';
import { useFormContext } from 'react-hook-form';

import FormData from 'components/Form';
import UploadImage from 'components/UploadImage';
import { InputSizes } from 'components/StyleGuide/Input';
import { FormFields, FormTypes } from 'components/Form/types';

import { BANKS, CURRENCY_TYPE } from 'utils/constant/payment';

interface Props {
  onNext: () => void;
  onBack: () => void;
  onFirst: () => void;
  onClose: () => void;
  callback: () => void;
  msgError: string;
  isReceiptVoucher: boolean;
}

const Step1ConductVoucher = (props: Props) => {
  const { isReceiptVoucher } = { ...props };
  const methods = useFormContext();

  const fields: FormFields[] = [
    {
      name: 'payeeProvider',
      label: t('Payee provider'),
      type: FormTypes.SELECT,
      placeholder: t('Select your {{key}}', { key: t('Payee provider').toLowerCase() }),
      rules: { required: t('This field is required') },
      width: { xs: 12, md: 4 },
      options: BANKS,
    },
    {
      name: 'payeeAccount',
      label: t('Payee account'),
      type: FormTypes.INPUT,
      placeholder: t('Fill your {{key}}', { key: t('Payee account').toLowerCase() }),
      rules: { required: t('This field is required') },
      width: { xs: 12, md: 4 },
    },
    {
      name: 'payeeName',
      label: t('Payee name'),
      type: FormTypes.INPUT,
      placeholder: t('Fill your {{key}}', { key: t('Payee name').toLowerCase() }),
      rules: { required: t('This field is required') },
      width: { xs: 12, md: 4 },
    },
    {
      name: 'payerProvider',
      label: t('Payer provider'),
      type: FormTypes.SELECT,
      placeholder: t('Select your {{key}}', { key: t('Payer provider').toLowerCase() }),
      rules: { required: t('This field is required') },
      width: { xs: 12, md: 4 },
      options: BANKS,
    },
    {
      name: 'payerAccount',
      label: t('Payer account'),
      type: FormTypes.INPUT,
      placeholder: t('Fill your {{key}}', { key: t('Payer account').toLowerCase() }),
      rules: { required: t('This field is required') },
      width: { xs: 12, md: 4 },
    },
    {
      name: 'payerName',
      label: t('Payer name'),
      type: FormTypes.INPUT,
      placeholder: t('Fill your {{key}}', { key: t('Payer name').toLowerCase() }),
      rules: { required: t('This field is required') },
      width: { xs: 12, md: 4 },
    },
    {
      name: 'amount',
      label: `${t('Amount')} (${CURRENCY_TYPE.VND})`,
      type: FormTypes.INPUT_MONEY,
      placeholder: t('Fill your {{key}}', { key: t('Amount').toLowerCase() }),
      rules: { required: t('This field is required') },
      width: { xs: 12, md: 6 },
      readOnly: true,
    },
    {
      name: 'txID',
      label: 'TxID',
      type: FormTypes.INPUT,
      placeholder: t('Fill your {{key}}', { key: t('TxID') }),
      rules: { required: t('This field is required') },
      width: { xs: 12, md: 6 },
      size: InputSizes.lg,
    },
    {
      name: 'note',
      label: 'Note',
      type: FormTypes.TEXT_AREA,
      maxLength: 255,
      placeholder: t('Type your note here'),
      rules: { required: t('This field is required') },
      width: { xs: 12 },
      rows: 5,
    },
    {
      name: 'photo',
      label: t('Upload {{name}} photo to approve', {
        name: isReceiptVoucher ? t('Receipt').toLowerCase() : t('Payment').toLowerCase(),
      }),
      type: FormTypes.COMPONENT,
      rules: { required: t('This field is required') },
      width: { xs: 12 },
      component: UploadImage,
    },
  ];

  return <FormData methods={methods} fields={fields} />;
};

export default Step1ConductVoucher;
