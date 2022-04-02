import { isValidElement } from 'react';
import { Container, Box, ContainerProps, Typography } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { TOOLBAR_HEIGHT } from './constants';

type Props = {
  children: React.ReactNode;
  actions?: React.ReactNode;
  header: React.ReactNode | string;
  center?: boolean;
} & ContainerProps;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      padding: 0,
      margin: 0,
      height: '100%',
      minHeight: `calc(100vh - ${TOOLBAR_HEIGHT})`,
    },
    wrapper: {
      width: '100%',
      height: '100%',
      padding: theme.spacing(4),
    },
    header: {
      marginBottom: theme.spacing(3),
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    actions: {
      '& > *:not(:last-child)': {
        marginLeft: theme.spacing(1),
      },
    },
    wrapperContainer: {
      display: 'flex',
      justifyContent: 'center',
    },
  }),
);

const LayoutContainer: React.FunctionComponent<Props> = ({
  center,
  children,
  header,
  actions,
  maxWidth = false,
  ...props
}) => {
  const classes = useStyles();
  return (
    <Box className={center ? classes.wrapperContainer : null}>
      <Container maxWidth={maxWidth} className={classes.root} {...props}>
        <Box className={classes.wrapper}>
          {header && (
            <Box className={classes.header}>
              {isValidElement(header) ? (
                header
              ) : (
                <Typography variant="h1" color="textPrimary">
                  {header}
                </Typography>
              )}
              <Box className={classes.actions}>{actions}</Box>
            </Box>
          )}
          <Box>{children}</Box>
        </Box>
      </Container>
    </Box>
  );
};

export default LayoutContainer;
