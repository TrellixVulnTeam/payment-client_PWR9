import { t } from 'i18next';
import { Group } from '@greyhole/myrole/myrole_pb';
import Alert from '@material-ui/lab/Alert';
import { Grid, Box, CircularProgress } from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { StatusEnum } from 'redux/constant';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { selectGroups, selectGroupState } from 'redux/features/group/slice';
import { createGroupThunk, getListGroupThunk, updateGroupThunk } from 'redux/features/group/thunks';

import FormData from 'components/Form';
import LayoutPaper from 'components/Layout/LayoutPaper';
import Button, { ButtonSizes } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';
import { FormFields, FormTypes } from 'components/Form/types';

import { MODULE_ALOPAY, sleep } from 'utils/common';
import ResourceItem from './GroupItem';
import ImagePermissionRoleConfig from 'assets/images/permission_role_config.png';
import styles from './styles.module.scss';
import useErrorMessage from 'hooks/useErrorMessage';
import { isLegalPermission } from 'components/AllowedTo/utils';
import { PerformPermission } from 'configs/routes/permission';
import useAuth from 'hooks/useAuth';
import { iToast } from '@ilt-core/toast';

type FormValues = {
  name: string;
  description: string;
  moduleIdsList: number[];
};

const GroupTab = () => {
  const dispatch = useAppDispatch();

  const { userPermissions } = useAuth();

  const methods = useForm<FormValues>({
    defaultValues: {
      name: '',
      description: '',
      moduleIdsList: [MODULE_ALOPAY],
    },
    mode: 'onChange',
  });
  const { reset, clearErrors, setValue, formState } = methods;

  const { errorMessage, setError } = useErrorMessage();

  const groupState = useAppSelector(selectGroupState);
  const groups = useAppSelector(selectGroups);

  const [selected, setSelected] = useState<Group.AsObject | null>();
  const [statusLoading, setStatusLoading] = useState('idle');

  useEffect(() => {
    dispatch(getListGroupThunk());
  }, [dispatch]);

  const handleCreate = async (data: FormValues) => {
    setStatusLoading('submitting');
    await sleep(300);
    const { response, error } = await dispatch(
      createGroupThunk({
        moduleIdsList: [MODULE_ALOPAY],
        ...data,
      }),
    ).unwrap();
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
      updateGroupThunk({
        ...selected,
        ...data,
      }),
    ).unwrap();
    if (response) {
      iToast.success({
        title: t('Update Successful'),
      });
      reset();
      setSelected(null);
    }
    setError(error);
    setStatusLoading('idle');
  };

  const handleSelect = (selected: Group.AsObject) => {
    reset();
    clearErrors();
    setError();
    setSelected(selected);
    setValue('name', selected.name);
    setValue('description', selected.description);
  };

  const fields: FormFields[] = [
    {
      type: FormTypes.INPUT,
      label: t('{{key}} name', { key: t('Group') }),
      name: 'name',
      placeholder: t('Fill your {{key}}', { key: t('Group').toLowerCase() }),
      rules: { required: t('This field is required') },
      width: { xs: 12 },
    },
    {
      type: FormTypes.TEXT_AREA,
      label: t('Description'),
      name: 'description',
      maxLength: 255,
      placeholder: t('Fill your {{key}}', { key: t('Description').toLowerCase() }),
      width: { xs: 12 },
      rules: { required: t('This field is required') },
      rows: 5,
    },
  ];

  const isAllowedPermissionCreate = isLegalPermission(PerformPermission.permissionGroup.createGroup, userPermissions);
  const isAllowedPermissionUpdate = isLegalPermission(PerformPermission.permissionGroup.updateGroup, userPermissions);

  return (
    <Grid container spacing={3}>
      {isAllowedPermissionCreate && isAllowedPermissionUpdate ? (
        <Grid item xs={12} md={4}>
          <LayoutPaper
            header={
              selected
                ? t('Update {{key}}', { key: t('Group').toLowerCase() })
                : t('Create new {{key}}', { key: t('Group').toLowerCase() })
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
                    <Button
                      type="submit"
                      size={ButtonSizes.lg}
                      loading={statusLoading === 'submitting'}
                      disabled={!formState.isValid}
                    >
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
              <LayoutPaper header={t('Create new {{key}}', { key: t('Group').toLowerCase() })}>
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
                        <Button
                          type="submit"
                          size={ButtonSizes.lg}
                          loading={statusLoading === 'submitting'}
                          disabled={!formState.isValid}
                        >
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
              <LayoutPaper header={t('Update {{key}}', { key: t('Group').toLowerCase() })}>
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
                        <Button
                          type="submit"
                          size={ButtonSizes.lg}
                          loading={statusLoading === 'submitting'}
                          disabled={!formState.isValid}
                        >
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
      <Grid item container xs={12} md={isAllowedPermissionCreate || (isAllowedPermissionUpdate && selected) ? 8 : 12}>
        <LayoutPaper padding={0} className={styles['resources-paper']}>
          <Box className={styles['resources-header']}>
            <Typography variant={TypoVariants.head2}>
              {t('List of {{key}}', { key: t('Group').toLowerCase() })}
            </Typography>
          </Box>
          {groupState.status === StatusEnum.LOADING && (
            <Box mt={3} display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          )}
          {groupState.status === StatusEnum.SUCCEEDED &&
            (groups.length > 0 ? (
              <Box className={styles['resources-content']}>
                <Grid container spacing={3} xs={12}>
                  {groups.map((gr) => (
                    <Grid item xs={6}>
                      <ResourceItem item={gr} onSelect={handleSelect} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : (
              <Box p={4} display="flex" flexDirection="column" alignItems="center" width="100%" height="100%">
                <img alt="paper" src={ImagePermissionRoleConfig} />
              </Box>
            ))}
          {groupState.status === StatusEnum.FAILED && (
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

export default React.memo(GroupTab);
