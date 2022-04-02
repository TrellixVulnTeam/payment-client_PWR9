import { MethodType } from '@mcuc/stark/stark_pb';
import { GetPaymentDetailReply } from '@mcuc/stark/vision_pb';
import { Box, makeStyles, Theme } from '@material-ui/core';
import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { t } from 'i18next';

import ImageReceipt from 'components/ImageReceipt';
import Typography, { TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';

const useStyles = makeStyles<Theme>((theme) => ({
  form: {
    marginTop: theme.spacing(1),
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
  return (
    <Box>
      <Box mb={0.5}>
        <Typography variant={TypoVariants.body2}>{title}</Typography>
      </Box>
      <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
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

  const isTelco = payment.payment.method === MethodType.P;
  const isCrypto = payment.payment.method === MethodType.C;

  return (
    <>
      <Box className={classes.form}>
        {!(isTelco || isCrypto) && (
          <>
            <FormControl title={t('Receipt photo')} text={<ImageReceipt imageUrl={formFields.photo?.fullUrl} />} />
            <FormControl title={t('TxID')} text={formFields.txId} />
          </>
        )}
        <FormControl title={t('Handler note')} text={formFields.note} />
      </Box>
    </>
  );
};

export default ReviewInfoForm;
