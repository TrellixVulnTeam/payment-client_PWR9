import { Box, Grid } from '@material-ui/core';
import AllowedTo, { Perform } from 'components/AllowedTo';
import Paper, { PaperBackgrounds, PaperRadius } from 'components/StyleGuide/Paper';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { formatCurrency } from 'utils/common';
import styles from './styles.module.scss';

interface Props {
  title: string;
  total: number;
  value: number;
  percent: number;
  link: string;
  perform: Perform;
}

const VoucherBox: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const { title, total, value, percent, link, perform } = { ...props };
  return (
    <div className={styles['root']}>
      <Paper background={PaperBackgrounds.ghost} radius={PaperRadius.bold}>
        <Box p={3}>
          <Grid container spacing={2}>
            <Grid item container alignItems="center" justifyContent="space-between">
              <Grid item xs="auto">
                <Typography variant={TypoVariants.head3}>{title}</Typography>
              </Grid>
              <AllowedTo perform={perform}>
                <Grid item xs="auto">
                  <Link to={link}>
                    <Typography variant={TypoVariants.button1} type={TypoTypes.link}>
                      {t('View detail')}
                    </Typography>
                  </Link>
                </Grid>
              </AllowedTo>
            </Grid>
            <Grid item container>
              {/* left */}
              <Grid item xs={6} md={6}>
                <Typography variant={TypoVariants.head4} type={TypoTypes.titleSub}>
                  {t('Total')}
                </Typography>
                <Typography variant={TypoVariants.head1} type={TypoTypes.secondary}>
                  {formatCurrency(total)}
                </Typography>
              </Grid>
              {/* left */}
              {/* right */}
              <Grid item xs={6} md={6}>
                <Typography variant={TypoVariants.head4} type={TypoTypes.titleSub}>
                  {t('{{key}} in {{day}} days', { key: t(title), day: 30 })}
                  <Typography
                    component="span"
                    variant={TypoVariants.body1}
                    weight={TypoWeights.bold}
                    type={percent >= 0 ? TypoTypes.success : TypoTypes.error}
                  >
                    ({percent}%)
                  </Typography>
                </Typography>
                <Typography variant={TypoVariants.head1} type={TypoTypes.secondary}>
                  {formatCurrency(value)}
                </Typography>
              </Grid>
              {/* right */}
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </div>
  );
};

export default VoucherBox;
