import { makeStyles, Theme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';

const useStyles = makeStyles<Theme>((theme) => ({
  formControl: {
    width: '100%',
  },
}));

type FormInputProps = {
  label?: string;
  value: string;
  formatValue: (value: string) => string;
};

const TypographyField: React.FunctionComponent<FormInputProps> = ({ label, value, formatValue }) => {
  const classes = useStyles();
  return (
    <FormControl component="fieldset" className={classes.formControl}>
      {label && (
        <FormLabel>
          <Typography variant={TypoVariants.body2} type={TypoTypes.sub} weight={TypoWeights.bold}>
            {label}
          </Typography>
        </FormLabel>
      )}
      <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
        {formatValue ? formatValue(value) : value}
      </Typography>
    </FormControl>
  );
};

export default TypographyField;
