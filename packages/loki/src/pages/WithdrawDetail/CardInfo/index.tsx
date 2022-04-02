import React from 'react';
import { t } from 'i18next';
import { GetPaymentDetailReply } from '@mcuc/stark/vision_pb';
import FormInfo from 'components/FormInfo';
import LayoutPaper from 'components/Layout/LayoutPaper';
import { formatDateTime } from 'utils/date';

type CardInfoProps = {
  payment: GetPaymentDetailReply.AsObject;
};

const CardInfo: React.FunctionComponent<CardInfoProps> = ({ payment }) => {
  const contents = [
    {
      title: t('Serial number'),
      value: `${payment.paymentDetail?.telco?.serialNumber}`,
    },
    {
      title: t('PIN'),
      value: `${payment.paymentDetail?.telco?.cardId}`,
    },
    {
      title: t('3rd party'),
      value: `${payment.paymentDetail?.telco?.provider}` || '-',
    },
    {
      title: t('Get date'),
      value: formatDateTime(payment.paymentDetail?.telco?.getCardAt.seconds * 1000) || '-',
    },
  ];

  return (
    <LayoutPaper header="Card info">
      <FormInfo contents={contents} />
    </LayoutPaper>
  );
};

export default CardInfo;
