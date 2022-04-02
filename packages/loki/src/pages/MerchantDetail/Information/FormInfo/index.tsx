import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { Grid } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {},
    container: {},
    contentContainer: {
      '&:not(:last-child)': {
        borderBottom: '1px solid #D6DEFF',
        marginBottom: theme.spacing(3),
        paddingBottom: theme.spacing(1),
      },
    },
    contentItem: {
      flex: 1,
      marginTop: 'auto',
    },
    contentValue: {
      wordBreak: 'break-word',
    },
  }),
);

type FormInfoProps = {
  contents?: {
    label: string;
    values: { title?: React.ReactNode | string; value?: React.ReactNode | string }[];
  }[];
};

const FormInfo: React.FC<FormInfoProps> = ({ contents }) => {
  const classes = useStyles();
  return (
    <Box>
      {contents &&
        contents.map((content, idx) => {
          return (
            <Box key={idx} className={classes.contentContainer}>
              <Grid container>
                <Grid item sm={12}>
                  <Box mb={2}>
                    <Typography variant={TypoVariants.head3} type={TypoTypes.titleSub} weight={TypoWeights.bold}>
                      {content.label}
                    </Typography>
                  </Box>
                </Grid>
                {content.values.map((value, index) => (
                  <Grid key={index} item sm={6}>
                    <Box mb={2} className={classes.contentItem}>
                      <Box mb={1}>
                        <Typography variant={TypoVariants.body2} type={TypoTypes.sub} weight={TypoWeights.light}>
                          {value.title}
                        </Typography>
                      </Box>
                      {React.isValidElement(value.value) ? (
                        value.value
                      ) : (
                        <Box className={classes.contentValue}>
                          <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
                            {value.value ? value.value : ''}
                          </Typography>
                        </Box>
                      )}
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          );
        })}
    </Box>
  );
};

export default FormInfo;
