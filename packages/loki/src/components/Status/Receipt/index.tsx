import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import { useTranslation } from 'react-i18next';
import StatusComponent from '../index';
import { Status } from '@mcuc/stark/stark_pb';

type StatusReceiptProps = {
  value?: number;
};

const StatusReceipt: React.FunctionComponent<StatusReceiptProps> = ({ value = 0 }) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const colorType = React.useMemo(() => {
    switch (value) {
      case Status.STATUS_UNSPECIFIED:
        return {
          color: theme.palette.error.main,
          type: t('Unspecified'),
        };
      case Status.CREATED:
        return {
          color: theme.palette.warning.main,
          type: t('New'),
        };
      case Status.CANCELED:
        return {
          color: theme.palette.error.main,
          type: t('Canceled'),
        };
      case Status.APPROVED:
        return {
          color: theme.palette.secondary.main,
          type: t('Approved'),
        };
      case Status.SUBMITTING:
        return {
          color: theme.palette.primary.main,
          type: t('Submitting'),
        };
      case Status.SUBMITTED:
        return {
          color: theme.palette.primary.main,
          type: t('Submitted'),
        };
      case Status.COMPLETED:
        return {
          color: theme.palette.success.main,
          type: t('Successful'),
        };
      case Status.REJECTED:
        return {
          color: theme.palette.error.main,
          type: t('Rejected'),
        };
      case Status.REJECTING:
        return {
          color: theme.palette.error.main,
          type: t('Rejecting'),
        };
      case Status.REJECT_FAILED:
        return {
          color: theme.palette.error.main,
          type: t('Rejection failed'),
        };
      case Status.APPROVE_FAILED:
        return {
          color: theme.palette.error.main,
          type: t('Approval failed'),
        };
      case Status.SUBMIT_FAILED:
        return {
          color: theme.palette.error.main,
          type: t('Submission failed'),
        };
      default:
        return {
          color: theme.palette.error.main,
          type: t('Unspecified'),
        };
    }
  }, [t, value, theme.palette]);

  return <StatusComponent value={value} colorType={colorType} />;
};

export default StatusReceipt;
