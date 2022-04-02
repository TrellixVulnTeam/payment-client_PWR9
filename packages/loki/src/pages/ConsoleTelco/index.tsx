import { Box, CircularProgress } from '@material-ui/core';
import LayoutContainer from 'components/Layout/LayoutContainer';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';

import {
  selectAutoApprovalStatus,
  selectChargeCardProvidersListTelco,
  selectEnableThirdPartyTelco,
  selectGetCardProvidersListTelco,
  selectTopUpAutoApprovalTelco,
  toggleProviderEnable,
  updatePriority,
} from 'redux/features/consoleTelco/slice';
import { useAppDispatch, useAppSelector } from 'redux/store';

import Toggle from 'components/StyleGuide/Toggle';
import Typography, { TypoVariants, TypoWeights, TypoTypes } from 'components/StyleGuide/Typography';
import { useBreadcrumbs, IBreadcrumb } from 'components/AlopayBreadcrumbs/useBreadcrumbs';
import {
  getSettingThunk,
  updateChargeCardProvidersSettingThunk,
  updateGetCardProvidersSettingThunk,
  updateTopUpAutoApprovalSettingThunk,
  updateUsingThirdPartySettingThunk,
} from 'redux/features/consoleTelco/thunks';
import Option from 'components/StyleGuide/Option';
import { APP_NAME } from 'utils/common';
import DialogConfirm from './DialogConfirm';
import { StatusEnum } from 'redux/constant';
import AlopayTable from 'components/AlopayTable';
import Button, { ButtonVariants } from 'components/StyleGuide/Button';
import { DropdownList } from 'components/StyleGuide/DropdownList';
import { iToast } from '@ilt-core/toast';
import { isLegalPermission } from 'components/AllowedTo/utils';
import { PerformPermission } from 'configs/routes/permission';
import useAuth from 'hooks/useAuth';
import AllowedTo from 'components/AllowedTo';

interface Props {}

const AutoApproval = (props: Props) => {
  const dispatch = useAppDispatch();

  const { userPermissions } = useAuth();

  const status = useAppSelector(selectAutoApprovalStatus);
  const topupAutoApproval = useAppSelector(selectTopUpAutoApprovalTelco);
  const enableThirdPartyTelco = useAppSelector(selectEnableThirdPartyTelco);
  const chargeCardProvidersList = useAppSelector(selectChargeCardProvidersListTelco);
  const getCardProvidersList = useAppSelector(selectGetCardProvidersListTelco);

  const isAllowedPermissionUpdate = isLegalPermission(
    PerformPermission.adminConsoleTelco.updateChargeCardProvidersSettingThunk,
    userPermissions,
  );

  const { setBreadcrumbs } = useBreadcrumbs();

  const [dialog, setDialog] = useState({
    name: '',
    value: undefined,
  });

  useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [
      {
        to: '/auto-approval',
        label: t('Admin Console'),
      },
      {
        to: '/auto-approval',
        label: t('Telco'),
        active: true,
      },
    ];
    setBreadcrumbs(breadcrumbs);
  }, [setBreadcrumbs]);

  useEffect(() => {
    dispatch(getSettingThunk());
  }, [dispatch]);

  const handleConfirmSetting = () => {
    if (dialog.value === 'topupAutoApproval') {
      dispatch(
        updateTopUpAutoApprovalSettingThunk({
          topUpAutoApproval: !topupAutoApproval,
        }),
      );
    }

    if (dialog.value === 'enableThirdParty') {
      dispatch(
        updateUsingThirdPartySettingThunk({
          enableThirdParty: !enableThirdPartyTelco,
        }),
      );
    }
  };

  const handleCloseDialog = () => setDialog({ name: '', value: undefined });

  const handleToggleStatus = (e, row, type: 'chargeCard' | 'getCard') => {
    e.preventDefault();
    dispatch(
      toggleProviderEnable({
        item: row,
        type,
      }),
    );
  };

  const handleChangePriority = (row, type: 'chargeCard' | 'getCard') => {
    dispatch(
      updatePriority({
        item: row,
        type,
      }),
    );
  };

  const handleUpdateChargeCard = async () => {
    const { response } = await dispatch(
      updateChargeCardProvidersSettingThunk({
        providersList: chargeCardProvidersList,
      }),
    ).unwrap();

    if (response) {
      iToast.success({
        title: t('Save successful'),
      });
    } else {
      iToast.error({
        title: t('Error'),
      });
    }
  };

  const handleUpdateGetCard = async () => {
    const { response } = await dispatch(
      updateGetCardProvidersSettingThunk({
        providersList: getCardProvidersList,
      }),
    ).unwrap();

    if (response) {
      iToast.success({
        title: t('Save successful'),
      });
    } else {
      iToast.error({
        title: t('Error'),
      });
    }
  };

  const columnsChargeCard = [
    {
      Header: t('Third party'),
      accessor: (row: any) => row.name,
    },
    {
      Header: t('Priority'),
      accessor: (row: any) => {
        if (!isAllowedPermissionUpdate) {
          return row.priority || '-';
        }

        return (
          <DropdownList
            value={row.priority}
            onChange={(value) =>
              handleChangePriority(
                {
                  ...row,
                  priority: value,
                },
                'chargeCard',
              )
            }
          >
            {chargeCardProvidersList
              .map((_, idx) => idx + 1)
              .map((priority, idx) => (
                <Option value={priority} key={idx}>
                  {priority.toString()}
                </Option>
              ))}
          </DropdownList>
        );
      },
    },
    {
      Header: `${t('Enable')}`,
      accessor: (row: any) => {
        return (
          <Box display="flex" alignItems="center">
            <Toggle
              checked={row.enable}
              onClick={(e: React.SyntheticEvent) => {
                e.preventDefault();
                e.stopPropagation();
                if (isAllowedPermissionUpdate) {
                  handleToggleStatus(e, row, 'chargeCard');
                }
              }}
              style={{ marginRight: 10 }}
            />
            <Typography variant={TypoVariants.body2} weight={TypoWeights.bold}></Typography>
          </Box>
        );
      },
    },
  ];

  const columnsGetCard = [
    {
      Header: t('Third party'),
      accessor: (row: any) => row.name,
    },
    {
      Header: t('Priority'),
      accessor: (row: any) => {
        if (!isAllowedPermissionUpdate) {
          return row.priority || '-';
        }

        return (
          <DropdownList
            value={row.priority}
            onChange={(value) =>
              handleChangePriority(
                {
                  ...row,
                  priority: value,
                },
                'getCard',
              )
            }
          >
            {getCardProvidersList
              .map((_, idx) => idx + 1)
              .map((priority, idx) => (
                <Option value={priority} key={idx}>
                  {priority.toString()}
                </Option>
              ))}
          </DropdownList>
        );
      },
    },
    {
      Header: `${t('Enable')}`,
      accessor: (row: any) => {
        return (
          <Box display="flex" alignItems="center">
            <Toggle
              checked={row.enable}
              onClick={(e: React.SyntheticEvent) => {
                e.preventDefault();
                e.stopPropagation();
                if (isAllowedPermissionUpdate) {
                  handleToggleStatus(e, row, 'getCard');
                }
              }}
              style={{ marginRight: 10 }}
            />
            <Typography variant={TypoVariants.body2} weight={TypoWeights.bold}></Typography>
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <Helmet>
        <title>
          {t('Auto Approval')} - {APP_NAME}
        </title>
      </Helmet>
      <LayoutContainer header={t('Auto approval')} maxWidth={false}>
        <Box mb={2}>
          {status === StatusEnum.SUCCEEDED ? (
            <>
              <Box display="flex" alignItems="center">
                <Toggle
                  key="topupAutoApproval"
                  checked={topupAutoApproval}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (
                      isLegalPermission(
                        PerformPermission.adminConsoleTelco.updateTopUpAutoApprovalSetting,
                        userPermissions,
                      )
                    ) {
                      setDialog({ name: 'confirm', value: 'topupAutoApproval' });
                    } else {
                      iToast.error({
                        title: t('Not authorized'),
                      });
                    }
                  }}
                  style={{ marginRight: 10 }}
                />
                <Typography variant={TypoVariants.body2} weight={TypoWeights.bold}>
                  {t('Auto approval')} {t('Top-Up')} {t('Telco')}
                </Typography>
              </Box>
              <Box display="flex" alignItems="center" mt={3}>
                <Toggle
                  key="enableThirdParty"
                  checked={enableThirdPartyTelco}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (
                      isLegalPermission(
                        PerformPermission.adminConsoleTelco.updateUsingThirdPartySetting,
                        userPermissions,
                      )
                    ) {
                      setDialog({ name: 'confirm', value: 'enableThirdParty' });
                    } else {
                      iToast.error({
                        title: t('Not authorized'),
                      });
                    }
                  }}
                  style={{ marginRight: 10 }}
                />
                <Typography variant={TypoVariants.body2} weight={TypoWeights.bold}>
                  {t('Third party')} {t('Telco')}
                </Typography>
              </Box>
            </>
          ) : (
            <Box display="flex" alignItems="center">
              <CircularProgress />
            </Box>
          )}
        </Box>
        {enableThirdPartyTelco && (
          <>
            <Box mt={4} mb={2}>
              <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant={TypoVariants.head3}>{t('Charge Card Provider List')}</Typography>
                <AllowedTo perform={PerformPermission.adminConsoleTelco.updateChargeCardProvidersSettingThunk}>
                  <Button
                    variant={ButtonVariants.primary}
                    style={{ width: 100 }}
                    onClick={() => setDialog({ name: 'saveChargeCard', value: undefined })}
                  >
                    <Typography variant={TypoVariants.button1} type={TypoTypes.invert}>
                      {t('Save')}
                    </Typography>
                  </Button>
                </AllowedTo>
              </Box>
              <AlopayTable
                loading={status === StatusEnum.LOADING}
                columns={columnsChargeCard}
                data={chargeCardProvidersList}
              />
            </Box>
            <Box mt={4} mb={2}>
              <Box mb={2} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant={TypoVariants.head3}>{t('Get Card Provider List')}</Typography>
                <AllowedTo perform={PerformPermission.adminConsoleTelco.updateGetCardProvidersSetting}>
                  <Button
                    variant={ButtonVariants.primary}
                    style={{ width: 100 }}
                    onClick={() => setDialog({ name: 'saveGetCard', value: undefined })}
                  >
                    <Typography variant={TypoVariants.button1} type={TypoTypes.invert}>
                      {t('Save')}
                    </Typography>
                  </Button>
                </AllowedTo>
              </Box>
              <AlopayTable
                loading={status === StatusEnum.LOADING}
                columns={columnsGetCard}
                data={getCardProvidersList}
              />
            </Box>
          </>
        )}
      </LayoutContainer>
      {dialog.name === 'confirm' && <DialogConfirm onClose={handleCloseDialog} onConfirm={handleConfirmSetting} />}
      {dialog.name === 'saveChargeCard' && (
        <DialogConfirm onClose={handleCloseDialog} onConfirm={handleUpdateChargeCard} />
      )}
      {dialog.name === 'saveGetCard' && <DialogConfirm onClose={handleCloseDialog} onConfirm={handleUpdateGetCard} />}
    </>
  );
};

export default AutoApproval;
