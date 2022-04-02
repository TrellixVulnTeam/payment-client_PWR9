import cn from 'classnames';
import React, { forwardRef } from 'react';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import DropdownList, { DropdownListComponent } from '../DropdownList';
import Typography, { TypoVariants } from '../Typography';
import styles from './styles.module.scss';

interface DropdownListFieldTypeMap<P = {}, D extends React.ElementType = DropdownListComponent> {
  props: P & {
    label: string;
    name: string;
    optional?: React.ReactNode;
    note?: React.ReactNode;
    fieldId?: string;
    inputClassName?: string;
  };
  defaultComponent: D;
}

type DropdownListFieldProps<
  D extends React.ElementType = DropdownListFieldTypeMap['defaultComponent'],
  P = {},
> = OverrideProps<DropdownListFieldTypeMap<P, D>, D>;

interface DropdownListFieldDefaultProps {
  component: React.ElementType;
}

const defaultProps: DropdownListFieldDefaultProps = {
  component: DropdownList,
};

export const DropdownListField: BaseComponent<DropdownListFieldTypeMap> & {
  displayName?: string;
} = forwardRef((props: DropdownListFieldProps, ref) => {
  const {
    component: DropdownListComponentRenderer,
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

  const contentOfDropdownList = <DropdownListComponentRenderer {...rest} id={keyOfField} ref={ref} className={inputClassName} />;

  const contentOfNote = note && (
    <Typography variant={TypoVariants.caption} className={styles.note} component="span">
      {note}
    </Typography>
  );

  return (
    <div className={classOfComponent}>
      {contentOfLabel}
      {contentOfOptional}
      {contentOfDropdownList}
      {contentOfNote}
    </div>
  );
});

DropdownListField.displayName = 'DropdownListField';
export default DropdownListField;
