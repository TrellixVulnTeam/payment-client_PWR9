import React from 'react';
import { Box, Grid } from '@material-ui/core';
import AlopayTable from 'components/AlopayTable';
import Button, { ButtonVariants } from 'components/StyleGuide/Button';
import Paper, { PaperRadius } from 'components/StyleGuide/Paper';
import Typography, { TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { useTranslation } from 'react-i18next';
import styles from './styles.module.scss';

interface Props {}

const ReportList = (props: Props) => {
  const { t } = useTranslation();

  const columns = [
    {
      Header: t('Report name'),
    },
    {
      Header: t('Created date'),
    },
    {
      Header: t('Action'),
    },
  ];

  return (
    <Paper radius={PaperRadius.max} className={styles['root']}>
      <Box p={4}>
        <Grid container direction="column" spacing={3}>
          <Grid item>
            <Grid container justifyContent="space-between" alignItems="center" wrap="nowrap">
              <Grid item xs="auto">
                <Typography variant={TypoVariants.head2} weight={TypoWeights.bold}>
                  {t('Report list')}
                </Typography>
              </Grid>
              <Grid item xs="auto">
                <Button variant={ButtonVariants.secondary}>{t('See more report')}</Button>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <AlopayTable columns={columns} data={[]} />
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ReportList;
