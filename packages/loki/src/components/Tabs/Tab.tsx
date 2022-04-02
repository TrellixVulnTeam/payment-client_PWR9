import { withStyles, Theme, createStyles } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';

interface StyledTabProps {
  value: any;
  label: React.ReactNode | string;
}

const CustomTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: 'none',
      minWidth: 72,
      marginRight: theme.spacing(4),
      fontFamily: 'Kanit',
      fontWeight: 500,
      color: theme.palette.text.primary,
      '&:hover': {
        color: theme.palette.primary.light,
        opacity: 1,
      },
      '&$selected': {
        color: theme.palette.primary.main,
        fontWeight: theme.typography.fontWeightMedium,
      },
      '&:focus': {
        color: theme.palette.primary.main,
      },
    },
    selected: {},
  }),
)((props: StyledTabProps) => <Tab disableRipple {...props} />);

export default CustomTab;
