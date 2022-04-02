import { t } from 'i18next';
import Alert from '@material-ui/lab/Alert';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { Dialog, DialogProps, DialogContent, Box, DialogActions } from '@material-ui/core';
import { useState } from 'react';
import cn from 'classnames';
import { Button, ButtonSizes, ButtonVariants } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import DialogTitle from './Title';
import DialogDiscard from './Discard';

const useStyles = makeStyles<Theme>((theme) => ({
  MuiDialogRoot: {
    borderRadius: '16px',
  },
  MuiDialogContentRoot: {
    padding: theme.spacing(4),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  dialogActions: {
    padding: theme.spacing(3),
    width: '100%',
    '& > button:not(:last-child)': {
      marginBottom: '16px',
    },
  },
  strokeHeader: {
    borderTop: '1px solid #D6DEFF',
  },
  strokeFooter: {
    borderTop: '1px solid #D6DEFF',
    marginTop: theme.spacing(2),
  },
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
  dialog: {
    position: 'relative',
  },
  dialogContent: {
    position: 'relative',
  },
}));

type Props = {
  title: React.ReactNode | string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  onClose: () => void;
  header?: React.ReactNode | string;
  subtitle?: React.ReactNode | string;
  steps?: { label: string }[];
  activeStep?: number;
  open?: boolean;
  errorMessage?: string;
  preventClose?: any;
  isStroke?: boolean;
  handleBack?: () => void;
};

const AlopayDialog = ({
  title,
  subtitle,
  onClose,
  activeStep,
  actions,
  steps,
  children,
  handleBack,
  errorMessage,
  open = true,
  preventClose,
  isStroke,
  ...props
}: Props & Omit<DialogProps, keyof Props>) => {
  const classes = useStyles();

  const [dialog, setDialog] = useState({
    name: undefined,
    value: undefined,
  });

  const handleClose = () => {
    if (preventClose) {
      setDialog({
        name: 'discard',
        value: undefined,
      });
    } else {
      onClose();
    }
  };

  const handleDiscard = () => {
    setDialog({
      name: undefined,
      value: undefined,
    });
    onClose();
  };

  const handleCancel = () => {
    setDialog({
      name: undefined,
      value: undefined,
    });
  };

  const classOfDialogActions = cn({
    [classes.strokeFooter]: isStroke,
  });

  const classOfDialogContent = cn(classes.dialogContent, {
    [classes.strokeHeader]: isStroke,
  });

  const classOfDialog = cn(classes.dialog);

  return (
    <>
      {dialog.name === undefined && (
        <Dialog disableEnforceFocus fullWidth open={open} onClose={handleClose} className={classOfDialog} {...props}>
          <DialogTitle
            steps={steps}
            title={title}
            subtitle={subtitle}
            activeStep={activeStep}
            handleClose={handleClose}
          />
          {children && (
            <DialogContent className={classOfDialogContent} classes={{ root: classes.MuiDialogContentRoot }}>
              {errorMessage && (
                <Box mb={2}>
                  <Alert severity="error">{errorMessage}</Alert>
                </Box>
              )}
              {children}
            </DialogContent>
          )}
          {actions && (
            <DialogActions className={classOfDialogActions}>
              <Box className={classes.dialogActions}>
                {actions}
                {handleBack && activeStep > 0 && (
                  <Button fullWidth variant={ButtonVariants.secondary} size={ButtonSizes.lg} onClick={handleBack}>
                    <Typography variant={TypoVariants.button1} type={TypoTypes.default} weight={TypoWeights.medium}>
                      {t('Back to previous step')}
                    </Typography>
                  </Button>
                )}
              </Box>
            </DialogActions>
          )}
        </Dialog>
      )}
      {dialog.name === 'discard' && <DialogDiscard open={true} onClose={handleCancel} onDiscard={handleDiscard} />}
    </>
  );
};

export default AlopayDialog;
