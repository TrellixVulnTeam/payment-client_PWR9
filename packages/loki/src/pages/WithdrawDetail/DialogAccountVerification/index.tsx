import { t } from 'i18next';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { GetPaymentDetailReply } from '@mcuc/stark/vision_pb';

import { verifyMerchantUserBankAccountThunk } from 'redux/features/payments/thunks';
import FormData from 'components/Form';
import AllowedTo from 'components/AllowedTo';
import AlopayDialog from 'components/Dialog';
import Button, { ButtonSizes, ButtonVariants } from 'components/StyleGuide/Button';
import { FormFields, FormTypes } from 'components/Form/types';
import { getBank, getPermissionForRejectWithdraw } from 'utils/constant/payment';
import { StatusEnum } from 'redux/constant';
import { useAppDispatch } from 'redux/store';
import useErrorMessage from 'hooks/useErrorMessage';
import { sleep } from 'utils/common';

type DialogApproveProps = {
  payment: GetPaymentDetailReply.AsObject;
  onClose: () => void;
  onVerification: (isVerified: boolean) => void;
  onOpenRefusedDialog: () => void;
};

type FormValues = {
  payeeProvider: string;
  payeeAccount: string;
  payeeName: string;
};

const DialogAccountVerification: React.FunctionComponent<DialogApproveProps> = ({
  payment,
  onClose,
  onVerification,
  onOpenRefusedDialog,
}) => {
  const dispatch = useAppDispatch();

  const { errorMessage, setError } = useErrorMessage();

  const performReject = getPermissionForRejectWithdraw(payment.payment?.method);

  const [statusLoading, setStatusLoading] = useState(StatusEnum.IDLE);
  const methods = useForm<FormValues>({
    defaultValues: {
      payeeProvider: getBank(payment.paymentDetail.banking?.merchantUserBankName).name,
      payeeAccount: payment.paymentDetail.banking?.merchantUserAccountNumber,
      payeeName: payment.paymentDetail.banking?.merchantUserAccountName,
    },
  });

  const { handleSubmit } = methods;

  const handleVerification = async () => {
    if (payment) {
      setStatusLoading(StatusEnum.LOADING);
      await sleep(500);
      const { response, error } = await dispatch(
        verifyMerchantUserBankAccountThunk({
          accountName: payment.paymentDetail.banking?.merchantUserAccountName,
          accountNumber: payment.paymentDetail.banking?.merchantUserAccountNumber,
          bankName: payment.paymentDetail.banking?.merchantUserBankName,
        }),
      ).unwrap();
      if (response) {
        onVerification(true);
        onClose();
      }
      setError(error);
      setStatusLoading(StatusEnum.IDLE);
    }
  };

  const fields: FormFields[] = [
    {
      name: 'payeeProvider',
      label: t('Payee provider'),
      type: FormTypes.TYPOGRAPHY,
      width: { xs: 12 },
    },
    {
      name: 'payeeAccount',
      label: t('Payee account'),
      type: FormTypes.TYPOGRAPHY,
      width: { xs: 12 },
    },
    {
      name: 'payeeName',
      label: t('Payee name'),
      type: FormTypes.TYPOGRAPHY,
      width: { xs: 12 },
    },
  ];

  return (
    <AlopayDialog
      title={t('Account verification')}
      onClose={onClose}
      errorMessage={errorMessage}
      actions={
        <>
          <Button
            type="submit"
            fullWidth
            size={ButtonSizes.lg}
            variant={ButtonVariants.primary}
            loading={StatusEnum.LOADING === statusLoading}
            onClick={handleSubmit(handleVerification)}
          >
            {t('Verify')}
          </Button>
          <AllowedTo
            perform={performReject}
            renderYes={() => (
              <Button fullWidth size={ButtonSizes.lg} variant={ButtonVariants.danger} onClick={onOpenRefusedDialog}>
                {t('Reject')}
              </Button>
            )}
            renderNo={() => (
              <Button fullWidth size={ButtonSizes.lg} variant={ButtonVariants.secondary} onClick={onClose}>
                {t('Cancel')}
              </Button>
            )}
          />
        </>
      }
    >
      <FormData methods={methods} fields={fields} />
    </AlopayDialog>
  );
};

export default DialogAccountVerification;
