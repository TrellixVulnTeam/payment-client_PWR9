import { Grid } from '@material-ui/core';
import Stack from 'components/StyleGuide/Stack';


export declare interface ToolbarProps {
  leftControl?: React.ReactNode;
  rightControl?: React.ReactNode;
}

const Toolbar = ({ leftControl, rightControl }: ToolbarProps) => {
  return (
    <Grid container xs={12} justifyContent="space-between">
      <Grid item>
        <Stack spacing={2}>
          {leftControl}
        </Stack>
      </Grid>
      <Grid item>
        <Stack spacing={2}>
          {rightControl}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Toolbar;
