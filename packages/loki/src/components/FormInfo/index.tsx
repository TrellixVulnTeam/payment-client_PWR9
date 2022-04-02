import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import { Grid } from '@material-ui/core';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      margin: theme.spacing(3),
    },
    container: {
      paddingBottom: theme.spacing(2),
      marginBottom: theme.spacing(2),
    },
    contentContainer: {
      paddingBottom: theme.spacing(2),
      '&:not(:last-child)': {
        marginBottom: theme.spacing(2),
        borderBottom: '1px solid #D6DEFF',
      },
    },
    contentItem: {
      flex: 1,
      marginTop: 'auto',
    },
    contentText: {
      wordBreak: 'break-word',
    },
  }),
);

type FormInfoProps = {
  contents?: {
    title: string;
    value?: React.ReactNode | string;
    label?: React.ReactNode | string;
  }[];
};

const FormInfo: React.FunctionComponent<FormInfoProps> = ({ contents }: FormInfoProps) => {
  const classes = useStyles();
  return (
    <Box>
      {contents &&
        contents.map((item, idx) => {
          if (idx % 2 !== 0) return <></>;
          const leftContent = item;
          const rightContent = contents[idx + 1];
          return (
            <Box marginTop={2} className={classes.contentContainer}>
              <Grid container>
                <Grid item sm={6}>
                  {leftContent && (
                    <Box paddingRight={3} className={classes.contentItem}>
                      <Box marginBottom={1}>
                        <Typography variant={TypoVariants.head3} type={TypoTypes.titleSub}>
                          {leftContent.label}
                        </Typography>
                      </Box>
                      <Box mb={1}>
                        <Typography variant={TypoVariants.body2} type={TypoTypes.titleSub}>
                          {leftContent.title}
                        </Typography>
                      </Box>
                      {React.isValidElement(leftContent.value) ? (
                        leftContent.value
                      ) : (
                        <Typography
                          variant={TypoVariants.body1}
                          weight={TypoWeights.medium}
                          className={classes.contentText}
                        >
                          {leftContent.value !== undefined ? leftContent.value : ''}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Grid>
                <Grid item sm={6}>
                  {rightContent && (
                    <Box paddingRight={3} className={classes.contentItem}>
                      <Box mb={1}>
                        <Typography variant={TypoVariants.head3} color={TypoTypes.titleSub}>
                          {rightContent.label}
                        </Typography>
                      </Box>
                      <Box mb={1}>
                        <Typography variant={TypoVariants.body2} type={TypoTypes.titleSub}>
                          {rightContent.title}
                        </Typography>
                      </Box>
                      {React.isValidElement(rightContent.value) ? (
                        rightContent.value
                      ) : (
                        <Typography
                          variant={TypoVariants.body1}
                          weight={TypoWeights.medium}
                          className={classes.contentText}
                        >
                          {rightContent.value !== undefined ? rightContent.value : ''}
                        </Typography>
                      )}
                    </Box>
                  )}
                </Grid>
              </Grid>
            </Box>
          );
        })}
    </Box>
  );
};

export default FormInfo;
