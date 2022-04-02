import cn from 'classnames';
import React, { forwardRef } from 'react';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import styles from './styles.module.scss';

interface TableRowTypeMap<P = {}, D extends React.ElementType = 'tr'> {
  props: P & {};
  defaultComponent: D;
}

export type TableRowProps<D extends React.ElementType = TableRowTypeMap['defaultComponent'], P = {}> = OverrideProps<
  TableRowTypeMap<P, D>,
  D
>;

interface TableRowDefaultProps {
  component: React.ElementType;
}

const defaultProps: TableRowDefaultProps = {
  component: 'tr',
};

export const TableRow: BaseComponent<TableRowTypeMap> & {
  displayName?: string;
} = forwardRef((props: TableRowProps, ref: any) => {
  const {
    component: Component,
    className,
    ...rest
  } = {
    ...defaultProps,
    ...props,
  };

  const classOfComponent = cn(styles.root, className);

  return <Component {...rest} className={classOfComponent} ref={ref} />;
});

TableRow.displayName = 'TableRow';
export default TableRow;
