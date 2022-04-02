import React from 'react';
import { Column as RTColumn } from 'react-table';

import BaseTable, { ColumnSticky, IPagination, TableItem, TableProps } from 'components/BaseTable';

export type Column<D extends object = {}> = RTColumn<D> & {
  sticky?: ColumnSticky;
};

interface Props extends Partial<TableProps> {
  columns: Column[];
  data: TableItem[];
  pagination?: IPagination;
}

const AlopayTable = (props: Props) => {
  const { columns, data = [], ...rest } = { ...props };
  const header = columns
    .filter((column) => !column.hidden)
    .map((col) => ({
      label: col.Header,
      value: col.accessor,
      width: col.width,
      sticky: col.sticky,
      Footer: col.Footer,
    }));
  return <BaseTable header={header} data={data} {...rest} />;
};

export default AlopayTable;
