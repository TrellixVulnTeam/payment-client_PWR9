import React from 'react';
import { Box, CircularProgress } from '@material-ui/core';

const PageLoader: React.FC = () => {
  return (
    <Box mt={5} width="100%" height="100%" display="flex" alignItems="center" justifyContent="center">
      <Box p={3}>
        <CircularProgress color="inherit" />
      </Box>
    </Box>
  );
};

export default PageLoader;
