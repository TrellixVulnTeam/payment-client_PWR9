import { Box, CircularProgress } from '@material-ui/core';
import LayoutContainer from 'components/Layout/LayoutContainer';
import { useEffect, useState } from 'react';
import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { iToast } from '@ilt-core/toast';

import { StatusEnum } from 'redux/constant';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { selectAutoTransferWithdrawCrypto, selectConsoleStatusCrypto } from 'redux/features/consoleCrypto/slice';
import { getCryptoSettingsThunk, updateAutoTransferCryptoWithdrawThunk } from 'redux/features/consoleCrypto/thunks';

import Toggle from 'components/StyleGuide/Toggle';
import Typography, { TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { useBreadcrumbs, IBreadcrumb } from 'components/AlopayBreadcrumbs/useBreadcrumbs';
import { isLegalPermission } from 'components/AllowedTo/utils';
import { APP_NAME } from 'utils/common';
import useAuth from 'hooks/useAuth';
import { PerformPermission } from 'configs/routes/permission';
import DialogConfirm from './DialogConfirm';

interface Props {}

const AutoApproval = (props: Props) => {
  const dispatch = useAppDispatch();

  const { userPermissions } = useAuth();

  const consoleStatusCrypto = useAppSelector(selectConsoleStatusCrypto);
  const autoTransferWithdrawCrypto = useAppSelector(selectAutoTransferWithdrawCrypto);

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
    dispatch(getCryptoSettingsThunk());
  }, [dispatch]);

  const handleConfirmSetting = () => {
    if (dialog.value === 'autoTransferWithdrawCrypto') {
      dispatch(
        updateAutoTransferCryptoWithdrawThunk({
          enabled: !autoTransferWithdrawCrypto,
        }),
      );
    }
  };

  const handleCloseDialog = () => setDialog({ name: '', value: undefined });

  return (
    <>
      <Helmet>
        <title>
          {t('Auto transfer')} - {APP_NAME}
        </title>
      </Helmet>
      <LayoutContainer header={t('Auto transfer')} maxWidth={false}>
        <Box mb={2}>
          {consoleStatusCrypto === StatusEnum.SUCCEEDED ? (
            <>
              <Box display="flex" alignItems="center" mt={3}>
                <Toggle
                  checked={autoTransferWithdrawCrypto}
                  onClick={(e) => {
                    e.preventDefault();
                    if (
                      isLegalPermission(
                        PerformPermission.adminConsoleCrypto.updateAutoTransferCryptoWithdraw,
                        userPermissions,
                      )
                    ) {
                      setDialog({ name: 'confirm', value: 'autoTransferWithdrawCrypto' });
                    } else {
                      iToast.error({
                        title: t('Not authorized'),
                      });
                    }
                  }}
                  style={{ marginRight: 10 }}
                />
                <Typography variant={TypoVariants.body2} weight={TypoWeights.bold}>
                  {t('Auto transfer withdraw crypto')}
                </Typography>
              </Box>
            </>
          ) : (
            <Box display="flex" alignItems="center">
              <CircularProgress />
            </Box>
          )}
        </Box>
      </LayoutContainer>
      {dialog.name === 'confirm' && <DialogConfirm onClose={handleCloseDialog} onConfirm={handleConfirmSetting} />}
    </>
  );
};

export default AutoApproval;
