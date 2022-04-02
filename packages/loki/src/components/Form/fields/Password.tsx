import { Box } from '@material-ui/core';
import { t } from 'i18next';
import _get from 'lodash-es/get';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import cn from 'classnames';
import Icon from 'components/StyleGuide/Icon';
import Grid from 'components/StyleGuide/Grid';
import TextField from 'components/StyleGuide/TextField';
import InputAdornment from 'components/StyleGuide/InputAdornment';
import { InputSizes } from 'components/StyleGuide/Input';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { CheckCircle, Eye, Uneye } from 'assets/icons/ILT';
import { ErrorMessage as ErrorMessagePassword, ErrorPattern as ErrorPatternPassword } from 'utils/common/password';
import styles from '../styles.module.scss';
import { IPasswordField } from '../types';

const PasswordField: React.FC<IPasswordField> = ({ validation, ...restProps }) => {
  const [toggleVisible, setToggleVisible] = useState(false);

  const { getValues } = useFormContext();

  const formValues = getValues();

  const password = _get(formValues, restProps.name);
  const patterns = Object.keys(ErrorPatternPassword);

  return (
    <div className={styles['password']}>
      <TextField
        {...restProps}
        size={InputSizes.lg}
        type={toggleVisible ? 'text' : 'password'}
        afterInput={[
          <InputAdornment onClick={() => setToggleVisible((prev) => !prev)}>
            <Icon component={toggleVisible ? Eye : Uneye} />
          </InputAdornment>,
        ]}
      />
      {validation && (
        <Box mt={1.5} mb={1}>
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <Grid container direction="column" spacing={1}>
                {patterns.map((key: string, index) => (
                  <Grid item key={`${index}-${key}`}>
                    <Grid container spacing={1} alignItems="center">
                      <Grid item xs="auto">
                        <Icon
                          className={cn(styles['icon'], {
                            [styles['success-icon']]: !!password && ErrorPatternPassword[key].test(password),
                          })}
                          component={CheckCircle}
                        />
                      </Grid>
                      <Grid item xs="auto">
                        <Box pt={0.2}>
                          <Typography variant={TypoVariants.body1} weight={TypoWeights.medium} type={TypoTypes.sub}>
                            {t(ErrorMessagePassword[key])}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </Grid>
        </Box>
      )}
    </div>
  );
};

export default PasswordField;
