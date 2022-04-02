import { useTheme } from '@material-ui/core/styles';

import Typography, { TypographyProps } from '@material-ui/core/Typography';
import { formatCurrency, MIN_BALANCE } from 'utils/common';

type MerchantBalanceProps = {
  balance: number;
} & TypographyProps;

const MerchantBalance: React.FunctionComponent<MerchantBalanceProps> = ({
  balance,
  ...props
}) => {
  const theme = useTheme();

  const getColor = () => {
    if (balance <= 0) return theme.palette.error.main;
    if (balance <= MIN_BALANCE) return theme.palette.warning.main;
    return theme.palette.secondary.main;
  };

  return (
    <Typography
      variant="h1"
      style={{
        color: getColor(),
      }}
      {...props}
    >
      {formatCurrency(balance)}
    </Typography>
  );
};

export default MerchantBalance;
