import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Box } from '@material-ui/core';
import LayoutContainer from 'components/Layout/LayoutContainer';
import Typography, { TypoVariants } from 'components/StyleGuide/Typography';
import { t } from 'i18next';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { APP_NAME } from 'utils/common';
import ImageHomePage from 'assets/images/welcome.png';
import { TOOLBAR_HEIGHT } from 'components/Layout/constants';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      height: `calc(100vh - ${TOOLBAR_HEIGHT} - ${theme.spacing(8)}px)`,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
  }),
);

const HomePage: React.FC<any> = () => {
  const classes = useStyles();
  return (
    <>
      <Helmet>
        <title>
          {t('Welcome')} - {APP_NAME}
        </title>
      </Helmet>
      <LayoutContainer header={null}>
        <Box className={classes.root}>
          <Box mb={4}>
            <img src={ImageHomePage} alt="home page" />
          </Box>
          <Box width="100%" textAlign="center">
            <Typography variant={TypoVariants.head1}>{t('Welcome to {{key}} !!!', { key: APP_NAME })}</Typography>
          </Box>
        </Box>
      </LayoutContainer>
    </>
  );
};

export default HomePage;
