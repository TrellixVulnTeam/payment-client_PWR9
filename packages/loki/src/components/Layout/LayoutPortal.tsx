import Box from '@material-ui/core/Box';
import Link from '@material-ui/core/Link';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Container from '@material-ui/core/Container';
import { makeStyles } from '@material-ui/core/styles';

import { useHistory } from 'react-router-dom';

import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import ILTLogo from 'assets/AlopayLogo';
import MenuLanguages from './components/MenuLanguages';

const useStyles = makeStyles((theme) => {
  return {
    root: {
      backgroundColor: theme.palette.background.default,
      display: 'flex',
      height: 'calc(100% - 64px)',
      width: '100%',
      overflow: 'hidden',
    },
    wrapper: { display: 'flex', flex: '1 1 auto', overflow: 'hidden' },
    container: {
      display: 'flex',
      flex: '1 1 auto',
      flexDirection: 'column',
      overflow: 'hidden',
    },
    content: {
      flex: '1 1 auto',
      overflow: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    },
    footer: {
      display: 'flex',
      flexDirection: 'column',
      flexWrap: 'wrap',
      alignItems: 'center',
    },
    footerWrapper: {
      display: 'block',
      marginBottom: '30px',
      width: '100%',
      textAlign: 'left',
      [theme.breakpoints.down('sm')]: {
        textAlign: 'center',
      },
    },
    logoWrapper: {
      width: '100%',
      display: 'flex',
      justifyContent: 'flex-start',
      [theme.breakpoints.down('sm')]: {
        justifyContent: 'center',
      },
    },
    logo: {
      height: '40px',
      width: 'unset',
      cursor: 'pointer',
    },
    appBar: {
      backgroundColor: '#fff',
    },
    customHeight: {
      height: 'auto',
      "min-height": 'calc(100% - 64px)',
    }
  };
});

export const Footer: React.FC = () => {
  const classes = useStyles();

  return (
    <footer className={classes.footerWrapper}>
      <Box className={classes.footer} whiteSpace="nowrap">
        <Typography component="div" variant={TypoVariants.body1} weight={TypoWeights.bold}>
          © 2021
        </Typography>
        <Typography component="div" variant={TypoVariants.body1} type={TypoTypes.sub} weight={TypoWeights.light}>
          {'Copyright by '}
          <Link color="inherit" href="#">
            <Typography component="span" variant={TypoVariants.body1} weight={TypoWeights.bold}>
              Alopay
            </Typography>
          </Link>{' '}
          {' | All rights reserved'}
        </Typography>
      </Box>
    </footer>
  );
};

export const Navbar: React.FC = () => {
  const history = useHistory();
  const classes = useStyles();

  return (
    <AppBar className={classes.appBar} position="static">
      <Container maxWidth="xl">
        <Toolbar>
          <Box className={classes.logoWrapper}>
            <ILTLogo onClick={() => history.push('/login')} className={classes.logo} />
          </Box>
          <Box width="140">
            <MenuLanguages />
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export const LayoutPortal: React.FC = ({ children }) => {
  const classes = useStyles();

  return (
    <>
      <Navbar />
      <div className={`${classes.root} ${classes.customHeight}`}>
        <div className={classes.wrapper}>
          <div className={classes.container}>
            <div className={classes.content}>{children}</div>
            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};
