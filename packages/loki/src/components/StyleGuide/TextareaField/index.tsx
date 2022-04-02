import cn from 'classnames';
import React, { forwardRef } from 'react';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import Textarea, { TextareaComponent, TextareaProps } from '../Textarea';
import Typography, { TypoVariants } from '../Typography';
import styles from './styles.module.scss';

interface TextareaFieldTypeMap<P = {}, D extends React.ElementType = TextareaComponent> {
  props: P & {
    name: string;
    label?: string;
    optional?: React.ReactNode;
    note?: React.ReactNode;
    fieldId?: string;
    inputClassName?: string;
    inputProps?: TextareaProps;
  };
  defaultComponent: D;
}

type TextareaFieldProps<D extends React.ElementType = TextareaFieldTypeMap['defaultComponent'], P = {}> = OverrideProps<
  TextareaFieldTypeMap<P, D>,
  D
>;

interface TextareaFieldDefaultProps {
  component: React.ElementType;
}

const defaultProps: TextareaFieldDefaultProps = {
  component: Textarea,
};

export const TextareaField: BaseComponent<TextareaFieldTypeMap> & {
  displayName?: string;
} = forwardRef((props: TextareaFieldProps, ref) => {
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

  const classOfComponent = cn(styles['text-field'], className);

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

TextareaField.displayName = 'TextareaField';
export default TextareaField;
