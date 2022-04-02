import { GetPaymentDetailReply } from '@mcuc/stark/vision_pb';
import { Status } from '@mcuc/stark/stark_pb';
import { t } from 'i18next';
import React, { useMemo } from 'react';
import Stepper from 'components/Stepper';
import LayoutPaper from 'components/Layout/LayoutPaper';
import Typography, { TypoVariants } from 'components/StyleGuide/Typography';

type TopUpProcessProps = {
  payment: GetPaymentDetailReply.AsObject;
};

const getStepFromStatus = (status: Status) => {
  switch (status) {
    case Status.CREATED:
      return {
        index: 0,
        active: true,
        completed: true,
        error: false,
      };
    case Status.APPROVE_FAILED:
    case Status.APPROVED:
      return {
        index: 1,
        active: true,
        completed: true,
        error: status === Status.APPROVE_FAILED,
      };
    case Status.COMPLETED:
    case Status.SUBMIT_FAILED:
      return {
        index: 2,
        active: true,
        completed: true,
        error: status === Status.SUBMIT_FAILED,
      };
    default:
      return {
        index: 0,
        active: false,
        completed: false,
        error: false,
      };
  }
};

const TopUpProcess: React.FunctionComponent<TopUpProcessProps> = ({ payment }) => {
  const STEPS_APPROVED = useMemo(
    () => [
      {
        label: t('Created'),
        dateTime: payment.revisionsList.find((item) => item.status === Status.CREATED)?.createdAt,
      },
      {
        label: t('Approved'),
        dateTime: payment.revisionsList.find((item) => item.status === Status.APPROVED)?.createdAt,
      },
      {
        label: t('Completed'),
        dateTime: payment.revisionsList.find((item) => item.status === Status.COMPLETED)?.createdAt,
      },
    ],
    [payment.revisionsList],
  );

  const STEPS_REFUSED = useMemo(
    () => [
      {
        label: t('Created'),
        dateTime: payment.revisionsList.find((item) => item.status === Status.CREATED)?.createdAt,
      },
      {
        label: t('Rejected'),
        dateTime: payment.revisionsList.find((item) => item.status === Status.REJECTED)?.createdAt,
      },
    ],
    [payment.revisionsList],
  );

  const STEPS_CANCELED = useMemo(
    () => [
      {
        label: t('Created'),
        dateTime: payment.revisionsList.find((item) => item.status === Status.CREATED)?.createdAt,
      },
      {
        label: t('Canceled'),
        dateTime: payment.revisionsList.find((item) => item.status === Status.CANCELED)?.createdAt,
      },
    ],
    [payment.revisionsList],
  );

  return (
    <LayoutPaper header={t('Process')}>
      <Typography variant={TypoVariants.head3}>
        <Stepper
          activeStep={getStepFromStatus(payment.payment.status)}
          status={payment.payment.status}
          stepsApproved={STEPS_APPROVED}
          stepsRefused={STEPS_REFUSED}
          stepsCanceled={STEPS_CANCELED}
        />
      </Typography>
    </LayoutPaper>
  );
};

export default TopUpProcess;
