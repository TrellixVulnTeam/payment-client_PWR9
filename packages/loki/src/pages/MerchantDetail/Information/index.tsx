import { Box } from '@material-ui/core';
import { Merchant } from '@mcuc/natasha/natasha_pb';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from 'redux/store';
import { selectUsersMap } from 'redux/features/common/slice';
import { formatWithSchema } from 'utils/date';
import Paper, { PaperRadius } from 'components/StyleGuide/Paper';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { formatCurrency, MIN_BALANCE } from 'utils/common';
import { CURRENCY_TYPE } from 'utils/constant/payment';
import FormInfo from './FormInfo';

type MerchantInformationProps = {
  merchant: Merchant.AsObject;
};

const MerchantInformation: React.FC<MerchantInformationProps> = ({ merchant }) => {
  const { t } = useTranslation();

  const usersMap = useAppSelector(selectUsersMap);

  if (!merchant) return <></>;

  const contents = [
    {
      label: t('Contract term'),
      values: [
        {
          title: t('Start date'),
          value: formatWithSchema(new Date(2021, 0, 1).getTime(), 'dd MMMM, yyyy'),
        },
        {
          title: t('End date'),
          value: formatWithSchema(new Date(2025, 11, 31).getTime(), 'dd MMMM, yyyy'),
        },
        {
          title: t('Email'),
          value: merchant.emailContact,
        },
      ],
    },
    {
      label: t('Payment method'),
      values: [
        {
          title: t('Top-up'),
          value: 'Bank, E-Wallet, Telco, Crypto',
        },
        {
          title: t('Withdraw'),
          value: 'Bank, Telco, Crypto',
        },
      ],
    },
    {
      label: t('Safety withdraw limit'),
      values: [
        {
          title: `${t('Min balance')} (${CURRENCY_TYPE.VND})`,
          value: (
            <Typography variant={TypoVariants.head1} type={TypoTypes.secondary} weight={TypoWeights.bold}>
              {formatCurrency(MIN_BALANCE)}
            </Typography>
          ),
        },
      ],
    },
    {
      label: t('Created date'),
      values: [
        {
          title: t('From'),
          value: formatWithSchema(merchant.createdAt.seconds * 1000, 'dd MMMM, yyyy'),
        },
      ],
    },
    {
      label: t('Created by'),
      values: [
        {
          title: t('From'),
          value: usersMap[merchant.createdBy]?.displayName || '-',
        },
      ],
    },
    {
      label: 'Webhook',
      values: [
        {
          title: 'Webhook Url',
          value: merchant.webhookUrl || '-',
        },
        {
          title: 'Webhook Slack',
          value: merchant.slackWebhookUrl || '-',
        },
      ],
    },
  ];

  return (
    <Paper radius={PaperRadius.max} header={t('Information')}>
      <Box p={4}>
        <FormInfo contents={contents} />
      </Box>
    </Paper>
  );
};

export default MerchantInformation;
