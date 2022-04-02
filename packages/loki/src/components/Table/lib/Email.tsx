import { Typography } from '@material-ui/core';
import { ReactElement } from 'react';

interface Props {
  cell: any;
}

function Email({ cell }: Props): ReactElement {
  return (
    <div
      style={{
        color: '#FFFFFF',
        backgroundColor: cell.value === 'FULLTIME' ? '#30CB00' : '#FFB41F',
        padding: '4px 12px',
        borderRadius: '4px',
        width: 'fit-content',
        whiteSpace: 'nowrap',
      }}
    >
      <Typography variant="body2" color="textSecondary">
        {cell.value === 'FULLTIME' ? 'Full time' : 'Part time'}
      </Typography>
    </div>
  );
}

export default Email;
