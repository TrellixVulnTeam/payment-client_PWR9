import cn from 'classnames';
import React from 'react';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import styles from './styles.module.scss';

export enum TableCellAligns {
  inherit = 'inherit',
  left = 'left',
  center = 'center',
  right = 'right',
  justify = 'justify',
}

interface TableCellTypeMap<P = {}, D extends React.ElementType = 'td'> {
  props: P & {
    /**
     * Set `true` if render in `TableHeader` component
     */
    inHeader?: boolean;
    /**
     * Set text-align content, default is: `inherit`
     */
    align?: TableCellAligns;
    /**
     * Width attribute
     */
    width?: string | number;
    /**
     * Col span
     */
    colSpan?: number | string;
  };
  defaultComponent: D;
}

export type TableCellProps<D extends React.ElementType = TableCellTypeMap['defaultComponent'], P = {}> = OverrideProps<
  TableCellTypeMap<P, D>,
  D
>;

interface TableCellDefaultProps {
  component: React.ElementType;
  inHeader: boolean;
  align: TableCellAligns;
}

const defaultProps: TableCellDefaultProps = {
  component: 'td',
  inHeader: false,
  align: TableCellAligns.inherit,
};

export const TableCell: BaseComponent<TableCellTypeMap> & {
  displayName: string;
} = (props: TableCellProps) => {
  const { component, className, inHeader, align, width, ...rest } = {
    ...defaultProps,
    ...props,
  };

  const Component = (inHeader ? 'th' : component) || 'td';
  const classOfComponent = cn(styles.cell, className, align && styles[`align-${String(align)}`]);

  return <Component {...rest} className={classOfComponent} style={{ width: width }} />;
};

TableCell.displayName = 'TableCell';
export default TableCell;
