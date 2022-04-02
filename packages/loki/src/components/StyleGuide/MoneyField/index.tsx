import cn from 'classnames';
import React, { forwardRef } from 'react';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import { InputComponent } from '../Input';
import InputMoneyFormat from '../InputMoneyFormat';
import Typography, { TypoVariants } from '../Typography';
import styles from './styles.module.scss';

interface MoneyFieldTypeMap<P = {}, D extends React.ElementType = InputComponent> {
  props: P & {
    name: string;
    label?: string;
    optional?: React.ReactNode;
    note?: React.ReactNode;
    fieldId?: string;
    inputClassName?: string;
  };
  defaultComponent: D;
}

type MoneyFieldProps<D extends React.ElementType = MoneyFieldTypeMap['defaultComponent'], P = {}> = OverrideProps<
  MoneyFieldTypeMap<P, D>,
  D
>;

interface MoneyFieldDefaultProps {
  component: React.ElementType;
}

const defaultProps: MoneyFieldDefaultProps = {
  component: InputMoneyFormat,
};

export const MoneyField: BaseComponent<MoneyFieldTypeMap> & {
  displayName?: string;
} = forwardRef((props: MoneyFieldProps, ref) => {
  const {
    component: InputComponentRenderer,
    className,
    optional,
    note,
    label,
    fieldId,
    inputClassName,
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

  const contentOfInput = <InputComponentRenderer {...rest} id={keyOfField} ref={ref} className={inputClassName} />;

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

MoneyField.displayName = 'MoneyField';
export default MoneyField;
