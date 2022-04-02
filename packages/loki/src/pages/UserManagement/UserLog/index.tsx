import React, { useMemo, useEffect, useState, useRef } from 'react';
import { t } from 'i18next';
import { Log } from '@greyhole/mylog/mylog_pb';
import { Trans } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { StatusEnum } from 'redux/constant';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { selectRoleEntities } from 'redux/features/role/slice';
import { selectGroupEntities } from 'redux/features/group/slice';
import { getListRolesThunk } from 'redux/features/role/thunks';
import { getListGroupThunk } from 'redux/features/group/thunks';
import { getListLogsThunk } from 'redux/features/logs/thunk';
import { listUsersThunk } from 'redux/features/users/thunks';
import { selectActionEntities } from 'redux/features/action/slice';
import { getListActionsThunk } from 'redux/features/action/thunks';
import { getListResourcesThunk } from 'redux/features/resource/thunks';
import { selectResourceEntities } from 'redux/features/resource/slice';
import { changePage, changePageSize, resetLogs, selectLogPagination, selectLogs, selectLogState } from 'redux/features/logs/slice';

import FilterBar from 'components/FilterBar';
import DateRange from 'components/DateRange';
import Grid from 'components/StyleGuide/Grid';
import Icon from 'components/StyleGuide/Icon';
import Input from 'components/StyleGuide/Input';
import AlopayTable from 'components/AlopayTable';
import InputAdornment from 'components/StyleGuide/InputAdornment';
import MultipleSelect from 'components/StyleGuide/MultipleSelect';
import { SelectVariants } from 'components/StyleGuide/SelectInput/types';
import { AvatarAndUsername, DateFormat } from 'components/Table/lib';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';

import _debounce from 'lodash-es/debounce';
import useUsersMap from 'hooks/useUsersMap';
import useCheckbox from 'hooks/useCheckbox';

import { formatOptions } from 'utils/common';
import { formatTimeStampToSeconds } from 'utils/date';
import { capitalizeFirstLetter } from 'utils/common/string';
import { Search } from 'assets/icons/ILT';
import { PREFIX_ACTION_LOG, PREFIX_RESOURCE_LOG } from 'utils/constant/user';

const UserActionLog = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const logState = useAppSelector(selectLogState);
  const logs = useAppSelector(selectLogs);
  const pagination = useAppSelector(selectLogPagination);
  const resourceEntities = useAppSelector(selectResourceEntities);
  const actionEntities = useAppSelector(selectActionEntities);
  const roleEntities = useAppSelector(selectRoleEntities);
  const groupEntities = useAppSelector(selectGroupEntities);

  const userLogIds = useMemo(() => Object.values(logState.entities).map((item) => item.userId), [logState.entities]);

  const { status: usersMapStatus, usersMap } = useUsersMap(userLogIds);

  const [urlParams, setUrlParams, clearUrlParams] = useUpdateUrlParams();

  const {
    role_ids: roleIdsParams,
    group_ids: groupIdsParam,
    startDate: startDateParam,
    endDate: endDateParam,
    keyword: keywordParam,
  } = urlParams;

  const defaultRoleIds = roleIdsParams ? roleIdsParams.split(',') : [];
  const defaultGroupIds = groupIdsParam ? groupIdsParam.split(',') : [];

  const roleOptions = useMemo(
    () => formatOptions(Object.values(roleEntities), { name: 'name', value: 'id', valueType: 'string' }),
    [roleEntities],
  );

  const [keyword, setKeyword] = useState(keywordParam || '');

  const handleSelectRoles = (roleIds = []) => {
    setUrlParams({ role_ids: roleIds.join(',') });
  };
  const {
    selected: selectedRoles,
    onChange: onChangeRoles,
    unselectAll: unselectAllRoles,
  } = useCheckbox(
    defaultRoleIds,
    Object.values(roleEntities).map((item) => item.id.toString()),
    handleSelectRoles,
  );

  const groupOptions = useMemo(
    () => formatOptions(Object.values(groupEntities), { name: 'name', value: 'id', valueType: 'string' }),
    [groupEntities],
  );
  const handleSelectGroups = (groupIds = []) => {
    setUrlParams({ group_ids: groupIds.join(',') });
  };
  const {
    selected: selectedGroups,
    onChange: onChangeGroups,
    unselectAll: unselectAllGroups,
  } = useCheckbox(
    defaultGroupIds,
    Object.values(groupEntities).map((item) => item.id.toString()),
    handleSelectGroups,
  );

  useEffect(() => {
    return () => {
      dispatch(resetLogs());
    };
  }, [dispatch]);

  useEffect(() => {
    (async () => {
      let usersListForSearch = [];
      if (keywordParam) {
        const { response } = await dispatch(
          listUsersThunk({
            cursor: 0,
            limit: 100,
            query: keywordParam,
            statusesList: [],
            roleIdsList: selectedRoles.map(Number),
            groupIdsList: selectedGroups.map(Number),
            email: undefined,
            phoneNumber: undefined,
            userId: undefined,
            username: undefined,
          }),
        ).unwrap();

        if (response) {
          usersListForSearch = response.usersList.map((item) => item.userId);
        }
      }

      dispatch(
        getListLogsThunk({
          groupsIdsList: selectedGroups.map(Number),
          roleIdsList: selectedRoles.map(Number),
          userIdsList: keywordParam ? (usersListForSearch.length ? usersListForSearch : [-1]) : [],
          limit: pagination.pageSize,
          cursor: pagination.cursor,
          from: startDateParam
            ? {
                seconds: formatTimeStampToSeconds(startDateParam),
                nanos: 0,
              }
            : undefined,
          to: endDateParam
            ? {
                seconds: formatTimeStampToSeconds(endDateParam || 0),
                nanos: 0,
              }
            : undefined,
        }),
      );
    })();
  }, [
    dispatch,
    keywordParam,
    selectedRoles,
    selectedGroups,
    startDateParam,
    endDateParam,
    pagination.pageSize,
    pagination.cursor,
  ]);

  useEffect(() => {
    dispatch(getListRolesThunk());
    dispatch(getListGroupThunk());
    dispatch(getListActionsThunk());
    dispatch(getListResourcesThunk());
  }, [dispatch]);

  const handleChangePageSize = (pageSize: number) => {
    if (pageSize !== pagination.pageSize) {
      dispatch(
        changePageSize({
          pageSize: +pageSize,
        }),
      );
    }
  };

  const handleChangePage = (page: number) => {
    if (page !== pagination.page) {
      dispatch(
        changePage({
          page: +page,
        }),
      );
    }
  };

  const handleClearFilter = () => {
    unselectAllRoles();
    unselectAllGroups();
    // require call last
    clearUrlParams({
      ignoreParams: ['tab'],
    });
  };

  const submitKeyword = () => {
    setUrlParams({ keyword });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      submitKeyword();
    }
  };

  const handleChangeKeyword = (e) => {
    const { value } = e.target;
    setKeyword(value);
    debounceChangeKeywordParam(value);
  };

  const debounceChangeKeywordParam = useRef(
    _debounce((value = '') => {
      setUrlParams({
        keyword: value,
      });
    }, 300),
  ).current;

  const columns = useMemo(
    () => [
      {
        Header: t('Username'),
        accessor: (row: Log.AsObject) => (
          <AvatarAndUsername
            name={usersMap[row.userId]?.username}
            avatar={usersMap[row.userId]?.metadata.picture}
            loading={usersMapStatus !== StatusEnum.SUCCEEDED}
            configSkeleton={{
              width: 80,
              height: 24,
            }}
          />
        ),
      },
      {
        Header: t('Full name'),
        accessor: (row: Log.AsObject) => capitalizeFirstLetter(usersMap[row.userId]?.metadata.fullName || '-'),
      },
      {
        Header: t('Group'),
        accessor: (row: Log.AsObject) => groupEntities[row.groupIdsList[0]]?.name || '-',
      },
      {
        Header: t('Role'),
        accessor: (row: Log.AsObject) => roleEntities[row.roleIdsList[0]]?.name || '-',
      },
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
    [groupEntities, roleEntities, actionEntities, resourceEntities, usersMap, usersMapStatus],
  );

  const showReset = startDateParam || endDateParam || selectedRoles.length || selectedGroups.length;

  return (
    <Grid container direction="column" spacing={6}>
      <Grid item xs={12}>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs={true}>
            <FilterBar
              showReset={!!showReset}
              onClear={handleClearFilter}
              className="custom-item"
              list={[
                {
                  width: {},
                  component: (
                    <Input
                      value={keyword}
                      placeholder={t('Search by {{key}}', {
                        key: `${t('Full name')} ${t('Or')} ${t('Username')}`.toLowerCase(),
                      })}
                      afterInput={
                        <InputAdornment onClick={submitKeyword}>
                          <Icon component={Search} />
                        </InputAdornment>
                      }
                      onChange={handleChangeKeyword}
                      onKeyDown={handleKeyDown}
                      className="custom-search"
                    />
                  ),
                },
                {
                  width: {},
                  component: (
                    <MultipleSelect
                      variant={SelectVariants.selected}
                      placeholder={t('Groups')}
                      selected={selectedGroups}
                      onChange={onChangeGroups}
                      onClear={unselectAllGroups}
                      options={groupOptions}
                      className="custom-fit-content"
                    />
                  ),
                },
                {
                  width: {},
                  component: (
                    <MultipleSelect
                      variant={SelectVariants.selected}
                      placeholder={t('Roles')}
                      selected={selectedRoles}
                      onChange={onChangeRoles}
                      onClear={unselectAllRoles}
                      options={roleOptions}
                      className="custom-fit-content"
                    />
                  ),
                },
                {
                  width: { xs: 'auto' },
                  component: <DateRange />,
                },
              ]}
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <AlopayTable
          columns={columns}
          loading={[logState.status].includes(StatusEnum.LOADING)}
          data={logs}
          pagination={{
            totalRecord: pagination.totalRecord,
            current: pagination.page,
            pageSize: pagination.pageSize,
            onChangePage: handleChangePage,
            onChangePageSize: handleChangePageSize,
          }}
          tableRowProps={{
            onClick: (row) => {
              history.push(`/user-info/${row.userId}`);
            },
          }}
        />
      </Grid>
    </Grid>
  );
};

export default React.memo(UserActionLog);
