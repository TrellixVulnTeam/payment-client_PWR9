import { Revision, Status } from '@mcuc/stark/stark_pb';
import { GetPaymentDetailReply } from '@mcuc/stark/vision_pb';
import { t } from 'i18next';
import React, { useMemo } from 'react';

import { useAppSelector } from 'redux/store';
import { selectUsersMap } from 'redux/features/common/slice';

import AlopayTable from 'components/AlopayTable';
import LayoutPaper from 'components/Layout/LayoutPaper';
import { AvatarAndUsername, DateFormat } from 'components/Table/lib';
import { capitalizeFirstLetter } from 'utils/common/string';
import { selectMerchantEntities } from 'redux/features/merchants/slice';
import { getUserPerformed } from 'utils/constant/payment';

type ActionHistoryProps = {
  payment: GetPaymentDetailReply.AsObject;
};

const WithDrawActionHistory: React.FunctionComponent<ActionHistoryProps> = ({ payment }) => {
  const usersMap = useAppSelector(selectUsersMap);
  const merchantMap = useAppSelector(selectMerchantEntities);

  const columns = [
    {
      Header: t('Date & time'),
      accessor: (row: Revision.AsObject) => <DateFormat date={row.createdAt} />,
    },
    {
      Header: t('Performed by'),
      accessor: (row: Revision.AsObject) => {
        const isMerchantCreated = row.status === Status.CREATED;
        if (isMerchantCreated) {
          return (
            <AvatarAndUsername
              name={isMerchantCreated ? t('Merchant') : usersMap[row.createdBy]?.metadata.fullName}
              avatar={usersMap[row.createdBy]?.metadata.picture}
            />
          );
        } else {
          const user = getUserPerformed(row.createdBy, merchantMap, usersMap);
          return <AvatarAndUsername name={user?.name} avatar={user?.imageUrl} />;
        }
      },
    },
    {
      Header: t('Action'),
      accessor: (row: Revision.AsObject) => (row.note ? t(capitalizeFirstLetter(row.note)) : '-'),
    },
  ];

  const data = useMemo(() => [...payment.revisionsList].sort((a, b) => b.id - a.id), [payment.revisionsList]);

  return (
    <LayoutPaper header={t('Action history')}>
      <AlopayTable columns={columns} data={data} />
    </LayoutPaper>
  );
};

export default WithDrawActionHistory;
