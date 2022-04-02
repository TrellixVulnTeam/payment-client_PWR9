import { PhoneNumber } from '@greyhole/myid/myid_pb';
import { GridSize } from '@material-ui/core';
import React from 'react';

export enum FormTypes {
  'INPUT' = 0,
  'INPUT_NUMBER' = 1,
  'INPUT_PASSWORD' = 2,
  'SELECT' = 3,
  'COMPONENT' = 4,
  'DATE' = 5,
  'AUTOCOMPLETE' = 6,
  'RADIO' = 7,
  'PHONE_NUMBER' = 8,
  'TEXT_AREA' = 9,
  'TYPOGRAPHY' = 10,
  'CHECKBOX' = 11,
  'INPUT_MONEY' = 12,
  'SWITCH' = 13,
}

export type FormFields = (
  | IComponentField
  | IDatePicker
  | INumberField
  | ICheckBoxField
  | IRadioField
  | ISelectField
  | ITextareaField
  | ITextField
  | ITypography
  | IMoneyNumberField
  | IPhoneNumber
  | IPasswordField
) &
  IBaseField;

export interface IBaseField {
  name: string;
  label?: string;
  hidden?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  defaultValue?: any;
  rules?: any;
  value?: any;
  width: {
    xs?: GridSize;
    sm?: GridSize;
    md?: GridSize;
    lg?: GridSize;
    xl?: GridSize;
  };
  [key: string]: any;
}

export interface IPasswordField extends IBaseField {
  type: FormTypes.INPUT_PASSWORD;
  validation?: boolean;
}

export interface IComponentField extends IBaseField {
  type: FormTypes.COMPONENT;
  component: Function;
}

export interface IDatePicker extends IBaseField {
  type: FormTypes.DATE;
  maxDate?: Date;
  minDate?: Date;
}

export interface IPhoneNumber extends IBaseField {
  type: FormTypes.PHONE_NUMBER;
  onChange?: (event: { target: { name: string; value: PhoneNumber.AsObject } }) => void;
}

export interface INumberField extends IBaseField {
  type: FormTypes.INPUT_NUMBER;
  onChange?: (event: { target: { name: string; value: string } }) => void;
}

export interface IMoneyNumberField extends IBaseField {
  type: FormTypes.INPUT_MONEY;
}

export interface ISwitchField extends IBaseField {
  type: FormTypes.SWITCH;
}

export interface ICheckBoxField extends IBaseField {
  type: FormTypes.CHECKBOX;
  direction?: 'column' | 'row';
  options: { name: string; value: any }[];
}
export interface IRadioField extends IBaseField {
  type: FormTypes.RADIO;
  direction?: 'column' | 'row';
  columns?: GridSize;
  options: { name: string; value: any }[];
}
export interface ISelectField extends IBaseField {
  type: FormTypes.SELECT;
  options: { name: string; value: string | number }[];
  title?: string;
  loading?: boolean;
  autoComplete?: boolean;
  autoCompleteProps?: {
    placeholderSearch?: string;
    filterOptions?: (options: any[], state: any) => any[];
    renderOption?: (object: any) => React.ReactNode;
  };
  onChange?: (data: any) => void;
  onFocus?: (data: any) => void;
  onSearch?: (data: any) => void;
}

export interface ITextareaField extends IBaseField {
  type: FormTypes.TEXT_AREA;
  rows?: number;
  maxLength?: number;
}

export interface ITextField extends IBaseField {
  type: FormTypes.INPUT;
}

export interface ITypography extends IBaseField {
  type: FormTypes.TYPOGRAPHY;
  value?: any;
  formatValue?: Function;
}
