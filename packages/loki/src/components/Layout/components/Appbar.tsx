import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import { makeStyles } from '@material-ui/core/styles';
import { Box, Grid } from '@material-ui/core';
import React from 'react';
import AlopayBreadcrumb from 'components/AlopayBreadcrumbs/Layout';
import MenuLanguages from './MenuLanguages';
import AvatarProfile from './AvatarProfile';

const drawerWidth = 256;

const useStyles = makeStyles((theme) => ({
  appBar: {
    backgroundColor: '#FFFFFF',
    borderBottom: '1px solid #D6DEFF',
    boxShadow: 'none',
    [theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
}));

const MenuAppBar: React.FC = () => {
  const classes = useStyles();
  return (
    <AppBar position="fixed" className={classes.appBar}>
      <Toolbar>
        <Grid container alignItems="center" justifyContent="space-between">
          <Grid item xs="auto">
            <Box pl={1}>
              <AlopayBreadcrumb />
            </Box>
          </Grid>
          <Grid item xs="auto">
            <Box display="flex" alignItems="center">
              <MenuLanguages />
              <AvatarProfile />
            </Box>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default React.memo(MenuAppBar);
