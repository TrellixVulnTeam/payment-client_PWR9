import { Box } from '@material-ui/core';
import React from 'react';
import { t } from 'i18next';
import { ErrorBoundary as ErrorBoundaryWrapper } from 'react-error-boundary';
import useAuth from 'hooks/useAuth';
import LayoutDashboard from 'components/Layout/LayoutDashboard';
import Typography, { TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';
import { LayoutPortal } from 'components/Layout/LayoutPortal';

const ErrorBoundary: React.FC = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const Layout = isAuthenticated ? LayoutDashboard : LayoutPortal;
  return (
    <ErrorBoundaryWrapper
      onError={(error) => console.log('Error boundary: ', error)}
      fallback={
        <Layout>
          <Box mt={3} width="100%" display="flex" flexDirection="column" justifyContent="center" textAlign="center">
            <Typography variant={TypoVariants.head1}>{t('Oops, something wrong.')}</Typography>
            <Box mt={3}>
              <Typography
                style={{ cursor: 'pointer', textDecoration: 'underline' }}
                variant={TypoVariants.head3}
                type={TypoTypes.link}
                onClick={() => window.location.reload()}
              >
                {t('Reload page')}
              </Typography>
            </Box>
          </Box>
        </Layout>
      }
    >
      {children}
    </ErrorBoundaryWrapper>
  );
};

export default ErrorBoundary;
