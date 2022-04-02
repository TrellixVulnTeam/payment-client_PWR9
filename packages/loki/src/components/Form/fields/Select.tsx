import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import Option from 'components/StyleGuide/Option';
import { t } from 'i18next';
import DropdownList from 'components/StyleGuide/DropdownList';
import DropdownAutoList from 'components/StyleGuide/DropdownAutoList';
import Typography, { TypoTypes, TypoWeights, TypoVariants } from 'components/StyleGuide/Typography';
import { InputSizes } from 'components/StyleGuide/Input';
import { ISelectField } from '../types';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      width: '100%',
    },
  }),
);

const SelectField: React.FC<ISelectField> = ({ options = [], label, autoComplete, autoCompleteProps, ...props }) => {
  const classes = useStyles();

  return (
    <FormControl component="fieldset" className={classes.formControl}>
      {label && (
        <FormLabel>
          <Typography variant={TypoVariants.body2} type={TypoTypes.sub} weight={TypoWeights.bold}>
            {label}
          </Typography>
        </FormLabel>
      )}
      {autoComplete ? (
        <DropdownAutoList size={InputSizes.lg} options={options} {...autoCompleteProps} {...props} />
      ) : (
        <DropdownList size={InputSizes.lg} {...props}>
          {options.length > 0 ? (
            options.map((option) => (
              <Option key={option.value} value={option.value}>
                {option.name}
              </Option>
            ))
          ) : (
            <Box p={2} display="flex" justifyContent="center">
              <Typography>{props.loading ? t('Loading...') : t('No data')}</Typography>
            </Box>
          )}
        </DropdownList>
      )}
    </FormControl>
  );
};

export default SelectField;
