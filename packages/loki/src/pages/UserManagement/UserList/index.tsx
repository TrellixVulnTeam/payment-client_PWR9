import _debounce from 'lodash-es/debounce';
import { t } from 'i18next';
import { useMemo, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { StatusEnum } from 'redux/constant';
import { useAppSelector } from 'redux/store';
import {
  changePage,
  changePageSize,
  selectUserPagination,
  selectUsers,
  selectUserState,
} from 'redux/features/users/slice';
import { selectRoleEntities } from 'redux/features/role/slice';
import { selectGroupEntities } from 'redux/features/group/slice';
import { getListRolesThunk } from 'redux/features/role/thunks';
import { getListGroupThunk } from 'redux/features/group/thunks';
import { listUsersThunk } from 'redux/features/users/thunks';
import { UserCustom } from 'redux/features/users/types';

import AllowedTo from 'components/AllowedTo';
import FilterBar from 'components/FilterBar';
import Grid from 'components/StyleGuide/Grid';
import Icon from 'components/StyleGuide/Icon';
import Input from 'components/StyleGuide/Input';
import AlopayTable from 'components/AlopayTable';
import MultipleSelect from 'components/StyleGuide/MultipleSelect';
import InputAdornment from 'components/StyleGuide/InputAdornment';
import { SelectVariants } from 'components/StyleGuide/SelectInput/types';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';
import { AvatarAndUsername, DateFormat, Status } from 'components/Table/lib';
import { PerformPermission } from 'configs/routes/permission';
import useCheckbox from 'hooks/useCheckbox';
import { formatOptions } from 'utils/common';
import { STATUS } from 'utils/constant/status';
import { capitalizeFirstLetter } from 'utils/common/string';
import { Search } from 'assets/icons/ILT';
import CreateUser from '../CreateUser';

const UserList = () => {
  const dispatch = useDispatch();
  const history = useHistory();

  const pagination = useAppSelector(selectUserPagination);
  const roleEntities = useAppSelector(selectRoleEntities);
  const groupEntities = useAppSelector(selectGroupEntities);

  const users = useAppSelector(selectUsers);
  const usersState = useAppSelector(selectUserState);

  const [urlParams, setUrlParams, clearUrlParams] = useUpdateUrlParams();

  const {
    role_ids: roleIdsParams,
    group_ids: groupIdsParam,
    search: searchParam,
    status_ids: statusIdsParams,
  } = urlParams;

  const [searchText, setSearchText] = useState(searchParam);
  const [refreshListUsers, setRefreshListUsers] = useState({});

  const defaultStatusIds = statusIdsParams ? statusIdsParams.split(',') : [];
  const defaultRoleIds = roleIdsParams ? roleIdsParams.split(',') : [];
  const defaultGroupIds = groupIdsParam ? groupIdsParam.split(',') : [];

  const statusOptions = useMemo(() => formatOptions(STATUS, { name: 'name', value: 'value', valueType: 'string' }), []);
  const handleSelectStatus = (statusIds = []) => {
    setUrlParams({ status_ids: statusIds.join(',') });
  };

  const {
    selected: selectedStatus,
    onChange: onChangeStatus,
    unselectAll: unselectAllStatus,
  } = useCheckbox(
    defaultStatusIds,
    STATUS.map((item) => item.value.toString()),
    handleSelectStatus,
  );

  const roleOptions = useMemo(
    () => formatOptions(Object.values(roleEntities), { name: 'name', value: 'id', valueType: 'string' }),
    [roleEntities],
  );

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
    dispatch(getListRolesThunk());
    dispatch(getListGroupThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      listUsersThunk({
        cursor: pagination.cursor,
        limit: pagination.pageSize,
        query: searchParam,
        statusesList: selectedStatus.map(Number),
        roleIdsList: selectedRoles.map(Number),
        groupIdsList: selectedGroups.map(Number),
        email: undefined,
        phoneNumber: undefined,
        userId: undefined,
        username: undefined,
      }),
    );
  }, [dispatch, searchParam, refreshListUsers, pagination, selectedStatus, selectedRoles, selectedGroups]);

  const handleRefreshListUsers = () => {
    setRefreshListUsers({});
  };

  const handleChangePageSize = (pageSize: number) => {
    if (pageSize !== pagination.pageSize) {
      dispatch(
        changePageSize({
          pageSize: +pageSize,
        }),
      );
    }
  };

  // push page to query params
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
    setSearchText('');
    unselectAllRoles();
    unselectAllGroups();
    unselectAllStatus();
    // require call last
    clearUrlParams();
  };

  const [callApiSearchText] = useState(() =>
    _debounce((value = '') => {
      setUrlParams({
        search: value,
      });
    }, 300),
  );

  const handleChangeSearch = (event) => {
    setSearchText(event.target.value);
    callApiSearchText(event.target.value);
  };

  const columns = useMemo(
    () => [
      {
        Header: t('Username'),
        accessor: (row: UserCustom) => <AvatarAndUsername name={row.username} avatar={row.metadata.picture} />,
      },
      {
        Header: t('Full name'),
        accessor: (row: any) => capitalizeFirstLetter(row.metadata.fullName! || '-'),
      },
      {
        Header: t('Group'),
        accessor: (row: UserCustom) => groupEntities[row.rolesList[0]?.groupId]?.name || '-',
      },
      {
        Header: t('Role'),
        accessor: (row: UserCustom) => roleEntities[row.rolesList[0]?.roleId]?.name || '-',
      },
      {
        Header: t('Created date'),
        accessor: (row: UserCustom) => <DateFormat date={row.createdAt} />,
      },
      {
        Header: t('Last sign in'),
        accessor: (row: UserCustom) => <DateFormat date={row.lastSignedIn} />,
      },
      {
        Header: t('Status'),
        accessor: (row: UserCustom) => <Status status={row.status} />,
      },
    ],
    [groupEntities, roleEntities],
  );

  const showReset = statusIdsParams || roleIdsParams || groupIdsParam || searchText;

  return (
    <>
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
                        value={searchText}
                        onChange={handleChangeSearch}
                        placeholder={t('Search by {{key}}', {
                          key: `${t('Full name')} ${t('Or')} ${t('Username')}`.toLowerCase(),
                        })}
                        afterInput={
                          <InputAdornment>
                            <Icon component={Search} />
                          </InputAdornment>
                        }
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
                    width: {},
                    component: (
                      <MultipleSelect
                        variant={SelectVariants.selected}
                        placeholder={t('Status')}
                        selected={selectedStatus}
                        onChange={onChangeStatus}
                        onClear={unselectAllStatus}
                        options={statusOptions}
                        className="custom-fit-content"
                      />
                    ),
                  },
                ]}
              />
            </Grid>
            {/* create new  */}
            <Grid item xs="auto">
              <Grid container spacing={3}>
                <Grid item>
                  <AllowedTo perform={PerformPermission.userManagementUserList.createUser}>
                    <CreateUser onRefreshListUsers={handleRefreshListUsers} />
                  </AllowedTo>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <AlopayTable
            columns={columns}
            loading={usersState.status === StatusEnum.LOADING}
            data={users}
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
    </>
  );
};

export default UserList;
