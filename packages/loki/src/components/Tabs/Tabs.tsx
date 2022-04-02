import { createStyles, Theme, withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';

const CustomTabs = withStyles((theme: Theme) =>
  createStyles({
    root: {
      borderBottom: '1px solid #D6DEFF',
    },
    indicator: {
      backgroundColor: theme.palette.primary.main,
    },
  }),
)(Tabs);

export default CustomTabs;
