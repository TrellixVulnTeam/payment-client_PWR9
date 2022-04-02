import { useEffect, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { t } from 'i18next';

import FormTabs from 'components/Tabs';
import LayoutContainer from 'components/Layout/LayoutContainer';
import { isLegalPermission } from 'components/AllowedTo/utils';
import { IBreadcrumb, useBreadcrumbs } from 'components/AlopayBreadcrumbs/useBreadcrumbs';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';

import useAuth from 'hooks/useAuth';
import { PerformPermission } from 'configs/routes/permission';
import { APP_NAME } from 'utils/common';

import RoleTab from './Role';
import GroupTab from './Group';
import ActionTab from './Action';
import ResourcesTab from './Resources';
import PermissionTab from './Permission';

const PermissionPage = () => {
  const { userPermissions } = useAuth();

  const [urlParams, setUrlParams] = useUpdateUrlParams();

  const handleChange = (event: React.ChangeEvent<{}>, newTab: string) => {
    setUrlParams({
      tab: newTab,
    });
  };

  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [
      {
        to: '/management/permission',
        label: t('Management'),
      },
      {
        to: '/management/permission',
        label: t('Permission'),
        active: true,
      },
    ];
    setBreadcrumbs(breadcrumbs);
  }, [setBreadcrumbs]);

  const tabList = useMemo(
    () =>
      [
        {
          label: t('Mapping'),
          value: 'mapping',
          panel: <PermissionTab />,
          hidden: !isLegalPermission(PerformPermission.permissionMapping.updateRolePermission, userPermissions),
        },
        {
          label: t('Role'),
          value: 'role',
          panel: <RoleTab />,
          hidden: !isLegalPermission(PerformPermission.permissionRole.listRoles, userPermissions),
        },
        {
          label: t('Group'),
          value: 'group',
          panel: <GroupTab />,
          hidden: !isLegalPermission(PerformPermission.permissionGroup.listGroups, userPermissions),
        },
        {
          label: t('Action'),
          value: 'action',
          panel: <ActionTab />,
          hidden: !isLegalPermission(PerformPermission.permissionAction.listActions, userPermissions),
        },
        {
          label: t('Resources'),
          value: 'resource',
          panel: <ResourcesTab />,
          hidden: !isLegalPermission(PerformPermission.permissionResource.listResources, userPermissions),
        },
      ].filter((item) => !item.hidden),
    [userPermissions],
  );

  const { tab: tabParam = tabList[0]?.value } = urlParams;

  return (
    <>
      <Helmet>
        <title>
          {t('Role Config')} - {APP_NAME}
        </title>
      </Helmet>
      <LayoutContainer header={t('Permission')} maxWidth={false}>
        <FormTabs currentTab={tabParam} tabList={tabList} onChange={handleChange} />
      </LayoutContainer>
    </>
  );
};

export default PermissionPage;
