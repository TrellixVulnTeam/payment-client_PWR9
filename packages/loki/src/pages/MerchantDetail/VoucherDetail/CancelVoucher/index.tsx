import { t } from 'i18next';
import { CancelVoucherRequest, Voucher } from '@mcuc/natasha/natasha_pb';

import _capitalize from 'lodash-es/capitalize';
import _get from 'lodash-es/get';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Trans } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectVoucher } from 'redux/features/vouchers/slice';
import { cancelVoucherThunk, getVoucherThunk } from 'redux/features/vouchers/thunks';
import { useAppDispatch } from 'redux/store';

import AlopayDialog from 'components/Dialog';
import FormData from 'components/Form';
import Alert from 'components/StyleGuide/Alert';
import Box from 'components/StyleGuide/Box';
import Grid from 'components/StyleGuide/Grid';
import Icon from 'components/StyleGuide/Icon';
import Button, { ButtonSizes, ButtonVariants } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { FormFields, FormTypes } from 'components/Form/types';
import { Warning } from 'assets/icons/ILT';
import styles from './styles.module.scss';

interface Props {}

type UseFormValues = {
  note: string;
};

const defaultValues = {
  note: '',
};

const CancelVoucher = (props: Props) => {
  const dispatch = useAppDispatch();
  const { voucherId } = useParams<{ voucherId: string }>();
  const [open, showModal] = useState(false);
  const [msgError, setMsgError] = useState(null);
  const voucher: Voucher.AsObject = useSelector(selectVoucher);

  function handleToggleModal() {
    showModal(!open);
  }

  const methods = useForm<UseFormValues>({
    defaultValues,
  });
  const { handleSubmit, reset } = methods;

  const fields: FormFields[] = [
    {
      name: 'note',
      label: t('Note'),
      type: FormTypes.TEXT_AREA,
      maxLength: 255,
      placeholder: t('Type your note here'),
      rules: {},
      width: { xs: 12 },
      rows: 5,
    },
  ];

  async function handleSubmitForm(data: UseFormValues) {
    const payload: CancelVoucherRequest.AsObject = {
      id: voucher.id,
      // paymentId: voucher.id,
      note: data.note,
    };
    const res = await dispatch(cancelVoucherThunk(payload));
    const response = _get(res, 'payload.response');

    if (response) {
      dispatch(getVoucherThunk({ id: +voucherId }));
      showModal(false);
    } else {
      console.log('something when wrong with data', data);
      setMsgError(_get(res, 'payload.error.message'));
    }
    reset();
  }

  return (
    <>
      <Button variant={ButtonVariants.secondary} onClick={handleToggleModal}>
        {t('Cancel')}
      </Button>
      {open && (
        <AlopayDialog
          maxWidth="sm"
          preventClose={methods.formState.isDirty}
          title={
            <Grid container spacing={4} alignItem="center">
              <Grid item xs="auto">
                <Icon className={styles['icon']} component={Warning} />
              </Grid>
              <Grid item xs="auto">
                <Typography weight={TypoWeights.bold} variant={TypoVariants.head2}>
                  {t('Cancel Payment Voucher')}
                </Typography>
              </Grid>
            </Grid>
          }
          fullWidth
          open={open}
          onClose={handleToggleModal}
          errorMessage={msgError}
          actions={
            <Grid container direction="column" spacing={4}>
              <Grid item>
                <Button size={ButtonSizes.lg} variant={ButtonVariants.danger} onClick={handleSubmit(handleSubmitForm)}>
                  {t('Confirm')}
                </Button>
              </Grid>
              <Grid item>
                <Button size={ButtonSizes.lg} variant={ButtonVariants.secondary} onClick={handleToggleModal}>
                  {t('Cancel')}
                </Button>
              </Grid>
            </Grid>
          }
        >
          <Grid container direction="column" spacing={6}>
            <Grid item>
              <Typography variant={TypoVariants.body1} type={TypoTypes.sub}>
                <Trans
                  i18nKey="You are going to cancel Payment Voucher ID <b>{{id}}</b>. Are you certain to continue?"
                  values={{
                    id: voucherId,
                  }}
                  components={{
                    b: (
                      <Typography variant={TypoVariants.body1} weight={TypoWeights.bold} component="span"></Typography>
                    ),
                  }}
                />
              </Typography>
            </Grid>
            <Grid item>
              <FormData methods={methods} fields={fields} />
            </Grid>
            {/* row */}
            {msgError && (
              <Grid item>
                <Box pb={1}>
                  <Alert severity="error">
                    <Grid container direction="column" spacing={1}>
                      <Grid item>{_capitalize(msgError)}</Grid>
                    </Grid>
                  </Alert>
                </Box>
              </Grid>
            )}
            {/* row */}
          </Grid>
        </AlopayDialog>
      )}
    </>
  );
};

export default CancelVoucher;
