import cn from 'classnames';
import React, { forwardRef } from 'react';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import styles from './styles.module.scss';

interface TableBodyTypeMap<P = {}, D extends React.ElementType = 'tbody'> {
  props: P & {};
  defaultComponent: D;
}

type TableBodyProps<D extends React.ElementType = TableBodyTypeMap['defaultComponent'], P = {}> = OverrideProps<
  TableBodyTypeMap<P, D>,
  D
>;

interface TableBodyDefaultProps {
  component: React.ElementType;
}

const defaultProps: TableBodyDefaultProps = {
  component: 'tbody',
};

export const TableBody: BaseComponent<TableBodyTypeMap> & {
  displayName?: string;
} = forwardRef((props: TableBodyProps, ref: any) => {
  const {
    component: Component,
    className,
    ...rest
  } = {
    ...defaultProps,
    ...props,
  };

  const classOfComponent = cn(styles.tableBody, className);

  return <Component {...rest} className={classOfComponent} ref={ref} />;
});

TableBody.displayName = 'TableBody';
export default TableBody;
