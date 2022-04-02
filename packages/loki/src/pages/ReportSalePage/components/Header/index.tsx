import { useTranslation } from 'react-i18next';
import Grid from 'components/StyleGuide/Grid';
import Typography, { TypoWeights, TypoVariants } from 'components/StyleGuide/Typography';
import { uppercaseFirstLetterAllWords } from 'utils/common/string';

interface Props {}

const HeaderActions = (props: Props) => {
  const { t } = useTranslation();
  return (
    <Grid container alignItems="center" justifyContent="space-between">
      <Grid item xs="auto">
        <Typography weight={TypoWeights.bold} variant={TypoVariants.head1}>
          {uppercaseFirstLetterAllWords(t('Sale Report'))}
        </Typography>
      </Grid>
    </Grid>
  );
};

export default HeaderActions;
