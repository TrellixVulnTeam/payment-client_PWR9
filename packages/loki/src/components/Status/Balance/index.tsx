import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import StatusComponent from '../index';
import { useTranslation } from 'react-i18next';

type StatusBalanceProps = {
  value: 'eligible' | 'uneligible' | 'runningOut' | '';
};

const StatusBalance: React.FunctionComponent<StatusBalanceProps> = ({ value = 0 }) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const colorType = React.useMemo(() => {
    switch (value) {
      case 'eligible':
        return {
          color: theme.palette.success.main,
          type: t('Eligible'),
        };
      case 'uneligible':
        return {
          color: theme.palette.error.main,
          type: t('Uneligible'),
        };
      case 'runningOut':
        return {
          color: theme.palette.warning.main,
          type: t('Running out'),
        };
      default:
        return {
          color: theme.palette.error.main,
          type: t('Unspecified'),
        };
    }
  }, [t, value, theme]);

  return <StatusComponent value={value} colorType={colorType} />;
};

export default StatusBalance;
