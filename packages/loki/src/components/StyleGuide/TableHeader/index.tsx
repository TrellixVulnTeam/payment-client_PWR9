import cn from 'classnames';
import React from 'react';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import styles from './styles.module.scss';

interface TableHeaderTypeMap<P = {}, D extends React.ElementType = 'thead'> {
  props: P & {};
  defaultComponent: D;
}

export type TableHeaderProps<
  D extends React.ElementType = TableHeaderTypeMap['defaultComponent'],
  P = {},
> = OverrideProps<TableHeaderTypeMap<P, D>, D>;

interface TableHeaderDefaultProps {
  component: React.ElementType;
}

const defaultProps: TableHeaderDefaultProps = {
  component: 'thead',
};

export const TableHeader: BaseComponent<TableHeaderTypeMap> & {
  displayName: string;
} = (props: TableHeaderProps) => {
  const {
    component: Component,
    className,
    ...rest
  } = {
    ...defaultProps,
    ...props,
  };

  const classOfComponent = cn(styles.tableHeader, className);

  return <Component {...rest} className={classOfComponent} />;
};

TableHeader.displayName = 'TableHeader';
export default TableHeader;
