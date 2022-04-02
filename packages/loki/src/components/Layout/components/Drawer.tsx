import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import React from 'react';
import { Link } from 'react-router-dom';

import AlopayLogo from 'assets/AlopayLogo';
import { HOME } from 'configs/routes/path';
import SidebarList from './Menu';
import { DRAWER_WIDTH, TOOLBAR_HEIGHT } from '../constants';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  containerDrawer: {
    margin: '0 12px',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: DRAWER_WIDTH,
      flexShrink: 0,
    },
  },
  // necessary for content to be below app bar
  toolbar: {
    height: TOOLBAR_HEIGHT,
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(2),
  },
  drawerPaper: {
    width: DRAWER_WIDTH,
    borderRight: '1px solid #D6DEFF',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  sidebarList: {
    marginTop: theme.spacing(2),
  },
}));

function DrawerSidebar(props) {
  const { window } = props;

  const classes = useStyles();
  const theme = useTheme();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <div className={classes.containerDrawer}>
      <div className={classes.toolbar}>
        <Link to={HOME}>
          <AlopayLogo />
        </Link>
      </div>
      <div className={classes.sidebarList}>
        <SidebarList />
      </div>
    </div>
  );

  const container = window !== undefined ? () => window().document.body : undefined;

  return (
    <nav className={classes.drawer} aria-label="mailbox folders">
      {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
      <Hidden smUp implementation="css">
        <Drawer
          container={container}
          variant="temporary"
          anchor={theme.direction === 'rtl' ? 'right' : 'left'}
          open={mobileOpen}
          onClose={handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden xsDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  );
}

export default DrawerSidebar;
