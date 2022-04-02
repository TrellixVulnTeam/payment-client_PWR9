import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import Typography, { TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import BasicInfoForm from './step/BasicInfo';
import { useTranslation } from 'react-i18next';
import { APP_NAME } from 'utils/common';

const useStyles = makeStyles<Theme>((theme) => ({
  form: {
    border: '1px solid #E0E0E0',
    borderRadius: '16px',
    width: '512px',
    padding: '32px',
  },
  title: {
    marginBottom: '20px',
    textAlign: 'center',
  },
}));

const NewPasswordPage = () => {
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
        <title>{t('New password')} - {APP_NAME}</title>
      </Helmet>
      <Box className={classes.form}>
        <Box className={classes.title}>
          <Typography variant={TypoVariants.head1} weight={TypoWeights.bold}>
            {t('Create your own password')}
          </Typography>
        </Box>
        <BasicInfoForm handleClose={handleClose} formFields={formFields} setFormFields={saveFormData} />
      </Box>
    </>
  );
};

export default NewPasswordPage;
