import cn from 'classnames';
import React from 'react';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import styles from './styles.module.scss';

interface TableFooterTypeMap<P = {}, D extends React.ElementType = 'tfoot'> {
  props: P & {};
  defaultComponent: D;
}

type TableFooterProps<D extends React.ElementType = TableFooterTypeMap['defaultComponent'], P = {}> = OverrideProps<
  TableFooterTypeMap<P, D>,
  D
>;

interface TableFooterDefaultProps {
  component: React.ElementType;
}

const defaultProps: TableFooterDefaultProps = {
  component: 'tfoot',
};

export const TableFooter: BaseComponent<TableFooterTypeMap> & {
  displayName: string;
} = (props: TableFooterProps) => {
  const {
    component: Component,
    className,
    ...rest
  } = {
    ...defaultProps,
    ...props,
  };

  const classOfComponent = cn(styles.tableFooter, className);

  return <Component {...rest} className={classOfComponent} />;
};

TableFooter.displayName = 'TableFooter';

export default TableFooter;
