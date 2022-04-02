import * as React from 'react';
import Box from '@material-ui/core/Box';

interface Props {
  children: React.ReactNode;
  index: string | number;
  value: string | number;
  className?: string;
  spacingBox?: number;
}

const TabPanel: React.FunctionComponent<Props> = (props) => {
  const { children, value, index, spacingBox = 3, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={spacingBox}>{children}</Box>}
    </div>
  );
};

export default TabPanel;
