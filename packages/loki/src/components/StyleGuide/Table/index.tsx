import React, { forwardRef } from 'react';
import cn from 'classnames';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import styles from './styles.module.scss';

export interface TableItem {
  [key: string]: React.ReactNode;
}

interface TableTypeMap<P = {}, D extends React.ElementType = 'table'> {
  props: P & {};
  defaultComponent: D;
}

export type TableProps<D extends React.ElementType = TableTypeMap['defaultComponent'], P = {}> = OverrideProps<
  TableTypeMap<P, D>,
  D
>;

interface TableDefaultProps {
  component: React.ElementType;
}

const defaultProps: TableDefaultProps = {
  component: 'table',
};

export const Table: BaseComponent<TableTypeMap> & {
  displayName?: string;
} = forwardRef((props: TableProps, ref: any) => {
  const {
    component: Component,
    className,
    ...rest
  } = {
    ...defaultProps,
    ...props,
  };

  return <Component {...rest} className={cn(className, styles.table)} ref={ref} />;
});

Table.displayName = 'Table';
export default Table;
