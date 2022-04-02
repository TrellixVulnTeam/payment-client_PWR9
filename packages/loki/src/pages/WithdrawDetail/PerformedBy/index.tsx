import { MethodType, Status } from '@mcuc/stark/stark_pb';
import { GetPaymentDetailReply } from '@mcuc/stark/vision_pb';
import { t } from 'i18next';
import React from 'react';

import { useAppSelector } from 'redux/store';
import { selectUsersMap } from 'redux/features/common/slice';
import { getUserPerformed } from 'utils/constant/payment';
import { selectMerchantEntities } from 'redux/features/merchants/slice';
import FormInfo from 'components/FormInfo';
import LayoutPaper from 'components/Layout/LayoutPaper';


type TopUpPerformedProps = {
  payment: GetPaymentDetailReply.AsObject;
};

const WithdrawPerformed: React.FunctionComponent<TopUpPerformedProps> = ({ payment }) => {
  const usersMap = useAppSelector(selectUsersMap);
  const merchantsMap = useAppSelector(selectMerchantEntities);

  const { approved, refused, submitted } = React.useMemo(
    () => ({
      approved: payment.revisionsList.find((revision) => revision.status === Status.APPROVED),
      refused: payment.revisionsList.find((revision) => revision.status === Status.REJECTING),
      submitted: payment.revisionsList.find((revision) => revision.status === Status.SUBMITTED),
    }),
    [payment.revisionsList],
  );

  const contentsBankApprove = [
    {
      title: t('Approved by'),
      value: getUserPerformed(approved?.createdBy, merchantsMap, usersMap)?.name || '-',
    },
    {
      title: t('Approval note'),
      value: t(approved?.note) || '-',
    },
    {
      title: t('Handled by'),
      value: getUserPerformed(submitted?.createdBy, merchantsMap, usersMap)?.name || '-',
    },
    {
      title: t('Handler note'),
      value: t(submitted?.note) || '-',
    },
  ];

  const contentsTelcoApprove = [
    {
      title: t('Approved by'),
      value: getUserPerformed(approved?.createdBy, merchantsMap, usersMap)?.name || '-',
    },
    {
      title: t('Approval note'),
      value: t(approved?.note) || '-',
    },
    {
      title: t('Handled by'),
      value: getUserPerformed(submitted?.createdBy, merchantsMap, usersMap)?.name || '-',
    },
    {
      title: t('Handler note'),
      value: t(submitted?.note) || '-',
    },
  ];

  const contentsCryptoApprove = [
    {
      title: t('Approved by'),
      value: getUserPerformed(approved?.createdBy, merchantsMap, usersMap)?.name || '-',
    },
    {
      title: t('Approval note'),
      value: t(approved?.note) || '-',
    },
    {
      title: t('Payment by'),
      value: getUserPerformed(submitted?.createdBy, merchantsMap, usersMap)?.name || '-',
    },
    {
      title: t('Payment note'),
      value: t(submitted?.note) || '-',
    },
  ];

  const contentsRejected = [
    {
      title: t('Rejected by'),
      value: getUserPerformed(refused?.createdBy, merchantsMap, usersMap)?.name || '-',
    },
    {
      title: t('Rejected reasons'),
      value: t(refused?.note) || '-',
    },
  ];

  return (
    <LayoutPaper header={t('Performed by')}>
      {payment.payment.status === Status.REJECTED ? (
        <FormInfo contents={contentsRejected} />
      ) : (
        <>
          {/* Bank Transfer */}
          {payment.payment.method === MethodType.T && <FormInfo contents={contentsBankApprove} />}

          {/* Phone Telco */}
          {payment.payment.method === MethodType.P && <FormInfo contents={contentsTelcoApprove} />}

          {/* Crypto */}
          {payment.payment.method === MethodType.C && <FormInfo contents={contentsCryptoApprove} />}
        </>
      )}
    </LayoutPaper>
  );
};

export default WithdrawPerformed;
