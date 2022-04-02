import { VoucherStatus } from '@mcuc/natasha/natasha_pb';
import { t } from 'i18next';
import cn from 'classnames';
import Grid from 'components/StyleGuide/Grid';
import Typography, { TypoTypes, TypoWeights } from 'components/StyleGuide/Typography';
import styles from './styles.module.scss';

interface Props {
  data: VoucherStatus;
}

const VoucherStatusComp = (props: Props) => {
  const { data } = { ...props };
  return (
    <Grid container spacing={2} alignItem="center">
      <Grid item xs="auto">
        <div className={cn(styles['point'], styles[`status-${data}`])} />
      </Grid>
      <Grid item xs="auto">
        <Typography type={TypoTypes.sub} weight={TypoWeights.bold}>
          {data === VoucherStatus.PROCESSING && t('Processing')}
          {data === VoucherStatus.COMPLETED && t('Completed')}
          {data === VoucherStatus.CANCELED && t('Canceled')}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default VoucherStatusComp;
