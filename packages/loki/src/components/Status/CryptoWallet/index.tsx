import { CryptoWalletStatus } from '@mcuc/stark/ultron_pb';
import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import StatusComponent from '../index';
import { useTranslation } from 'react-i18next';

type StatusCryptoProps = {
  value?: number;
};

const StatusCrypto: React.FunctionComponent<StatusCryptoProps> = ({ value = 0 }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const colorType = React.useMemo(() => {
    switch (value) {
      case CryptoWalletStatus.USED:
        return {
          color: theme.palette.success.main,
          type: t('Used'),
        };
      case CryptoWalletStatus.BANNED:
        return {
          color: theme.palette.error.main,
          type: t('Banned'),
        };
      case CryptoWalletStatus.AVAILABLE:
        return {
          color: theme.palette.warning.main,
          type: t('Available'),
        };
      default:
        return {
          color: theme.palette.text.secondary,
          type: t('Unspecified'),
        };
    }
  }, [t, value, theme.palette]);

  return <StatusComponent value={value} colorType={colorType} />;
};

export default React.memo(StatusCrypto);
