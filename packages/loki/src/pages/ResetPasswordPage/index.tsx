import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import { useTranslation } from 'react-i18next';

import Typography, { TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import Paper from 'components/StyleGuide/Paper';
import { APP_NAME } from 'utils/common';

import BasicInfoForm from './step/BasicInfo';

const useStyles = makeStyles<Theme>((theme) => ({
  form: {
    border: '1px solid #E0E0E0',
    borderRadius: '16px',
    width: '512px',
    padding: '32px',
  },
}));

const ResetPasswordPage = () => {
  const { t } = useTranslation();

  const classes = useStyles();

  const [formFields, setFormFields] = useState<any>({});

  const handleClose = () => {
    handleFirst();
  };

  const handleFirst = () => {
    setFormFields({});
  };

  const saveFormData = (formData: {}) => {
    setFormFields((prev: any) => {
      let newFormData = {
        ...prev,
        ...formData,
      };
      return newFormData;
    });
  };

  return (
    <>
      <Helmet>
        <title>{t('Reset password')} - {APP_NAME}</title>
      </Helmet>
      <Paper className={classes.form}>
        <Box textAlign="center" mb={3}>
          <Typography variant={TypoVariants.head1} weight={TypoWeights.bold}>
            {t('Reset password')}
          </Typography>
        </Box>
        <BasicInfoForm handleClose={handleClose} formFields={formFields} setFormFields={saveFormData} />
      </Paper>
    </>
  );
};

export default ResetPasswordPage;
