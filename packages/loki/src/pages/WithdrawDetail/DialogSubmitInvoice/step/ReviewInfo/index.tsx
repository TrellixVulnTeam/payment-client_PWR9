import { t } from 'i18next';
import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { GetPaymentDetailReply } from '@mcuc/stark/vision_pb';
import { MethodType } from '@mcuc/stark/stark_pb';
import { Box, makeStyles, Theme } from '@material-ui/core';

import ImageReceipt from 'components/ImageReceipt';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';


const useStyles = makeStyles<Theme>((theme) => ({
  form: {
    marginTop: theme.spacing(1),
  },
  formControl: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: theme.spacing(2),
  },
  formTitle: {
    whiteSpace: 'nowrap',
  },
  formText: {
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-all',
    marginTop: 4,
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
      <Typography className={classes.formTitle} variant={TypoVariants.body2} type={TypoTypes.sub}>
        {title}
      </Typography>
      <Typography className={classes.formText} variant={TypoVariants.body1} weight={TypoWeights.bold}>
        {text}
      </Typography>
    </Box>
  );
};

type Props = {
  payment: GetPaymentDetailReply.AsObject;
};

const ReviewInfoForm: React.FC<Props> = ({ payment }) => {
  const classes = useStyles();

  const methods = useFormContext();
  const { getValues } = methods;

  const formFields = getValues();

  return (
    <Box className={classes.form}>
      <FormControl title={t('Receipt photo')} text={<ImageReceipt imageUrl={formFields.photo?.fullUrl} />} />
      <FormControl title={payment?.payment.method === MethodType.C ? t('TxHash') : t('TxID')} text={formFields.txId} />
      <FormControl title={t('Handler note')} text={formFields.note} />
    </Box>
  );
};

export default ReviewInfoForm;
