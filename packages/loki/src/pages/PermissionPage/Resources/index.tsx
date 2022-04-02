import { t } from 'i18next';
import { Resource } from '@greyhole/myrole/myrole_pb';
import Alert from '@material-ui/lab/Alert';
import { Grid, Box, CircularProgress } from '@material-ui/core';
import React, { useRef, useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { selectResources, selectResourceState } from 'redux/features/resource/slice';
import { createResourceThunk, getListResourcesThunk, updateResourceThunk } from 'redux/features/resource/thunks';

import FormData from 'components/Form';
import LayoutPaper from 'components/Layout/LayoutPaper';
import Button, { ButtonSizes } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';
import { FormFields, FormTypes } from 'components/Form/types';

import { sleep } from 'utils/common';
import ResourceItem from './ResourceItem';
import ImagePermissionRoleConfig from 'assets/images/permission_role_config.png';
import styles from './styles.module.scss';
import useErrorMessage from 'hooks/useErrorMessage';
import { StatusEnum } from 'redux/constant';
import { PerformPermission } from 'configs/routes/permission';
import useAuth from 'hooks/useAuth';
import { isLegalPermission } from 'components/AllowedTo/utils';
import { iToast } from '@ilt-core/toast';

type FormValues = {
  name: string;
  description: string;
};

const ResourcesTab = () => {
  const dispatch = useAppDispatch();

  const methods = useForm<FormValues>({
    defaultValues: {
      name: '',
      description: '',
    },
    mode: 'onChange',
  });

  const { userPermissions } = useAuth();

  const { reset, clearErrors, setValue, formState } = methods;

  const { errorMessage, setError } = useErrorMessage();

  const resourceState = useAppSelector(selectResourceState);
  const resources = useAppSelector(selectResources);

  const refPaper = useRef<HTMLDivElement>();

  const [selected, setSelected] = useState<Resource.AsObject | null>();
  const [statusLoading, setStatusLoading] = useState('idle');

  useEffect(() => {
    dispatch(getListResourcesThunk());
  }, [dispatch]);

  const handleCreate = async (data: FormValues) => {
    setStatusLoading('submitting');
    await sleep(300);
    const { response, error } = await dispatch(createResourceThunk(data)).unwrap();
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
      updateResourceThunk({
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

  const handleSelectResource = (action: Resource.AsObject) => {
    reset();
    clearErrors();
    setError();
    setSelected(action);
    setValue('name', action.name);
    setValue('description', action.description);
  };

  const fields: FormFields[] = [
    {
      type: FormTypes.INPUT,
      label: t('{{key}} name', { key: t('Resource') }),
      name: 'name',
      placeholder: t('Fill your {{key}}', { key: t('Resource').toLowerCase() }),
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

  const isAllowedPermissionCreate = isLegalPermission(
    PerformPermission.permissionResource.createResource,
    userPermissions,
  );
  const isAllowedPermissionUpdate = isLegalPermission(
    PerformPermission.permissionResource.updateResource,
    userPermissions,
  );

  return (
    <Grid container spacing={3}>
      {isAllowedPermissionCreate && isAllowedPermissionUpdate ? (
        <Grid item xs={12} md={4}>
          <LayoutPaper
            header={
              selected
                ? t('Update {{key}}', { key: t('Resource').toLowerCase() })
                : t('Create new {{key}}', { key: t('Resource').toLowerCase() })
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
              <LayoutPaper header={t('Create new {{key}}', { key: t('Resource').toLowerCase() })}>
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
              <LayoutPaper header={t('Update {{key}}', { key: t('Resource').toLowerCase() })}>
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
        <LayoutPaper padding={0} ref={refPaper} className={styles['resources-paper']}>
          <Box className={styles['resources-header']}>
            <Typography variant={TypoVariants.head2}>
              {t('List of {{key}}', { key: t('Resource').toLowerCase() })}
            </Typography>
          </Box>
          {resourceState.status === StatusEnum.LOADING && (
            <Box mt={3} display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          )}
          {resourceState.status === StatusEnum.SUCCEEDED &&
            (resources.length > 0 ? (
              <Box className={styles['resources-content']}>
                <Grid container spacing={3} xs={12}>
                  {resources.map((resource) => (
                    <Grid item xs={6} key={resource.id}>
                      <ResourceItem item={resource} onSelect={handleSelectResource} />
                    </Grid>
                  ))}
                </Grid>
              </Box>
            ) : (
              <Box p={4} display="flex" flexDirection="column" alignItems="center" width="100%" height="100%">
                <img alt="paper" src={ImagePermissionRoleConfig} />
              </Box>
            ))}
          {resourceState.status === StatusEnum.FAILED && (
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

export default React.memo(ResourcesTab);
