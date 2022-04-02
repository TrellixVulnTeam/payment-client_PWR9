import { t } from 'i18next';
import { MethodType } from '@mcuc/stark/stark_pb';
import { GetPaymentDetailReply } from '@mcuc/stark/vision_pb';
import { useFormContext } from 'react-hook-form';

import FormData from 'components/Form';
import UploadImage from 'components/UploadImage';
import { FormFields, FormTypes } from 'components/Form/types';

type Props = {
  payment: GetPaymentDetailReply.AsObject;
};

const BasicInfoForm: React.FC<Props> = ({ payment }) => {
  const methods = useFormContext();

  const isTelco = payment.payment.method === MethodType.P;
  const isCrypto = payment.payment.method === MethodType.C;

  const fields: FormFields[] = [
    {
      name: 'photo',
      label: t('Upload receipt photo to complete'),
      type: FormTypes.COMPONENT,
      rules: { required: t('This field is required') },
      width: { xs: 12 },
      component: UploadImage,
      hidden: isTelco || isCrypto,
    },
    {
      name: 'txId',
      label: 'TxID',
      type: FormTypes.INPUT,
      placeholder: t('Fill your {{key}}', {
        key: t('TxID'),
      }),
      rules: { required: t('This field is required') },
      width: { xs: 12 },
      hidden: isTelco || isCrypto,
    },
    {
      name: 'note',
      label: t('Handler note'),
      type: FormTypes.TEXT_AREA,
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
