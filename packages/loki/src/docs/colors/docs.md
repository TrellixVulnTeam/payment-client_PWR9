```jsx
import _chunk from 'lodash-es/chunk';
import colors from './colors';
import styles from './styles.module.scss';
import { Grid, Box } from '@material-ui/core';
import Typography from 'components/StyleGuide/Typography';

function getColor(text, sub) {
  const value = (text || '').trim()
  const isVariable = /^\$/i.test(value);
  const color = colors.find(item => item[0] === value);
  return isVariable ? color && color[1] : value;
}

const categories = _chunk(colors, 1);

<Grid spacing={2} container>
  {categories.map((item, index) => (
    <Grid xs={3} item key={index}>
      {item.filter(item => item[0] && item[1]).map((sub, index) => (
        <Grid key={index} className={styles.item} item xs={12} style={{ backgroundColor: getColor(sub[1], sub) }}>
          <Box p={1}>
            <Typography className={styles.label}>
              {sub[0]}: {sub[1]}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  ))}
</Grid>;
```
