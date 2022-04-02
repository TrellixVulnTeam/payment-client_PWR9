import React, { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { UserInfoCustom } from 'redux/features/users/types';
import { FormFields, FormTypes } from 'components/Form/types';
import { formatPhoneNumberToSave } from 'utils/common/phoneNumber';
import FormInput from '../FormInput';
import { t } from 'i18next';

type Props = {
  userInfo: UserInfoCustom;
  onSave?: (data: any) => void;
};

type FormValues = {
  phoneNumber: string;
};

const formatPhoneNumber = (phoneNumber: string) => {
  if (phoneNumber) {
    return phoneNumber.includes('+84') ? phoneNumber.slice(3) : phoneNumber;
  }
  return phoneNumber;
};

const FormPhoneNumber = ({ onSave, userInfo }: Props) => {
  const methods = useForm<FormValues>({
    defaultValues: {
      phoneNumber: formatPhoneNumber(userInfo.phoneNumber),
    },
  });

  const { setValue } = methods;

  useEffect(() => {
    setValue('phoneNumber', formatPhoneNumber(userInfo.phoneNumber));
  }, [setValue, userInfo.phoneNumber]);

  const fields: FormFields[] = [
    {
      label: t('Phone number'),
      type: FormTypes.PHONE_NUMBER,
      name: 'phoneNumber',
      width: { xs: 12 },
      placeholder: t('Fill your {{key}}', { key: 'Phone number' }),
      rules: { required: t('This field is required') },
    },
  ];

  const handleSave = async (data: FormValues) => {
    if (typeof onSave === 'function') {
      await onSave({
        ...data,
        phoneNumber: formatPhoneNumberToSave(data.phoneNumber),
      });
    }
  };

  return (
    <FormProvider {...methods}>
      <FormInput
        label={t('Phone number')}
        render={userInfo.phoneNumber}
        fields={fields}
        onSave={handleSave}
      />
    </FormProvider>
  );
};

export default React.memo(FormPhoneNumber);
