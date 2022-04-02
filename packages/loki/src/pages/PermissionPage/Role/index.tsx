import { t } from 'i18next';
import { Role } from '@greyhole/myrole/myrole_pb';
import Alert from '@material-ui/lab/Alert';
import { Grid, Box, CircularProgress } from '@material-ui/core';
import React, { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { StatusEnum } from 'redux/constant';
import { selectRoles, selectRoleState } from 'redux/features/role/slice';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { getListGroupThunk } from 'redux/features/group/thunks';
import { selectGroups, selectGroupStatus } from 'redux/features/group/slice';
import { createRoleThunk, getListRolesThunk, updateRoleThunk } from 'redux/features/role/thunks';

import FormData from 'components/Form';
import LayoutPaper from 'components/Layout/LayoutPaper';
import { isLegalPermission } from 'components/AllowedTo/utils';
import Button, { ButtonSizes } from 'components/StyleGuide/Button';
import { FormFields, FormTypes } from 'components/Form/types';
import Typography, { TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';
import { formatOptions, sleep } from 'utils/common';
import { PerformPermission } from 'configs/routes/permission';
import useErrorMessage from 'hooks/useErrorMessage';
import ImagePermissionRoleConfig from 'assets/images/permission_role_config.png';
import RoleItem from './RoleItem';
import styles from './styles.module.scss';
import useAuth from 'hooks/useAuth';
import { iToast } from '@ilt-core/toast';

type FormValues = {
  name: string;
  description: string;
  groupId: number;
};

const RoleTab = () => {
  const dispatch = useAppDispatch();

  const methods = useForm<FormValues>({
    defaultValues: {
      name: '',
      description: '',
      groupId: undefined,
    },
  });

  const { reset, clearErrors, setValue, watch } = methods;

  const watchAllFields = watch();

  const { errorMessage, setError } = useErrorMessage();
  const { userPermissions } = useAuth();

  const roleState = useAppSelector(selectRoleState);
  const roles = useAppSelector(selectRoles);
  const groups = useAppSelector(selectGroups);
  const groupStatus = useAppSelector(selectGroupStatus);

  const [selected, setSelected] = useState<Role.AsObject | null>(null);
  const [statusLoading, setStatusLoading] = useState('idle');

  useEffect(() => {
    dispatch(getListRolesThunk());
    if (isLegalPermission(PerformPermission.permissionGroup.listGroups, userPermissions)) {
      dispatch(getListGroupThunk());
    }
  }, [dispatch, userPermissions]);

  const handleCreate = async (data: FormValues) => {
    setStatusLoading('submitting');
    await sleep(300);
    const { response, error } = await dispatch(createRoleThunk(data)).unwrap();
    if (response) {
      reset();
    }
    setError(error);
    setStatusLoading('idle');
  };

  const handleUpdate = async (data: FormValues) => {
    setStatusLoading('submitting');
    await sleep(300);
    const { response, error } = await dispatch(
      updateRoleThunk({
        ...selected,
        ...data,
      }),
    ).unwrap();
    if (response) {
      iToast.success({
        title: t('Update Successful')
      })
      reset();
      setSelected(null);
    }
    setError(error);
    setStatusLoading('idle');
  };

  const handleSelect = async (role: Role.AsObject) => {
    await handleSelectGroup();
    clearErrors();
    setError();
    setSelected(role);
    setValue('name', role.name);
    setValue('description', role.description);
    setValue('groupId', role.group.id);
  };

  const handleSelectGroup = async () => {
    if (groups.length) return;
    await dispatch(getListGroupThunk());
  };

  const groupOptions = useMemo(() => formatOptions(groups, { name: 'name', value: 'id' }), [groups]);

  const fields: FormFields[] = [
    {
      type: FormTypes.INPUT,
      label: t('{{key}} name', { key: t('Role') }),
      name: 'name',
      placeholder: t('Fill your {{key}}', { key: t('Role').toLowerCase() }),
      width: { xs: 12 },
      rules: { required: t('This field is required') },
    },
    {
      type: FormTypes.SELECT,
      label: t('{{key}} name', { key: t('Group') }),
      name: 'groupId',
      placeholder: t('Select {{key}}', { key: t('Group').toLowerCase() }),
      width: { xs: 12 },
      options: groupOptions,
      loading: groupStatus === StatusEnum.LOADING,
      onFocus: handleSelectGroup,
      rules: { required: t('This field is required') },
    },
    {
      label: t('Description'),
      name: 'description',
      type: FormTypes.TEXT_AREA,
      maxLength: 255,
      placeholder: t('Fill your {{key}}', { key: t('Description', {}).toLowerCase() }),
      width: { xs: 12 },
      rows: 5,
      rules: { required: t('This field is required') },
    },
  ];

  const isCanSubmit = watchAllFields.description && watchAllFields.groupId && watchAllFields.name;
  const isAllowedPermissionCreate = isLegalPermission(PerformPermission.permissionRole.createRole, userPermissions);
  const isAllowedPermissionUpdate = isLegalPermission(PerformPermission.permissionRole.updateRole, userPermissions);

  return (
    <Grid container spacing={3}>
      {isAllowedPermissionCreate && isAllowedPermissionUpdate ? (
        <Grid item xs={12} md={4}>
          <LayoutPaper
            header={
              selected
                ? t('Update {{key}}', { key: t('Role').toLowerCase() })
                : t('Create new {{key}}', { key: t('Role').toLowerCase() })
            }
          >
            <FormData
              methods={methods}
              fields={fields}
              onSubmit={selected ? handleUpdate : handleCreate}
              actions={
                <>
                  {errorMessage && (
                    <Box mb={2}>
                      <Alert severity="error">{errorMessage}</Alert>
                    </Box>
                  )}
                  <Box mt={1}>
                    <Button size={ButtonSizes.lg} loading={statusLoading === 'submitting'} disabled={!isCanSubmit}>
                      {selected ? t('Update') : t('Create')}
                    </Button>
                  </Box>
                </>
              }
            />
          </LayoutPaper>
        </Grid>
      ) : (
        <>
          {isAllowedPermissionCreate && (
            <Grid item xs={12} md={4}>
              <LayoutPaper header={t('Create new {{key}}', { key: t('Role').toLowerCase() })}>
                <FormData
                  methods={methods}
                  fields={fields}
                  onSubmit={handleCreate}
                  actions={
                    <>
                      {errorMessage && (
                        <Box mb={2}>
                          <Alert severity="error">{errorMessage}</Alert>
                        </Box>
                      )}
                      <Box mt={1}>
                        <Button size={ButtonSizes.lg} loading={statusLoading === 'submitting'} disabled={!isCanSubmit}>
                          {t('Create')}
                        </Button>
                      </Box>
                    </>
                  }
                />
              </LayoutPaper>
            </Grid>
          )}
          {selected && isAllowedPermissionUpdate && (
            <Grid item xs={12} md={4}>
              <LayoutPaper header={t('Update {{key}}', { key: t('Role').toLowerCase() })}>
                <FormData
                  methods={methods}
                  fields={fields}
                  onSubmit={handleUpdate}
                  actions={
                    <>
                      {errorMessage && (
                        <Box mb={2}>
                          <Alert severity="error">{errorMessage}</Alert>
                        </Box>
                      )}
                      <Box mt={1}>
                        <Button size={ButtonSizes.lg} loading={statusLoading === 'submitting'} disabled={!isCanSubmit}>
                          {t('Update')}
                        </Button>
                      </Box>
                    </>
                  }
                />
              </LayoutPaper>
            </Grid>
          )}
        </>
      )}

      <Grid item container xs={12} md={isAllowedPermissionCreate || (selected && isAllowedPermissionUpdate) ? 8 : 12}>
        <LayoutPaper padding={0} className={styles['resources-paper']}>
          <Box className={styles['resources-header']}>
            <Typography variant={TypoVariants.head2}>
              {t('List of {{key}}', { key: t('Role').toLowerCase() })}
            </Typography>
          </Box>
          {roleState.status === StatusEnum.LOADING && (
            <Box mt={3} display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          )}
          {roleState.status === StatusEnum.SUCCEEDED &&
            (roles.length > 0 ? (
              <Box className={styles['resources-content']}>
                <Grid container spacing={3} xs={12}>
                  {roles.map((role) => (
                    <Grid item xs={6}>
                      <RoleItem item={role} onSelect={handleSelect} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : (
              <Box p={4} display="flex" flexDirection="column" alignItems="center" width="100%" height="100%">
                <img alt="paper" src={ImagePermissionRoleConfig} />
              </Box>
            ))}
          {roleState.status === StatusEnum.FAILED && (
            <Box mt={3} display="flex" justifyContent="center">
              <Typography variant={TypoVariants.head4} type={TypoTypes.error}>
                {t('Something went wrong!')}
              </Typography>
            </Box>
          )}
        </LayoutPaper>
      </Grid>
    </Grid>
  );
};

export default React.memo(RoleTab);
