import cn from 'classnames';
import PhoneInput from 'react-phone-input-2';
import React, { forwardRef } from 'react';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import { InputComponent } from '../Input';
import Typography, { TypoVariants } from '../Typography';
import styles from './styles.module.scss';
import 'react-phone-input-2/lib/material.css';

interface PhoneFieldTypeMap<P = {}, D extends React.ElementType = InputComponent> {
  props: P & {
    name: string;
    label?: string;
    optional?: React.ReactNode;
    note?: React.ReactNode;
    fieldId?: string;
    inputClassName?: string;
    containerClassName?: string;
    dropdownClassName?: string;
  };
  defaultComponent: D;
}

type PhoneFieldProps<D extends React.ElementType = PhoneFieldTypeMap['defaultComponent'], P = {}> = OverrideProps<
  PhoneFieldTypeMap<P, D>,
  D
>;

interface PhoneFieldDefaultProps {
  component: React.ElementType;
}

const defaultProps: PhoneFieldDefaultProps = {
  component: PhoneInput,
};

export const PhoneField: BaseComponent<PhoneFieldTypeMap> & {
  displayName?: string;
} = forwardRef((props: PhoneFieldProps, ref) => {
  const {
    component: InputComponentRenderer,
    className,
    optional,
    note,
    label,
    fieldId,
    inputClassName,
    dropdownClassName,
    containerClassName,
    ...rest
  } = { ...defaultProps, ...props };

  const classOfField = cn(
    styles['text-field'],
    styles[`variant-${rest.status}`],
    styles[`status-${rest.status}`],
    className,
  );

  const classOfComponent = cn(styles[`variant-${rest.status}`], styles[`status-${rest.status}`]);

  const keyOfField = fieldId || `field-${rest.name}`;

  const contentOfLabel = label && (
    <Typography variant={TypoVariants.body2} className={styles.label} component="label" htmlFor={keyOfField}>
      {label}
    </Typography>
  );

  const contentOfOptional = optional && (
    <Typography variant={TypoVariants.body2} className={styles.optional} component="span">
      {optional}
    </Typography>
  );

  const contentOfInput = (
    <InputComponentRenderer
      {...rest}
      id={keyOfField}
      dropdownClass={styles['country-list']}
      ref={ref}
      className={classOfComponent}
    />
  );

  const contentOfNote = note && (
    <Typography variant={TypoVariants.caption} className={styles.note} component="span">
      {note}
    </Typography>
  );

  return (
    <div className={classOfField}>
      {contentOfLabel}
      {contentOfOptional}
      {contentOfInput}
      {contentOfNote}
    </div>
  );
});

PhoneField.displayName = 'PhoneField';
export default PhoneField;
