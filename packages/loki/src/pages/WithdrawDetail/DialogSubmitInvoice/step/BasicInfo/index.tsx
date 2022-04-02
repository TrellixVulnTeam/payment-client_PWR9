import { GetPaymentDetailReply } from '@mcuc/stark/vision_pb';
import { MethodType } from '@mcuc/stark/stark_pb';
import { useFormContext } from 'react-hook-form';
import { t } from 'i18next';

import FormData from 'components/Form';
import UploadImage from 'components/UploadImage';
import { FormFields, FormTypes } from 'components/Form/types';

type Props = {
  payment: GetPaymentDetailReply.AsObject;
};

const BasicInfoForm: React.FC<Props> = ({ payment }) => {
  const methods = useFormContext();

  const fields: FormFields[] = [
    {
      type: FormTypes.COMPONENT,
      name: 'photo',
      label: t('Upload receipt photo to complete'),
      rules: { required: t('This field is required') },
      width: { xs: 12 },
      component: UploadImage,
    },
    {
      type: FormTypes.INPUT,
      name: 'txId',
      label: payment?.payment.method === MethodType.C ? t('TxHash') : t('TxID'),
      placeholder: t('Fill your {{key}}', { key: payment?.payment.method === MethodType.C ? t('TxHash') : t('TxID') }),
      rules: { required: t('This field is required') },
      width: { xs: 12 },
    },
    {
      type: FormTypes.TEXT_AREA,
      name: 'note',
      label: t('Handler note'),
      maxLength: 255,
      placeholder: t('Type your note here'),
      width: { xs: 12 },
      rows: 5,
    },
  ];

  return (
    <>
      <FormData methods={methods} fields={fields} />
    </>
  );
};

export default BasicInfoForm;
