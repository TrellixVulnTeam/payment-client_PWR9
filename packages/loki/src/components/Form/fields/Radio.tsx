import { Box, Grid, GridSize } from '@material-ui/core';
import { Radio } from 'components/StyleGuide/Radio';
import RadioGroup from 'components/StyleGuide/RadioGroup';
import Typography, { TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { IRadioField } from '../types';

const RadioField: React.FC<IRadioField> = ({ options, columns = 1, value, onChange, ...restProps }) => {
  return (
    <Box my={1}>
      <RadioGroup onChange={onChange} selected={value} {...restProps}>
        <Grid container spacing={2}>
          {options.map((item) => (
            <Grid item xs={(12 / (columns as number)) as GridSize}>
              <Radio value={item.value}>
                <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                  {item.name}
                </Typography>
              </Radio>
            </Grid>
          ))}
        </Grid>
      </RadioGroup>
    </Box>
  );
};

export default RadioField;
