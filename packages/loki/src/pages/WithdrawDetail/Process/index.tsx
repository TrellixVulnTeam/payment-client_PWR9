import { Status } from '@mcuc/stark/stark_pb';
import { GetPaymentDetailReply } from '@mcuc/stark/vision_pb';
import { t } from 'i18next';
import React from 'react';

import Stepper from 'components/Stepper';
import LayoutPaper from 'components/Layout/LayoutPaper';

type WithdrawProcessProps = {
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
    case Status.SUBMIT_FAILED:
    case Status.SUBMITTED:
      return {
        index: 2,
        active: true,
        completed: true,
        error: status === Status.SUBMIT_FAILED,
      };
    case Status.COMPLETED:
      return {
        index: 3,
        active: true,
        completed: true,
        error: false,
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

const WithdrawProcess: React.FunctionComponent<WithdrawProcessProps> = ({ payment }) => {
  const STEPS_APPROVED = [
    {
      label: t('Created'),
      dateTime: payment.revisionsList.find((item) => item.status === Status.CREATED)?.createdAt,
    },
    {
      label: t('Approved'),
      dateTime: payment.revisionsList.find((item) => item.status === Status.APPROVED)?.createdAt,
    },
    {
      label: t('Submitted'),
      dateTime: payment.revisionsList.find((item) => item.status === Status.SUBMITTED)?.createdAt,
    },
    {
      label: t('Completed'),
      dateTime: payment.revisionsList.find((item) => item.status === Status.COMPLETED)?.createdAt,
    },
  ];

  const STEPS_REFUSED = [
    {
      label: t('Created'),
      dateTime: payment.revisionsList.find((item) => item.status === Status.CREATED)?.createdAt,
    },
    {
      label: t('Rejected'),
      dateTime: payment.revisionsList.find((item) => item.status === Status.REJECTED)?.createdAt,
    },
  ];

  const STEPS_CANCELED = [
    {
      label: t('Created'),
      dateTime: payment.revisionsList.find((item) => item.status === Status.CREATED)?.createdAt,
    },
    {
      label: t('Canceled'),
      dateTime: payment.revisionsList.find((item) => item.status === Status.CANCELED)?.createdAt,
    },
  ];

  return (
    <LayoutPaper header={t('Process')}>
      <Stepper
        activeStep={getStepFromStatus(payment.payment.status)}
        status={payment.payment.status}
        stepsApproved={STEPS_APPROVED}
        stepsRefused={STEPS_REFUSED}
        stepsCanceled={STEPS_CANCELED}
      />
    </LayoutPaper>
  );
};

export default WithdrawProcess;
