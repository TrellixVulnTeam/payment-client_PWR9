import React from 'react';
import CheckboxGroup from 'components/StyleGuide/CheckboxGroup';
import { Checkbox } from 'components/StyleGuide/Checkbox';
import Typography, { TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { ICheckBoxField } from '../types';

const CheckboxField: React.FC<ICheckBoxField> = ({ onChange, options, value, ...restProps }) => {
  const handleCheck = (checkedId: string) => {
    if (typeof checkedId === 'number') {
      console.warn('Value of checkbox should be string');
      return;
    }

    const values = value;
    const newValues = values?.includes(checkedId)
      ? values?.filter((id) => id !== checkedId)
      : [...(values ?? []), checkedId];
    return newValues;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(handleCheck(e.target.value));
  };

  return (
    <CheckboxGroup
      // @ts-ignore
      onChange={handleChange}
      selected={value}
      {...restProps}
    >
      {options.map((option) => (
        <Checkbox value={option.value.toString()}>
          <Typography variant={TypoVariants.body1} weight={TypoWeights.bold}>
            {option.name}
          </Typography>
        </Checkbox>
      ))}
    </CheckboxGroup>
  );
};

export default CheckboxField;
