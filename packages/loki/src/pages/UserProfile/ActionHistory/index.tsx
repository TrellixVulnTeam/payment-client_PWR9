import { Log } from '@greyhole/mylog/mylog_pb';
import { t } from 'i18next';
import React, { useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { getMeLogs } from 'redux/features/logs/thunk';
import { selectActionEntities } from 'redux/features/action/slice';
import { selectResourceEntities } from 'redux/features/resource/slice';
import { StatusEnum } from 'redux/constant';
import {
  changePage,
  changePageSize,
  resetLogs,
  selectLogPagination,
  selectLogs,
  selectLogStatus,
} from 'redux/features/logs/slice';

import AlopayTable from 'components/AlopayTable';
import LayoutPaper from 'components/Layout/LayoutPaper';
import { DateFormat } from 'components/Table/lib';
import { PREFIX_ACTION_LOG, PREFIX_RESOURCE_LOG } from 'utils/constant/user';
import { Trans } from 'react-i18next';

const ActionHistory: React.FC = () => {
  const dispatch = useAppDispatch();

  const actionEntities = useAppSelector(selectActionEntities);
  const resourceEntities = useAppSelector(selectResourceEntities);
  const logs = useAppSelector(selectLogs);
  const logPagination = useAppSelector(selectLogPagination);
  const logStatus = useAppSelector(selectLogStatus);

  useEffect(() => {
    return () => {
      dispatch(resetLogs());
    };
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      dispatch(
        getMeLogs({
          limit: logPagination.pageSize,
          cursor: logPagination.cursor,
        }),
      );
    })();
  }, [dispatch, logPagination.cursor, logPagination.pageSize]);

  const handleChangePageSize = (pageSize: number) => {
    if (pageSize !== logPagination.pageSize) {
      dispatch(
        changePageSize({
          pageSize: +pageSize,
        }),
      );
    }
  };

  const handleChangePage = (page: number) => {
    if (page !== logPagination.page) {
      dispatch(
        changePage({
          page: +page,
        }),
      );
    }
  };

  const columns = useMemo(
    () => [
      {
        Header: t('Date & time'),
        accessor: (row: Log.AsObject) => <DateFormat date={row.createdAt} />,
      },
      {
        Header: t('Action'),
        accessor: (row: Log.AsObject) => {
          if (!row.actionId && !row.resourceId) return <>-</>;
          return (
            <Trans
              i18nKey="ACTION_LOG_PATTERN"
              values={{
                action: t(`${PREFIX_ACTION_LOG}${actionEntities[row.actionId]?.name}`),
                resource: t(`${PREFIX_RESOURCE_LOG}${resourceEntities[row.resourceId]?.name}`),
              }}
              components={{
                b: <strong></strong>,
              }}
            />
          );
        },
      },
    ],
    [actionEntities, resourceEntities],
  );

  return (
    <LayoutPaper header={t('Action history')}>
      <AlopayTable
        columns={columns}
        loading={logStatus === StatusEnum.LOADING}
        data={logs}
        pagination={{
          current: logPagination.page,
          pageSize: logPagination.pageSize,
          totalRecord: logPagination.totalRecord,
          onChangePage: handleChangePage,
          onChangePageSize: handleChangePageSize,
        }}
      />
    </LayoutPaper>
  );
};

export default React.memo(ActionHistory);
