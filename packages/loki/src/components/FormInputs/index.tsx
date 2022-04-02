import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import FormData from 'components/Form';
import { FormFields } from 'components/Form/types';
import Button, { ButtonVariants } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';

import { Edit } from 'assets/icons/ILT';
import { sleep } from 'utils/common';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    forms: {
      '& > *:not(:last-child)': {
        borderBottom: '1px solid #D6DEFF',
      },
    },
    form: {
      margin: theme.spacing(2, 0),
    },
    formGroup: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      marginBottom: theme.spacing(2),
    },
    formInput: {
      width: '100%',
      marginTop: theme.spacing(1),
    },
    formActions: {
      '& > *': {
        marginRight: theme.spacing(2),
      },
    },
    formText: {
      marginTop: theme.spacing(1),
    },
  }),
);

type FormInputProps = {
  fields?: FormFields[];
  title: string;
  text: string | React.ReactNode;
  onSave?: (data: any) => void;
};

const FormInput = ({ fields = [], title, text, onSave }: FormInputProps) => {
  const classes = useStyles();

  const methods = useForm();
  const { setValue } = methods;

  const [editing, setEditing] = useState(false);
  const [statusSaving, setStatusSaving] = useState('idle');

  useEffect(() => {
    if (fields.length) {
      fields.forEach((field) => {
        setValue(field.name, field.defaultValue || text);
      });
    }
  }, [fields, setValue, text]);

  const handleToggleEditing = () => {
    setEditing((prev) => !prev);
  };

  const handleSubmit = async (data: any) => {
    if (typeof onSave !== 'function') return;

    setStatusSaving('loading');
    await sleep(500);
    try {
      await onSave(data);
    } catch (error) {
      console.log({ error });
    } finally {
      setEditing(false);
      setStatusSaving('idle');
    }
  };

  return (
    <Box className={classes.form}>
      <Box className={classes.formControl}>
        <Box className={classes.formGroup}>
          {fields.length > 0 && editing ? (
            <FormData
              methods={methods}
              onSubmit={handleSubmit}
              fields={fields}
              actions={
                <Box className={classes.formActions}>
                  <Button fullWidth={false} variant={ButtonVariants.secondary} onClick={handleToggleEditing}>
                    <Typography variant={TypoVariants.button1}>Cancel</Typography>
                  </Button>
                  <Button fullWidth={false} variant={ButtonVariants.primary} loading={statusSaving === 'loading'}>
                    <Typography variant={TypoVariants.button1} type={TypoTypes.invert}>
                      Save
                    </Typography>
                  </Button>
                </Box>
              }
            />
          ) : (
            <>
              <Typography variant={TypoVariants.body2} type={TypoTypes.sub} weight={TypoWeights.bold}>
                {title}
              </Typography>
              <Box className={classes.formText}>
                {React.isValidElement(text) ? (
                  text
                ) : (
                  <Typography
                    variant={TypoVariants.body1}
                    weight={text ? TypoWeights.bold : TypoWeights.medium}
                    type={text ? TypoTypes.titleDefault : TypoTypes.sub}
                  >
                    {text || 'Not provided yet.'}
                  </Typography>
                )}
              </Box>
            </>
          )}
        </Box>
        {fields.length > 0 && !editing && (
          <IconButton onClick={handleToggleEditing}>
            <Edit />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

type FormInputsTypes = {
  fields: { title: string; text: string | React.ReactNode; defaultValue?: string; onSave?: (data: any) => void }[];
};

const FormInputs = ({ fields }: FormInputsTypes) => {
  const classes = useStyles();
  return (
    <Box className={classes.forms}>
      {fields.map((field) => (
        <FormInput {...field} />
      ))}
    </Box>
  );
};

export default FormInputs;
