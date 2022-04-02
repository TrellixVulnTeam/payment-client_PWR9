import { Voucher } from '@mcuc/natasha/natasha_pb';
import { t } from 'i18next';
import { useAppSelector } from 'redux/store';
import { selectUsersMap } from 'redux/features/common/slice';
import Box from 'components/StyleGuide/Box';
import Grid from 'components/StyleGuide/Grid';
import Divider from 'components/StyleGuide/Divider';
import Paper, { PaperBackgrounds, PaperRadius } from 'components/StyleGuide/Paper';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import useUsersMap from 'hooks/useUsersMap';

interface Props {
  data: Voucher.AsObject;
}

const PerformedByVoucherDetail = (props: Props) => {
  const { data } = { ...props };
  useUsersMap([+data?.createdBy]);
  const usersMap = useAppSelector(selectUsersMap);

  return (
    <Paper background={PaperBackgrounds.regular} radius={PaperRadius.max}>
      <Box p={8}>
        <Grid container direction="column" spacing={8}>
          <Grid item>
            <Typography weight={TypoWeights.bold} variant={TypoVariants.head2}>
              {t('Performed by')}
            </Typography>
          </Grid>
          <Grid item>
            <Grid container direction="column" spacing={4}>
              {/* row */}
              <Grid item>
                <Grid container spacing={4}>
                  {/* item */}
                  <Grid item xs={12} md={6}>
                    <Grid container direction="column" spacing={1}>
                      <Grid item>
                        <Typography type={TypoTypes.sub}>{t('Created by')}</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                          {usersMap[+data.createdBy]?.metadata.fullName || '---------'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* item */}
                  {/* item */}
                  <Grid item xs={12} md={6}>
                    <Grid container direction="column" spacing={1}>
                      <Grid item>
                        <Typography type={TypoTypes.sub}>{t('Creator note')}</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                          {data.note || '---------'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* item */}
                </Grid>
              </Grid>
              {/* row */}
              <Grid item>
                <Divider />
              </Grid>
              {/* row */}
              <Grid item>
                <Grid container spacing={4}>
                  {/* item */}
                  <Grid item xs={12} md={6}>
                    <Grid container direction="column" spacing={1}>
                      <Grid item>
                        <Typography type={TypoTypes.sub}>{t('Handled by')}</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                          {usersMap[+data.handledBy]?.metadata.fullName || '---------'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* item */}
                  {/* item */}
                  <Grid item xs={12} md={6}>
                    <Grid container direction="column" spacing={1}>
                      <Grid item>
                        <Typography type={TypoTypes.sub}>{t('Handler note')}</Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                          {data.handlerNote || '---------'}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  {/* item */}
                </Grid>
              </Grid>
              {/* row */}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default PerformedByVoucherDetail;
