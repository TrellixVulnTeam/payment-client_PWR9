import { t } from 'i18next';
import { Box, GridSize } from '@material-ui/core';
import Grid from 'components/StyleGuide/Grid';
import { Button, ButtonVariants } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';
import styles from './styles.module.scss';

type Props = {
  spacing?: number;
  list: {
    component: React.ReactNode;
    width: {
      xs?: GridSize;
      sm?: GridSize;
      md?: GridSize;
      lg?: GridSize;
      xl?: GridSize;
    };
  }[];
  onClear?: () => void;
  showReset?: boolean;
  className?: string;
};

const FilterBar = ({ spacing = 3, list, onClear, showReset, className }: Props) => {
  return (
    <Grid container spacing={spacing}>
      {list.map((item, idx) => (
        <Grid key={idx} item {...item.width} className={className}>
          {item.component}
        </Grid>
      ))}
      {onClear && showReset && (
        <Grid item xs={1}>
          <Box ml={1} display="flex" alignItems="center">
            <Box className={styles.line}></Box>
            <Button variant={ButtonVariants.invert} onClick={onClear}>
              <Typography variant={TypoVariants.button1} type={TypoTypes.primary}>
                {t('Reset')}
              </Typography>
            </Button>
          </Box>
        </Grid>
      )}
    </Grid>
  );
};

export default FilterBar;
