import { GetPaymentDetailReply } from '@mcuc/stark/vision_pb';
import { Status } from '@mcuc/stark/stark_pb';
import { t } from 'i18next';
import _get from 'lodash-es/get';
import React from 'react';

import { useAppSelector } from 'redux/store';
import { selectUsersMap } from 'redux/features/common/slice';
import { selectMerchantEntities } from 'redux/features/merchants/slice';
import FormInfo from 'components/FormInfo';
import ImageReceipt from 'components/ImageReceipt';
import LayoutPaper from 'components/Layout/LayoutPaper';
import { getListCheckPaymentMethod, getUserPerformed } from 'utils/constant/payment';

type TopUpPerformedProps = {
  payment: GetPaymentDetailReply.AsObject;
};

const TopUpPerformed: React.FunctionComponent<TopUpPerformedProps> = ({ payment }) => {
  const usersMap = useAppSelector(selectUsersMap);
  const merchantsMap = useAppSelector(selectMerchantEntities);

  const { isTelco, isCrypto } = getListCheckPaymentMethod(payment.payment?.method);

  const { creator, handler } = React.useMemo(
    () => ({
      creator: payment.revisionsList.find((revision) => revision.status === Status.CREATED),
      handler: payment.revisionsList.find((revision) => [Status.APPROVED, Status.REJECTING].includes(revision.status)),
    }),
    [payment.revisionsList],
  );

  const contents = [
    {
      title: t('Created by'),
      value: isTelco ? t('Merchant') : getUserPerformed(creator.createdBy, merchantsMap, usersMap)?.name || '-',
    },
    {
      title: t('Created note'),
      value: isTelco ? t('Created') : t(creator.note) || '-',
    },
    {
      title: t('Handled by'),
      value: getUserPerformed(handler?.createdBy, merchantsMap, usersMap)?.name || '-',
    },
    {
      title: t('Handler note'),
      value: t(handler?.note) || '-',
    },
    {
      title: t('Receipt attachment'),
      value: <ImageReceipt imageUrl={_get(payment, 'paymentDetail.banking.imageUrl')} />,
      hidden: isTelco || isCrypto,
    },
    {
      title: t('TxID'),
      value: _get(payment, 'paymentDetail.banking.txId'),
      hidden: isTelco || isCrypto,
    },
  ].filter((item) => !item.hidden);

  return (
    <LayoutPaper header={t('Performed by')}>
      <FormInfo contents={contents} />
    </LayoutPaper>
  );
};

export default TopUpPerformed;
