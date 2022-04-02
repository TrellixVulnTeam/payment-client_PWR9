import { t } from 'i18next';
import { iToast } from '@ilt-core/toast';
import { UpdateRolePermissionRequest } from '@greyhole/myrole/myrole_pb';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import Icon from '@material-ui/core/Icon';
import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'redux/store';
import {
  selectRole,
  selectRoleEntities,
  selectRoleSelected,
  selectRoleState,
  unselectRole,
} from 'redux/features/role/slice';
import { selectGroups } from 'redux/features/group/slice';
import { selectResources } from 'redux/features/resource/slice';
import { getListGroupThunk } from 'redux/features/group/thunks';
import { getListActionsThunk } from 'redux/features/action/thunks';
import { getListResourcesThunk } from 'redux/features/resource/thunks';
import { getListRolesThunk, getRoleThunk, updateRolePermissionThunk } from 'redux/features/role/thunks';

import FormData from 'components/Form';
import Input from 'components/StyleGuide/Input';
import LayoutPaper from 'components/Layout/LayoutPaper';
import RouteLeavingGuard from 'components/RouteLeavingGuard';
import InputAdornment from 'components/StyleGuide/InputAdornment';
import Typography, { TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';
import { Button, ButtonSizes } from 'components/StyleGuide/Button';
import { FormFields, FormTypes } from 'components/Form/types';

import { formatOptions, sleep } from 'utils/common';
import { Search } from 'assets/icons/ILT';
import ImagePermissionRoleConfig from 'assets/images/permission_role_config.png';

import ResourcesItem from './ResourcesItem';
import DialogSettingPermission from './DialogSettingPermission';
import styles from './styles.module.scss';

type FormValues = {
  roleId: number;
  groupId: number;
};

type Props = {};

const PermissionTab: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const history = useHistory();

  const methods = useForm<FormValues>({
    defaultValues: {
      roleId: undefined,
      groupId: undefined,
    },
  });
  const { setValue, getValues, watch } = methods;

  const { roleId, groupId } = getValues();

  const watchAllFields = watch();

  const groups = useAppSelector(selectGroups);
  const resources = useAppSelector(selectResources);
  const roleEntities = useAppSelector(selectRoleEntities);
  const roleSelected = useAppSelector(selectRoleSelected);
  const { permissionsByRoleId, roleListByGroupId } = useAppSelector(selectRoleState);

  const [dialog, setDialog] = useState({
    name: '',
    value: undefined,
  });
  const [statusLoading, setStatusLoading] = useState('idle');
  const [keyword, setKeyword] = useState('');
  const [roleOptions, setRoleOptions] = useState([]);
  const [resourcesDisplay, setResourcesDisplay] = useState([]);
  const [shouldBlock, setShouldBlock] = useState(false);

  useEffect(() => {
    dispatch(getListGroupThunk());
    dispatch(getListActionsThunk());
    dispatch(getListResourcesThunk());
    dispatch(getListRolesThunk());
  }, [dispatch]);

  useEffect(() => {
    if (statusLoading === 'setting') return;
    if (resources) {
      setResourcesDisplay(resources);
    }
  }, [statusLoading, resources]);

  useEffect(() => {
    return () => {
      dispatch(unselectRole());
    };
  }, [dispatch]);

  const handleKeywordChange = (e) => {
    const { value } = e.target;
    setKeyword(value);
    if (value) {
      setResourcesDisplay(resources.filter((item) => item.name.toLowerCase().includes(keyword.toLowerCase())));
    } else {
      setResourcesDisplay(resources);
    }
  };

  const handleStartSetting = async (data: FormValues) => {
    setStatusLoading('setting');
    dispatch(
      getRoleThunk({
        id: data.roleId,
      }),
    );
    dispatch(
      selectRole({
        roleId: data.roleId,
      }),
    );
    setValue('groupId', data.groupId);
    setValue('roleId', data.roleId);
    setShouldBlock(true);
    await sleep(300);
    setStatusLoading('idle');
  };

  const handleOpenDialogConfirm = () => {
    setDialog({
      name: 'confirm',
      value: undefined,
    });
  };

  const handleCloseDialog = () => {
    setDialog({
      name: '',
      value: undefined,
    });
  };

  const handleSelectGroup = async (groupId: number) => {
    setShouldBlock(false);
    setStatusLoading('selectingGroup');

    setValue('roleId', undefined);
    setValue('groupId', groupId);

    setRoleOptions(formatOptions(roleListByGroupId[groupId], { name: 'name', value: 'id' }));
    await sleep(300);
    setStatusLoading('idle');
  };

  const handleSelectRole = (roleId: number) => {
    setShouldBlock(false);
    setValue('roleId', roleId);
  };

  const handleUpdatePermission = async () => {
    const permissionsList: UpdateRolePermissionRequest.Permission.AsObject[] = Object.entries(
      permissionsByRoleId[roleId],
    ).map(([resourceId, actionIdsList]) => ({
      resourceId: +resourceId,
      actionIdsList: actionIdsList,
    }));

    const { response } = await dispatch(
      updateRolePermissionThunk({
        groupId: groupId,
        roleId: roleId,
        permissionsList: permissionsList,
      }),
    ).unwrap();

    if (response) {
      iToast.success({
        title: t('Update successful'),
      });
    }
  };

  const groupOptions = useMemo(() => formatOptions(groups, { value: 'id', name: 'name' }), [groups]);

  const fields: FormFields[] = [
    {
      label: t('Group'),
      name: 'groupId',
      type: FormTypes.SELECT,
      width: { xs: 12 },
      placeholder: t('Select'),
      options: groupOptions,
      rules: {
        required: t('This field is required'),
      },
      onChange: handleSelectGroup,
    },
    {
      label: t('Role'),
      name: 'roleId',
      type: FormTypes.SELECT,
      width: { xs: 12 },
      placeholder: t('Select'),
      options: roleOptions,
      disabled: !watchAllFields.groupId,
      loading: statusLoading === 'selectingGroup',
      rules: {
        required: t('This field is required'),
      },
      onChange: handleSelectRole,
    },
  ];

  const isCanSetting = watchAllFields.groupId && watchAllFields.roleId;

  return (
    <>
      <RouteLeavingGuard
        when={shouldBlock}
        navigate={(path) => history.push(path)}
        shouldBlockNavigation={(location) => shouldBlock}
      />
      {/* ------------ */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <LayoutPaper header={t('Setting Permission')}>
            <FormData
              methods={methods}
              fields={fields}
              onSubmit={handleStartSetting}
              actions={
                <Box mt={1}>
                  <Button size={ButtonSizes.lg} loading={statusLoading === 'setting'} disabled={!isCanSetting}>
                    <Typography variant={TypoVariants.button1} type={TypoTypes.invert}>
                      {t('Start Setting')}
                    </Typography>
                  </Button>
                </Box>
              }
            />
          </LayoutPaper>
        </Grid>
        <Grid item container spacing={0} xs={12} md={8}>
          <LayoutPaper padding={0} className={styles['resources-paper']}>
            <>
              {!shouldBlock ? (
                <Box p={8} display="flex" flexDirection="column" alignItems="center" width="100%" height="100%">
                  <img alt="paper" src={ImagePermissionRoleConfig} />
                  <Box width="70%" mt={3} textAlign="center">
                    <Typography variant={TypoVariants.head2}>
                      {t('Select Role in order to conduct setting permission')}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <div className={styles['resources-wrapper']}>
                  <Box className={styles['resources-header']}>
                    <Typography variant={TypoVariants.head2}>
                      {t('Resource For')} {roleEntities[roleSelected]?.name}
                    </Typography>
                    <Box display="flex">
                      <Input
                        value={keyword}
                        placeholder={t('Find Resources')}
                        afterInput={
                          <InputAdornment>
                            <Icon className={styles['search-icon']} component={Search} />
                          </InputAdornment>
                        }
                        onChange={handleKeywordChange}
                      />
                      <Box ml={1}>
                        <Button onClick={handleOpenDialogConfirm}>
                          <Typography variant={TypoVariants.button1} type={TypoTypes.invert}>
                            {t('Save')}
                          </Typography>
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                  <Box className={styles['resources-content']}>
                    {statusLoading === 'setting' ? (
                      <Box width="100%" display="flex" justifyContent="center">
                        <Typography variant={TypoVariants.head3}>{t('Loading...')}</Typography>
                      </Box>
                    ) : (
                      <Grid container xs={12}>
                        {resourcesDisplay.length ? (
                          resourcesDisplay.map((item) => (
                            <Grid key={item.id} item xs={12} style={{ marginBottom: 16 }}>
                              <ResourcesItem resource={item} />
                            </Grid>
                          ))
                        ) : (
                          <Grid item xs={12}>
                            <Box width="100%" display="flex" justifyContent="center">
                              <Typography variant={TypoVariants.head3}>{t('No data')}</Typography>
                            </Box>
                          </Grid>
                        )}
                      </Grid>
                    )}
                  </Box>
                </div>
              )}
            </>
          </LayoutPaper>
        </Grid>
      </Grid>
      {dialog.name === 'confirm' && (
        <DialogSettingPermission onClose={handleCloseDialog} onConfirm={handleUpdatePermission} roleId={roleId} />
      )}
    </>
  );
};

export default React.memo(PermissionTab);
