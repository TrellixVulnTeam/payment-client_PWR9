import { t } from 'i18next';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { UserInfoCustom } from 'redux/features/users/types';
import { FormFields, FormTypes } from 'components/Form/types';
import FormInput from '../FormInput';

type Props = {
  userInfo: UserInfoCustom;
  onSave?: (data: any) => void;
};

type FormValues = {
  fullName: string;
};

const FormInputName = ({ onSave, userInfo }: Props) => {
  const methods = useForm<FormValues>({
    defaultValues: {
      fullName: userInfo.metadata.fullName,
    },
  });

  const fields: FormFields[] = [
    {
      label: t('Full name'),
      type: FormTypes.INPUT,
      name: 'fullName',
      width: { xs: 12 },
      placeholder: t('Fill your {{key}}', { key: t('Full name') }),
      rules: { required: t('This field is required') },
    },
  ];

  return (
    <FormProvider {...methods}>
      <FormInput label={t('Name')} render={userInfo.metadata.fullName} fields={fields} onSave={onSave} />
    </FormProvider>
  );
};

export default React.memo(FormInputName);
