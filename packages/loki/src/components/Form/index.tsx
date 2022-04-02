import React, { useCallback } from 'react';
import {
  Controller,
  ControllerRenderProps,
  FieldValues,
  FormProvider,
  FormState,
  UseFormReturn,
} from 'react-hook-form';

import { t } from 'i18next';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Typography, { TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';
import AlertCircle from 'assets/icons/ILT/lib/AlertCircle';
import { FormFields, FormTypes } from './types';

// Fields
import InputTextField from './fields/TextInput';
import SelectField from './fields/Select';
import DatePickerField from './fields/DatePicker';
import TextareaField from './fields/Textarea';
import RadioField from './fields/Radio';
import CheckboxField from './fields/Checkbox';
import TypographyField from './fields/Typography';
import ComponentField from './fields/Component';
import InputNumberField from './fields/InputNumber';
import InputMoneyField from './fields/InputMoney';
import PhoneNumberField from './fields/PhoneNumber';
import PasswordField from './fields/Password';

const useStyles = makeStyles<Theme>((theme) => ({
  buttonSubmit: {
    marginTop: theme.spacing(1),
  },
  alert: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '4px',
  },
  alertMessage: {
    marginLeft: '4px',
  },
  actions: {
    '& > button:not(:last-child)': {
      marginBottom: '16px',
    },
  },
}));

type FormDataProps = {
  methods: UseFormReturn<any>;
  fields: FormFields[];
  actions?: React.ReactNode;
  onSubmit?: (data: any) => void;
};

const ErrorFields = {
  PRIMARY: 'primary',
  ERROR: 'error',
} as const;

type RenderComponentProps = {
  component: React.ElementType;
  formFields: FormFields;
  field: ControllerRenderProps<any, string>;
  formState: FormState<FieldValues>;
};

const RenderComponent: React.FC<RenderComponentProps> = ({ component: Component, formFields, field, formState }) => {
  const { errors } = formState;
  const isShowError =
    formFields.type === FormTypes.SELECT
      ? errors[formFields.name] && !formFields.disabled
      : errors[formFields.name] && !formFields.disabled && !formFields.readOnly;
  const status = isShowError ? ErrorFields.ERROR : ErrorFields.PRIMARY;
  const commonFields = {
    ...field,
    ...formFields,
    ...{ status },
  };

  const handleChange = useCallback(
    (e) => {
      field.onChange(e);
      // ! From custom
      if (typeof formFields.onChange === 'function') {
        formFields.onChange(e);
      }
    },
    [field, formFields],
  );

  return <Component {...commonFields} onChange={handleChange} />;
};

const FormData: React.FunctionComponent<FormDataProps> = (props) => {
  const classes = useStyles();

  const { actions, fields, onSubmit, methods } = props;
  const { formState, handleSubmit, control } = methods;

  const { errors } = formState;

  const renderField = (formFields: FormFields, field: ControllerRenderProps<any, string>) => {
    const commonFields = {
      field,
      formFields,
      formState,
    };

    switch (formFields.type) {
      case FormTypes.INPUT:
        return <RenderComponent component={InputTextField} {...commonFields} />;
      case FormTypes.INPUT_NUMBER:
        return <RenderComponent component={InputNumberField} {...commonFields} />;
      case FormTypes.INPUT_MONEY:
        return <RenderComponent component={InputMoneyField} {...commonFields} />;
      case FormTypes.SELECT:
        return <RenderComponent component={SelectField} {...commonFields} />;
      case FormTypes.DATE:
        return <RenderComponent component={DatePickerField} {...commonFields} />;
      case FormTypes.TEXT_AREA:
        return <RenderComponent component={TextareaField} {...commonFields} />;
      case FormTypes.RADIO:
        return <RenderComponent component={RadioField} {...commonFields} />;
      case FormTypes.TYPOGRAPHY:
        return <RenderComponent component={TypographyField} {...commonFields} />;
      case FormTypes.COMPONENT:
        return <RenderComponent component={ComponentField} {...commonFields} />;
      case FormTypes.CHECKBOX:
        return <RenderComponent component={CheckboxField} {...commonFields} />;
      case FormTypes.PHONE_NUMBER:
        return <RenderComponent component={PhoneNumberField} {...commonFields} />;
      case FormTypes.INPUT_PASSWORD:
        return <RenderComponent component={PasswordField} {...commonFields} />;
      default:
        return <></>;
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {fields
            .filter((item) => !!item.hidden === false)
            .map((formFields, idx) => {
              return (
                <Grid item {...formFields.width} key={`field-${idx}`}>
                  <Controller
                    control={control}
                    name={formFields.name}
                    defaultValue={formFields.value}
                    rules={formFields.rules}
                    render={({ field }) => (
                      <>
                        {renderField(formFields, field)}
                        {errors[formFields.name]?.message && !formFields.disabled && !formFields.readOnly && (
                          <Box className={classes.alert}>
                            <AlertCircle color="error" style={{ fontSize: 17 }} />
                            <Box className={classes.alertMessage}>
                              <Typography variant={TypoVariants.body2} type={TypoTypes.error}>
                                {t(errors[formFields.name]?.message)}
                              </Typography>
                            </Box>
                          </Box>
                        )}
                      </>
                    )}
                  />
                </Grid>
              );
            })}
          {actions && (
            <Grid item xs={12}>
              <Box className={classes.actions}>{actions}</Box>
            </Grid>
          )}
        </Grid>
      </form>
    </FormProvider>
  );
};

export default FormData;
