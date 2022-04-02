import { t } from 'i18next';
import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';

import FormTabs from 'components/Tabs';
import LayoutContainer from 'components/Layout/LayoutContainer';

import { IBreadcrumb, useBreadcrumbs } from 'components/AlopayBreadcrumbs/useBreadcrumbs';
import { isLegalPermission } from 'components/AllowedTo/utils';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';
import { PerformPermission } from 'configs/routes/permission';
import { APP_NAME } from 'utils/common';
import useAuth from 'hooks/useAuth';
import UserListTab from './UserList';
import UserLogTab from './UserLog';
import { UserManagementTab } from './constants';

const UserManagement = () => {
  const { userPermissions } = useAuth();

  const [urlParams, setUrlParams, clearUrlParams] = useUpdateUrlParams();

  const handleChangeTab = (event: React.ChangeEvent<{}>, newTab: number) => {
    clearUrlParams({
      ignoreParams: ['tab'],
    });
    setTimeout(() => {
      setUrlParams({
        tab: newTab,
      });
    }, 0);
  };

  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [
      {
        to: '/management/user-management',
        label: t('Management'),
      },
      {
        to: '',
        label: t('User management'),
        active: true,
      },
    ];
    setBreadcrumbs(breadcrumbs);
  }, [setBreadcrumbs]);

  const tabList = useMemo(() => {
    return [
      {
        label: t('User list'),
        value: UserManagementTab.UserList,
        panel: <UserListTab />,
        hidden: !isLegalPermission(PerformPermission.userManagementUserList.listUsers, userPermissions),
      },
      {
        label: t('User action log'),
        value: UserManagementTab.UserActionLog,
        panel: <UserLogTab />,
        hidden: !isLegalPermission(PerformPermission.userManagementUserActionLog.listLogs, userPermissions),
      },
    ].filter((item) => !item.hidden);
  }, [userPermissions]);

  const { tab: tabParam = tabList[0]?.value } = urlParams;

  return (
    <>
      <Helmet>
        <title>
          {t('User management')} - {APP_NAME}
        </title>
      </Helmet>
      <LayoutContainer header={t('User management')} maxWidth={false}>
        <FormTabs currentTab={+tabParam} tabList={tabList} onChange={handleChangeTab} />
      </LayoutContainer>
    </>
  );
};

export default UserManagement;
