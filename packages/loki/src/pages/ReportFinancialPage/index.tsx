import { Box } from '@material-ui/core';
import React from 'react';
import { t } from 'i18next';
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router-dom';
import Typography, { TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';
import { APP_NAME } from 'utils/common';

const ReportSale: React.FC = () => {
  const history = useHistory();
  return (
    <>
      <Helmet>
        <title>{t('Report Financial')} - {APP_NAME}</title>
      </Helmet>
      <Box mt={3} width="100%" display="flex" flexDirection="column" justifyContent="center" textAlign="center">
        <Typography variant={TypoVariants.head1}>{t('Coming Soon')}</Typography>
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
    </>
  );
};

export default ReportSale;
