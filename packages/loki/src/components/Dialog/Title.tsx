import * as React from 'react';
import { IconButton, Box } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { X } from 'assets/icons/ILT';
import { uppercaseFirstLetterAllWords } from 'utils/common/string';
import DialogStepper from './Stepper';

const useStyles = makeStyles<Theme>((theme) => ({
  closeButton: {
    position: 'absolute',
    right: '18px',
  },
}));

export declare interface DialogTitleProps {
  title: React.ReactNode | string;
  subtitle?: React.ReactNode | string;
  activeStep?: number;
  steps?: {
    label: string;
  }[];
  handleClose: () => void;
}

const DialogTitle = (props: DialogTitleProps) => {
  const { handleClose, subtitle, activeStep, steps, title } = props;
  const classes = useStyles();

  return (
    <Box p={4} pb={2}>
      <Box display="flex" alignItems="center">
        {React.isValidElement(title) ? (
          title
        ) : (
          <Typography variant={TypoVariants.head2} type={TypoTypes.default} weight={TypoWeights.bold}>
            {uppercaseFirstLetterAllWords(typeof title === 'string' ? title : 'unknown')}
          </Typography>
        )}
        <IconButton aria-label="close" className={classes.closeButton} onClick={handleClose}>
          <X style={{ color: '#031352' }} />
        </IconButton>
      </Box>

      {subtitle && (
        <Box mt={1}>
          <Typography variant={TypoVariants.body1} type={TypoTypes.sub} weight={TypoWeights.light}>
            {subtitle}
          </Typography>
        </Box>
      )}
      {steps ? <DialogStepper activeStep={activeStep as number} steps={steps} /> : null}
    </Box>
  );
};

export default DialogTitle;
