import { Box } from '@material-ui/core';
import React from 'react';
import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router-dom';
import useAuth from 'hooks/useAuth';
import LayoutDashboard from 'components/Layout/LayoutDashboard';
import { LayoutPortal } from 'components/Layout/LayoutPortal';
import Typography, { TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';
import { APP_NAME } from 'utils/common';

const NotFoundPage: React.FC = () => {
  const history = useHistory();
  const { isAuthenticated } = useAuth();
  const Layout = isAuthenticated ? LayoutDashboard : LayoutPortal;
  return (
    <>
      <Helmet>
        <title>{t('404')} - {APP_NAME}</title>
      </Helmet>
      <Layout>
        <Box mt={3} width="100%" display="flex" flexDirection="column" justifyContent="center" textAlign="center">
          <Typography variant={TypoVariants.head1}>404 {t('Page not found')}</Typography>
          <Box mt={3}>
            <Typography
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
              variant={TypoVariants.head3}
              type={TypoTypes.link}
              onClick={() => history.goBack()}
            >
              {t('Go back')}
            </Typography>
          </Box>
        </Box>
      </Layout>
    </>
  );
};

export default NotFoundPage;
