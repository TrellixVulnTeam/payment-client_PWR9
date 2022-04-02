import React from 'react';
import cn from 'classnames';
import { Box, ContainerProps } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Paper from 'components/StyleGuide/Paper';
import Typography, { TypoVariants } from 'components/StyleGuide/Typography';

type Props = {
  children: React.ReactNode;
  padding?: number;
  header?: React.ReactNode | string;
  actions?: React.ReactNode;
} & ContainerProps;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      border: '1px solid #D6DEFF',
      borderRadius: theme.spacing(2),
    },
    header: {
      marginBottom: theme.spacing(3),
      display: 'flex',
      justifyContent: 'space-between',
    },
    actions: {
      '& > *:not(:last-child)': {
        marginLeft: theme.spacing(1),
      },
    },
  }),
);

interface DefaultLayoutPaper {}

const defaultProps: DefaultLayoutPaper = {};

const LayoutPaper: React.FC<Props> = React.forwardRef((props: Props, ref) => {
  const classes = useStyles();
  const { children, header, className, padding = 4, actions, ...restProps } = { ...props, ...defaultProps };
  return (
    <Paper elevation={0} className={cn(classes.paper, className)} ref={ref} {...restProps}>
      <Box p={padding} width="100%">
        {header && (
          <>
            <Box className={classes.header}>
              {React.isValidElement(header) ? header : <Typography variant={TypoVariants.head2}>{header}</Typography>}
              {actions && <Box className={classes.actions}>{actions}</Box>}
            </Box>
          </>
        )}
        <Box width="100%">{children}</Box>
      </Box>
    </Paper>
  );
});

export default React.memo(LayoutPaper);
