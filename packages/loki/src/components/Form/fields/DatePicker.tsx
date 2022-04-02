import 'date-fns';
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';

type FormDatePickerProps = {
  label: string;
  errors: any;
  readOnly: boolean;
  value?: Date | null;
  onChange: (date: Date) => void;
};

const DatePickerField: React.FC<FormDatePickerProps> = ({
  label,
  readOnly,
  onChange,
  value,
  ...restProps
}) => {
  const handleDateChange = (date: Date | null) => {
    if (typeof onChange === 'function') {
      onChange(date);
    }
  };

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <FormControl component="fieldset" style={{ width: '100%' }}>
        {label && (
          <FormLabel>
            <Typography variant={TypoVariants.body2} type={TypoTypes.sub} weight={TypoWeights.bold}>
              {label}
            </Typography>
          </FormLabel>
        )}
        <KeyboardDatePicker
          {...restProps}
          id="date-picker-dialog"
          format="dd/MM/yyyy"
          value={value}
          onChange={handleDateChange}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
          helperText={false}
          readOnly={readOnly}
          placeholder="dd/mm/yyyy"
          InputProps={{
            readOnly: readOnly,
            style: {
              height: 56,
              fontSize: 16,
            },
          }}
        />
      </FormControl>
    </MuiPickersUtilsProvider>
  );
};

export default DatePickerField;
