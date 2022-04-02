import { t } from 'i18next';
import { Box, makeStyles, Theme } from '@material-ui/core';
import * as React from 'react';
import { useFormContext } from 'react-hook-form';

import { useAppSelector } from 'redux/store';
import { selectGroupEntities } from 'redux/features/group/slice';
import { selectRoleEntities } from 'redux/features/role/slice';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { combinePhoneAndCountryCodeDisplay } from 'utils/common/phoneNumber';

const useStyles = makeStyles<Theme>((theme) => ({
  form: {
    '& > *:not(:last-child)': {
      marginBottom: theme.spacing(2),
    },
  },
}));

type FormControlProps = {
  title: string;
  text: string | React.ReactNode;
};

const FormControl = ({ title, text }: FormControlProps) => {
  const classes = useStyles();

  return (
    <Box className={classes.formControl}>
      <Typography variant={TypoVariants.body2} type={TypoTypes.sub} weight={TypoWeights.light}>
        {title}
      </Typography>
      <Box marginTop={0.5}>
        <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
          {text}
        </Typography>
      </Box>
    </Box>
  );
};

const ReviewInfoForm = () => {
  const classes = useStyles();
  const methods = useFormContext();

  const { getValues } = methods;

  const formFields = getValues();

  const roles = useAppSelector(selectRoleEntities);
  const groups = useAppSelector(selectGroupEntities);

  return (
    <>
      <Box className={classes.form}>
        <FormControl title={t('Full name')} text={formFields.fullName} />
        <FormControl title={t('Group')} text={groups[formFields.groupId]?.name || '-'} />
        <FormControl title={t('Role')} text={roles[formFields.roleId]?.name || '-'} />
        <FormControl
          title={t('Phone number')}
          text={combinePhoneAndCountryCodeDisplay(formFields.phoneNumber) || '-'}
        />
      </Box>
    </>
  );
};

export default ReviewInfoForm;
