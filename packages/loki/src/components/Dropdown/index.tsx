import { Button, Typography } from '@material-ui/core';
import { AngleDown } from 'assets/icons/ILT';

interface DropdownProps {
  title: string;
  size?: 'small' | 'medium';
}

const Dropdown = (props: DropdownProps) => {
  const { title, size = 'medium' } = props;
  return (
    <Button variant="outlined" size={size} endIcon={<AngleDown />}>
      <Typography>{title}</Typography>
    </Button>
  );
};

export default Dropdown;
