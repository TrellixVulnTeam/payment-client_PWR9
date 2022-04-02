import { makeStyles, Theme } from '@material-ui/core/styles';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';

const useStyles = makeStyles<Theme>((theme) => ({
  formControl: {
    width: '100%',
  },
}));

type ComponentFieldProps = {
  label?: string;
  component: Function;
  fieldProps: any;
};

const ComponentField: React.FunctionComponent<ComponentFieldProps> = ({
  label,
  component: Component,
  fieldProps,
  ...restProps
}) => {
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
      <Component {...fieldProps} {...restProps} />
    </FormControl>
  );
};

export default ComponentField;
