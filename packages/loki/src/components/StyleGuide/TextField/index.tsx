import cn from 'classnames';
import React, { forwardRef } from 'react';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import Input, { InputComponent, InputProps } from '../Input';
import Typography, { TypoVariants } from '../Typography';
import styles from './styles.module.scss';

interface TextFieldTypeMap<P = {}, D extends React.ElementType = InputComponent> {
  props: P & {
    name: string;
    label?: string;
    optional?: React.ReactNode;
    note?: React.ReactNode;
    fieldId?: string;
    inputClassName?: string;
    inputProps?: InputProps;
  };
  defaultComponent: D;
}

type TextFieldProps<D extends React.ElementType = TextFieldTypeMap['defaultComponent'], P = {}> = OverrideProps<
  TextFieldTypeMap<P, D>,
  D
>;

interface TextFieldDefaultProps {
  component: React.ElementType;
}

const defaultProps: TextFieldDefaultProps = {
  component: Input,
};

export const TextField: BaseComponent<TextFieldTypeMap> & {
  displayName?: string;
} = forwardRef((props: TextFieldProps, ref) => {
  const {
    component: InputComponentRenderer,
    className,
    optional,
    note,
    label,
    fieldId,
    inputClassName,
    inputProps,
    ...rest
  } = { ...defaultProps, ...props };

  const classOfComponent = cn(
    styles['text-field'],
    styles[`variant-${rest.status}`],
    styles[`status-${rest.status}`],
    className,
  );

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
    <InputComponentRenderer {...rest} {...inputProps} id={keyOfField} ref={ref} className={inputClassName} />
  );

  const contentOfNote = note && (
    <Typography variant={TypoVariants.caption} className={styles.note} component="span">
      {note}
    </Typography>
  );

  return (
    <div className={classOfComponent}>
      {contentOfLabel}
      {contentOfOptional}
      {contentOfInput}
      {contentOfNote}
    </div>
  );
});

TextField.displayName = 'TextField';
export default TextField;
