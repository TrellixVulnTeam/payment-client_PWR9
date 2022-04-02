import { makeStyles, withStyles, Theme } from '@material-ui/core/styles';
import OutlinedInput, {
  OutlinedInputProps,
} from '@material-ui/core/OutlinedInput';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import { Typography } from '@material-ui/core';

const CssOutlinedInput = withStyles({
  root: {},
})(OutlinedInput);

const useStyles = makeStyles<Theme>((theme) => ({
  formControl: {
    width: '100%',
  },
}));

type ILTInputProps = {
  label?: string;
} & OutlinedInputProps;

export default function ILTInput(props: ILTInputProps) {
  const { label, ...rest } = props;
  const classes = useStyles();
  return (
    <FormControl component="fieldset" className={classes.formControl}>
      {label && (
        <FormLabel>
          <Typography variant="body1">{label}</Typography>
        </FormLabel>
      )}
      <CssOutlinedInput {...rest} />
    </FormControl>
  );
}
