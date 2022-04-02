import { Box } from '@material-ui/core';
import { makeStyles, Theme } from '@material-ui/core/styles';
import clsx from 'clsx';
import Typography, { TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';
import { t } from 'i18next';

const useStyles = makeStyles<Theme>((theme) => ({
  steps: {
    display: 'flex',
  },
  step: {
    flex: 1,
    height: '4px',
    backgroundColor: '#D6DEFF',
    borderRadius: '999px',
    '&:not(:last-child)': {
      marginRight: '4px',
    },
  },
  stepActive: {
    backgroundColor: theme.palette.primary.main,
  },
}));

export declare interface DialogStepperProps {
  activeStep: number;
  steps: {
    label: string;
  }[];
}

const DialogStepper = (props: DialogStepperProps) => {
  const { activeStep, steps } = props;
  const classes = useStyles();

  return (
    <>
      {activeStep < steps.length ? (
        <Box>
          <Box my={2}>
            <div className={classes.steps}>
              {steps.map((_, indexStep) => (
                <div
                  className={clsx(classes.step, {
                    [classes.stepActive]: indexStep <= activeStep,
                  })}
                />
              ))}
            </div>
          </Box>
          <Typography variant={TypoVariants.head3} type={TypoTypes.sub}>
            {t('Step {{from}} of {{to}}: {{label}}', {
              from: activeStep + 1,
              to: steps.length,
              label: steps[activeStep]?.label,
            })}
          </Typography>
        </Box>
      ) : null}
    </>
  );
};

export default DialogStepper;
