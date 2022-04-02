import { makeStyles } from '@material-ui/core/styles';
import DrawerSidebar from './components/Drawer';
import MenuAppBar from './components/Appbar';
import { TOOLBAR_HEIGHT } from './constants';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  toolbar: {
    height: TOOLBAR_HEIGHT,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(4),
  },
  main: {
    flexGrow: 1,
    marginTop: TOOLBAR_HEIGHT,
    overflowX: 'hidden',
  },
}));

const LayoutDashboard: React.FC = ({ children }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <MenuAppBar />
      <DrawerSidebar />
      <main className={classes.main}>{children}</main>
    </div>
  );
};

export default LayoutDashboard;
