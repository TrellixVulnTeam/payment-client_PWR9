import { Action, Resource } from '@greyhole/myrole/myrole_pb';
import Alert from '@material-ui/lab/Alert';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { CircularProgress } from '@material-ui/core';
import { t } from 'i18next';
import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useForm } from 'react-hook-form';
import { StatusEnum } from 'redux/constant';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { getListResourcesThunk } from 'redux/features/resource/thunks';
import { selectResourceEntities, selectResources } from 'redux/features/resource/slice';
import { selectActionListByResourceId, selectActionState } from 'redux/features/action/slice';
import { createActionThunk, getListActionsThunk, updateActionThunk } from 'redux/features/action/thunks';

import FormData from 'components/Form';
import PageLoader from 'components/PageLoader';
import LayoutPaper from 'components/Layout/LayoutPaper';
import Button, { ButtonSizes } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { FormFields, FormTypes } from 'components/Form/types';
import { formatOptions, sleep } from 'utils/common';
import { isLegalPermission } from 'components/AllowedTo/utils';

import useAuth from 'hooks/useAuth';
import useErrorMessage from 'hooks/useErrorMessage';
import ImagePermissionRoleConfig from 'assets/images/permission_role_config.png';
import { PerformPermission } from 'configs/routes/permission';
import ActionItem from './ActionItem';
import styles from './styles.module.scss';
import { iToast } from '@ilt-core/toast';

type FormValues = {
  name: string;
  description: string;
  resourceId: number;
  path: string;
};

const ActionTab = () => {
  const dispatch = useAppDispatch();

  const { errorMessage, setError } = useErrorMessage();

  const { userPermissions } = useAuth();

  const actionState = useAppSelector(selectActionState);
  const resources = useAppSelector(selectResources);
  const resourceEntities = useAppSelector(selectResourceEntities);

  const actionListByResourceId = useAppSelector(selectActionListByResourceId);

  const methods = useForm<FormValues>({
    defaultValues: {
      name: '',
      description: '',
      resourceId: undefined,
      path: '',
    },
    mode: 'onChange',
  });
  const { setValue, clearErrors, reset, formState } = methods;

  const [selected, setSelected] = useState<Action.AsObject | null>(null);
  const [statusLoading, setStatusLoading] = useState('idle');

  useEffect(() => {
    dispatch(getListActionsThunk());
    if (isLegalPermission(PerformPermission.permissionResource.listResources, userPermissions)) {
      dispatch(getListResourcesThunk());
    }
  }, [dispatch, userPermissions]);

  const resourceOptions = useMemo(() => formatOptions(resources, { name: 'name', value: 'id' }), [resources]);

  const fields: FormFields[] = [
    {
      type: FormTypes.INPUT,
      label: t('{{key}} name', { key: t('Action') }),
      name: 'name',
      placeholder: t('Fill your {{key}}', { key: t('Action').toLowerCase() }),
      width: { xs: 12 },
      rules: {
        required: t('This field is required'),
      },
    },
    {
      label: t('Resource'),
      name: 'resourceId',
      type: FormTypes.SELECT,
      options: resourceOptions,
      placeholder: t('Select'),
      width: { xs: 12 },
      rules: {
        required: t('This field is required'),
      },
      autoComplete: true,
      display: (resourceId: number) => {
        return <>{resourceEntities[resourceId]?.name ?? ''}</>;
      },
      autoCompleteProps: {
        placeholderSearch: t('Search by {{key}}', { key: `${t('Name')}`.toLowerCase() }),
        filterOptions: (options: Resource.AsObject[], state) => {
          return state.inputValue === '' ? options : options.filter((op) => op.name.includes(state.inputValue));
        },
        renderOption: (resource: Resource.AsObject) => (
          <Box width="100%" pb={1}>
            <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
              {resource.name}
            </Typography>
          </Box>
        ),
      },
    },
    {
      label: t('Description'),
      name: 'description',
      type: FormTypes.TEXT_AREA,
      maxLength: 255,
      placeholder: t('Fill your {{key}}', { key: t('Description').toLowerCase() }),
      width: { xs: 12 },
      rows: 5,
      rules: {
        required: t('This field is required'),
      },
    },
    {
      type: FormTypes.INPUT,
      label: t('{{key}} name', { key: t('Path') }),
      name: 'path',
      placeholder: t('Fill your {{key}}', { key: t('Path').toLowerCase() }),
      width: { xs: 12 },
      rules: {
        required: t('This field is required'),
      },
    },
  ];

  const handleCreate = async (formValues: FormValues) => {
    setStatusLoading('submitting');
    await sleep(300);
    const { response, error } = await dispatch(createActionThunk(formValues)).unwrap();
    if (response) {
      reset();
    }

    if (error?.message.includes('action_name_resource_actions')) {
      setError({
        code: undefined,
        message: t(`This action already exist in Resource {{name}}`, {
          name: resourceEntities[formValues.resourceId].name,
        }),
      });
    } else {
      setError(error);
    }

    setStatusLoading('idle');
  };

  const handleUpdate = async (formValues: FormValues) => {
    setStatusLoading('submitting');
    await sleep(300);
    const { response, error } = await dispatch(
      updateActionThunk({
        action: selected,
        newAction: { ...selected, ...formValues },
      }),
    ).unwrap();

    if (response) {
      iToast.success({
        title: t('Update Successful'),
      });
      reset();
      setSelected(null);
    }

    if (error?.message.includes('action_name_resource_actions')) {
      setError({
        code: undefined,
        message: t(`This action already exist in Resource {{name}}`, {
          name: resourceEntities[formValues.resourceId].name,
        }),
      });
    } else {
      setError(error);
    }

    setStatusLoading('idle');
  };

  const handleSelectAction = (action: Action.AsObject) => {
    reset();
    clearErrors();
    setError();
    setSelected(action);
    setValue('name', action.name);
    setValue('description', action.description);
    setValue('resourceId', action.resource?.id);
    setValue('path', action.path);
  };

  const isAllowedPermissionCreate = isLegalPermission(PerformPermission.permissionAction.createAction, userPermissions);
  const isAllowedPermissionUpdate = isLegalPermission(PerformPermission.permissionAction.updateAction, userPermissions);

  return (
    <Grid container spacing={3}>
      {isAllowedPermissionCreate && isAllowedPermissionUpdate ? (
        <Grid item xs={12} md={4}>
          <LayoutPaper
            header={
              selected
                ? t('Update {{key}}', { key: t('Action').toLowerCase() })
                : t('Create new {{key}}', { key: t('Action').toLowerCase() })
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
                      <Alert severity="error">{t(errorMessage)}</Alert>
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
              <LayoutPaper header={t('Create new {{key}}', { key: t('Action').toLowerCase() })}>
                <FormData
                  methods={methods}
                  fields={fields}
                  onSubmit={handleCreate}
                  actions={
                    <>
                      {errorMessage && (
                        <Box mb={2}>
                          <Alert severity="error">{t(errorMessage)}</Alert>
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
              <LayoutPaper header={t('Update {{key}}', { key: t('Action').toLowerCase() })}>
                <FormData
                  methods={methods}
                  fields={fields}
                  onSubmit={handleUpdate}
                  actions={
                    <>
                      {errorMessage && (
                        <Box mb={2}>
                          <Alert severity="error">{t(errorMessage)}</Alert>
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
        <LayoutPaper padding={0} className={styles['paper-actions']}>
          <Box className={styles['resources-header']}>
            <Typography variant={TypoVariants.head2}>
              {t('List of {{key}}', { key: t('Action').toLowerCase() })}
            </Typography>
          </Box>
          {actionState.status === StatusEnum.LOADING && (
            <Box mt={3} display="flex" justifyContent="center">
              <CircularProgress />
            </Box>
          )}
          {actionState.status === StatusEnum.SUCCEEDED &&
            (resources.length > 0 ? (
              <Suspense fallback={<PageLoader />}>
                <Box className={styles['resources-content']}>
                  {Object.entries(actionListByResourceId).map(([resourceId, actions]) => (
                    <Box key={resourceId} className={styles['resources-content-item']}>
                      <Box>
                        <Typography variant={TypoVariants.head3} weight={TypoWeights.bold}>
                          {resourceEntities[resourceId]?.name || '--------'}
                        </Typography>
                      </Box>
                      <Box mt={3}>
                        <Grid container spacing={3} xs={12}>
                          {actions.map((action) => (
                            <Grid key={action.id} item xs={6}>
                              <ActionItem item={action} onSelect={handleSelectAction} />
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Suspense>
            ) : (
              <Box p={4} display="flex" flexDirection="column" alignItems="center" width="100%" height="100%">
                <img alt="paper" src={ImagePermissionRoleConfig} />
              </Box>
            ))}
          {actionState.status === StatusEnum.FAILED && (
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

export default React.memo(ActionTab);
