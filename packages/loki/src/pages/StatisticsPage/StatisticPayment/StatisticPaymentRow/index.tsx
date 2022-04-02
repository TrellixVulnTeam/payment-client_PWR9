import { GetStatisticReply } from '@mcuc/stark/howard_pb';
import { Grid } from '@material-ui/core';
import React from 'react';
import i18n from 'i18n';
import { useTranslation } from 'react-i18next';
import _isEmpty from 'lodash-es/isEmpty';
import _upperCase from 'lodash-es/upperCase';
import _upperFirst from 'lodash-es/upperFirst';

import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { PeriodType } from 'context/url_params_context/resolve_url_params';
import { useGetUrlParams } from 'context/url_params_context/use_url_params';

import StatisticBox from 'pages/StatisticsPage/StatisticBox';

interface Props {
  title: string;
  data: GetStatisticReply.AsObject;
}

const defaultProps = {
  title: i18n.t('Top-up'),
  data: {
    order: {
      number: 0,
      percent: 0,
    },
    amount: {
      number: 0,
      percent: 0,
    },
    user: {
      number: 0,
      percent: 0,
    },
    arppu: {
      number: 0,
      percent: 0,
    },
  },
};

const StatisticPaymentRow = (props: Props) => {
  const { t } = useTranslation();

  const { data, title } = { ...defaultProps, ...props };
  const { period } = useGetUrlParams();

  const periodText = React.useMemo(() => {
    switch (period) {
      case PeriodType.Daily:
        return 'day';
      case PeriodType.Weekly:
        return 'week';
      case PeriodType.Monthly:
        return 'month';
      default:
        return 'UNKNOWN';
    }
  }, [period]);

  if (!data) return null;
  const keysList = Object.keys(data);
  if (_isEmpty(keysList)) return null;

  const upperTitle = (title) => {
    if (title.toString().toLowerCase() === 'arppu') {
      return _upperCase(title);
    }
    return _upperFirst(title);
  };

  const getUnit = (key) => {
    if (key === 'order' || key === 'user') return t('Count');
    if (key === 'amount' || key === 'arppu') return 'VND';
    return null;
  };

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item>
        <Typography variant={TypoVariants.head3} weight={TypoWeights.bold} type={TypoTypes.titleSub}>
          {title}
        </Typography>
      </Grid>
      <Grid item>
        <Grid container spacing={3}>
          {keysList.map((key, index) => (
            <Grid item xs={12} sm={6} md={6} lg={3} xl={3} key={`${key}-${index}`}>
              <StatisticBox
                data={{
                  title: t(upperTitle(key)),
                  unit: getUnit(key),
                  value: data[key]?.number,
                  direction: data[key]?.percent < 0 ? 'down' : 'up',
                  percent: Math.abs(data[key]?.percent) || 0,
                  description: t('From this time {{period}}', { period: t('Last ' + periodText).toLowerCase() }),
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default StatisticPaymentRow;
