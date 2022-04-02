import Box from '@material-ui/core/Box';
import Step from '@material-ui/core/Step';
import Stepper from '@material-ui/core/Stepper';
import StepLabel from '@material-ui/core/StepLabel';
import StepConnector from '@material-ui/core/StepConnector';
import { StepIconProps } from '@material-ui/core';
import { makeStyles, Theme, createStyles, withStyles, useTheme } from '@material-ui/core/styles';
import { Timestamp } from 'google-protobuf/google/protobuf/timestamp_pb';
import React from 'react';
import cn from 'classnames';
import Typography, { TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';
import IconCheckSuccess from 'assets/icons/ILT/lib/CheckSuccess';
import { formatDateTime } from 'utils/date';
import { Status } from '@mcuc/stark/stark_pb';

const ConnectorApprove = withStyles((theme: Theme) =>
  createStyles({
    alternativeLabel: {
      top: 10,
      left: 'calc(-50% + 16px)',
      right: 'calc(50% + 16px)',
    },
    completed: {
      '& $line': {
        borderColor: theme.palette.success.main,
      },
    },
    active: {
      '& $line': {
        borderColor: theme.palette.success.main,
      },
    },
    error: {
      '& $line': {
        borderColor: theme.palette.error.main,
      },
    },
    line: {
      borderTopWidth: 3,
      borderRadius: 1,
    },
  }),
)(StepConnector);

const ConnectorRejected = withStyles((theme: Theme) =>
  createStyles({
    alternativeLabel: {
      top: 10,
      left: 'calc(-50% + 16px)',
      right: 'calc(50% + 16px)',
    },
    completed: {
      '& $line': {
        borderColor: theme.palette.error.main,
      },
    },
    line: {
      borderTopWidth: 3,
      borderRadius: 1,
    },
  }),
)(StepConnector);

const useStepIconStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      color: '#FFF',
      display: 'flex',
      height: 22,
      alignItems: 'center',
    },
    completed: {
      '& $line': {
        borderColor: theme.palette.success.main,
      },
    },
    active: {
      '& $line': {
        borderColor: theme.palette.success.main,
      },
    },
    error: {
      '& $line': {
        borderColor: theme.palette.error.main,
      },
    },
  }),
);

const StepIconApprove: React.FunctionComponent<StepIconProps> = ({ active, completed, error }) => {
  const theme = useTheme();
  const classes = useStepIconStyles();
  return (
    <div
      className={cn(classes.root, {
        [classes.active]: active,
        [classes.completed]: completed,
        [classes.active]: error,
      })}
    >
      {(completed || active) && error === false ? (
        <IconCheckSuccess style={{ fontSize: 24 }} fill={theme.palette.success.main} />
      ) : (
        <IconCheckSuccess style={{ fontSize: 24 }} fill={error ? theme.palette.error.main : '#CCCCCC'} />
      )}
    </div>
  );
};

const StepIconRefused: React.FunctionComponent = () => {
  const theme = useTheme();
  const classes = useStepIconStyles();

  return (
    <div className={classes.root}>
      <IconCheckSuccess style={{ fontSize: 24 }} fill={theme.palette.error.main} />
    </div>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    button: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  }),
);

type CustomizedSteppersProps = {
  status: Status;
  activeStep: { index: number; active: boolean; completed: boolean; error: boolean };
  stepsApproved: { label: string; dateTime: Timestamp.AsObject | undefined }[];
  stepsRefused: { label: string; dateTime: Timestamp.AsObject | undefined }[];
  stepsCanceled: { label: string; dateTime: Timestamp.AsObject | undefined }[];
};

const MAX_STEPS_REJECT = 2;

const CustomizedSteppers: React.FunctionComponent<CustomizedSteppersProps> = ({
  status,
  activeStep,
  stepsApproved,
  stepsRefused,
  stepsCanceled,
}) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {status === Status.REJECTED && (
        <Stepper alternativeLabel activeStep={MAX_STEPS_REJECT} connector={<ConnectorRejected />}>
          {stepsRefused.map((step) => (
            <Step key={step.label}>
              <StepLabel StepIconComponent={StepIconRefused}>
                <Box>
                  <Typography variant={TypoVariants.head3}>{step.label}</Typography>
                  {step.dateTime && (
                    <Typography style={{ marginTop: 8 }} variant={TypoVariants.body1} type={TypoTypes.sub}>
                      {formatDateTime(step.dateTime.seconds * 1000)}
                    </Typography>
                  )}
                </Box>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      )}

      {status === Status.CANCELED && (
        <Stepper alternativeLabel activeStep={MAX_STEPS_REJECT} connector={<ConnectorRejected />}>
          {stepsCanceled.map((step) => (
            <Step key={step.label}>
              <StepLabel StepIconComponent={StepIconRefused}>
                <Box>
                  <Typography variant={TypoVariants.head3}>{step.label}</Typography>
                  {step.dateTime && (
                    <Typography style={{ marginTop: 8 }} variant={TypoVariants.body1} type={TypoTypes.sub}>
                      {formatDateTime(step.dateTime.seconds * 1000)}
                    </Typography>
                  )}
                </Box>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      )}

      {status !== Status.CANCELED && status !== Status.REJECTED && (
        <Stepper alternativeLabel activeStep={activeStep.index} connector={<ConnectorApprove />}>
          {stepsApproved.map((step, index) => (
            <Step key={step.label}>
              <StepLabel StepIconComponent={StepIconApprove} error={activeStep.error && index === activeStep.index}>
                <Box>
                  <Typography
                    variant={TypoVariants.head3}
                    type={index <= activeStep.index ? TypoTypes.default : TypoTypes.sub}
                  >
                    {step.label}
                  </Typography>
                  {step.dateTime && (
                    <Typography style={{ marginTop: 8 }} variant={TypoVariants.body1} type={TypoTypes.sub}>
                      {formatDateTime(step.dateTime.seconds * 1000)}
                    </Typography>
                  )}
                </Box>
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      )}
    </div>
  );
};

export default CustomizedSteppers;
