import { ReactElement } from 'react';
import { Typography } from '@material-ui/core';

interface Props {
  cell: any;
}

function Name({ cell }: Props): ReactElement {
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

export default Name;
