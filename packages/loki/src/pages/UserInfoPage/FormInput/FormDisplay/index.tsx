import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import FormInput from '../FormInput';

type Props = {
  label: string;
  render: React.ReactNode | string;
};

const FormDisplay = ({ label, render }: Props) => {
  const methods = useForm();
  return (
    <FormProvider {...methods}>
      <FormInput label={label} render={render} />
    </FormProvider>
  );
};

export default React.memo(FormDisplay);
