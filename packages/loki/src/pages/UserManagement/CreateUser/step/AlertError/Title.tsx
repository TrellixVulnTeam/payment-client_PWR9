import { makeStyles, Theme } from '@material-ui/core/styles';
import { IconButton, Typography } from '@material-ui/core';
import { X } from 'assets/icons/ILT';

const useStyles = makeStyles<Theme>((theme) => ({
  titleContainer: {
    padding: theme.spacing(4),
    paddingBottom: theme.spacing(3),
    flex: '0 0 auto',
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(3),
    top: theme.spacing(3),
  },
}));

export declare interface TitleDialogProps {
  handleClose: () => void;
}

export const TitleDialog = (props: TitleDialogProps) => {
  const { handleClose } = props;
  const classes = useStyles();

  return (
    <div id="form-dialog-title" className={classes.titleContainer}>
      <Typography>Create new was failed</Typography>
      <IconButton
        aria-label="close"
        className={classes.closeButton}
        onClick={handleClose}
      >
        <X style={{ color: '#67677A' }} />
      </IconButton>
    </div>
  );
};
