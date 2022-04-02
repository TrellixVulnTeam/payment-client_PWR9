import { TellerRevenue } from '@mcuc/vision/vision_pb';
import { Box, Grid } from '@material-ui/core';
import React from 'react';
import { t } from 'i18next';

import { useAppSelector } from 'redux/store';
import { selectUsersMap } from 'redux/features/common/slice';
import { selectTopTellerRevenueList } from 'redux/features/report/slice';

import AlopayTable from 'components/AlopayTable';
import { AvatarAndUsername } from 'components/Table/lib';
import Paper, { PaperRadius } from 'components/StyleGuide/Paper';
import Typography, { TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { formatCurrency } from 'utils/common';
import { CURRENCY_TYPE } from 'utils/constant/payment';

interface Props {}

const TopPaymentMethod = (props: Props) => {
  const topTellerRevenueList = useAppSelector(selectTopTellerRevenueList);
  const usersMap = useAppSelector(selectUsersMap);

  const columns = [
    {
      Header: t('{{key}} name', { key: t('Teller').toLowerCase() }),
      accessor: (row: TellerRevenue.AsObject) => (
        <AvatarAndUsername name={usersMap[row.userId]?.displayName} avatar={usersMap[row.userId]?.metadata.picture} />
      ),
    },
    {
      Header: t('User ID'),
      accessor: (row: TellerRevenue.AsObject) => row.userId || '-',
    },
    {
      Header: `${t('Total Revenue')} (${CURRENCY_TYPE.VND})`,
      accessor: (row: TellerRevenue.AsObject) => formatCurrency(row.amount),
    },
  ];

  return (
    <Paper radius={PaperRadius.max} style={{ height: '100%' }}>
      <Box p={4}>
        {/*  HEADER */}
        <Grid container direction="column" spacing={1}>
          <Grid item>
            <Typography variant={TypoVariants.head2} weight={TypoWeights.bold}>
              {t('Top Teller')}
            </Typography>
          </Grid>
          {/* CONTENT */}
          <Grid item>
            <Box py={2}>
              <AlopayTable columns={columns} data={topTellerRevenueList.topTellerRevenueList} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default React.memo(TopPaymentMethod);
