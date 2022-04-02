import { t } from 'i18next';
import Box from '@material-ui/core/Box';
import IconButton from '@material-ui/core/IconButton';
import Skeleton from '@material-ui/lab/Skeleton';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

import AllowedTo from 'components/AllowedTo';
import FormData from 'components/Form';
import Button, { ButtonVariants } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { FormFields } from 'components/Form/types';
import { PerformPermission } from 'configs/routes/permission';
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

type Props = {
  label: string;
  render: string | React.ReactNode;
  fields?: FormFields[];
  defaultValues?: any;
  loadingSkeleton?: boolean;
  onSave?: (data: any) => void;
};

const FormInput = ({ onSave, fields = [], label, defaultValues, render, loadingSkeleton }: Props) => {
  const classes = useStyles();

  const methods = useFormContext();
  const { reset } = methods;

  const [editing, setEditing] = useState(false);
  const [statusSaving, setStatusSaving] = useState('idle');

  const handleToggleEditing = () => {
    if (editing) {
      reset(defaultValues);
    }
    setEditing((prev) => !prev);
  };

  const handleSubmit = async (data) => {
    if (typeof onSave !== 'function') return;
    try {
      setStatusSaving('loading');
      await sleep(500);
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
                    <Typography variant={TypoVariants.button1}>{t('Cancel')}</Typography>
                  </Button>
                  <Button fullWidth={false} variant={ButtonVariants.primary} loading={statusSaving === 'loading'}>
                    <Typography variant={TypoVariants.button1} type={TypoTypes.invert}>
                      {t('Save')}
                    </Typography>
                  </Button>
                </Box>
              }
            />
          ) : (
            <>
              <Typography variant={TypoVariants.body2} type={TypoTypes.sub} weight={TypoWeights.bold}>
                {label}
              </Typography>
              {loadingSkeleton ? (
                <Skeleton width={100} height={30} />
              ) : (
                <Box className={classes.formText}>
                  {React.isValidElement(render) ? (
                    render
                  ) : (
                    <Typography
                      variant={TypoVariants.body1}
                      weight={render ? TypoWeights.bold : TypoWeights.medium}
                      type={render ? TypoTypes.titleDefault : TypoTypes.sub}
                    >
                      {render || t('Not provided yet.')}
                    </Typography>
                  )}
                </Box>
              )}
            </>
          )}
        </Box>
        <AllowedTo perform={PerformPermission.userManagementUserList.updateUser} watch={[editing, loadingSkeleton, handleToggleEditing]}>
          {!editing && !loadingSkeleton && onSave && (
            <IconButton onClick={handleToggleEditing}>
              <Edit />
            </IconButton>
          )}
        </AllowedTo>
      </Box>
    </Box>
  );
};

export default React.memo(FormInput);
