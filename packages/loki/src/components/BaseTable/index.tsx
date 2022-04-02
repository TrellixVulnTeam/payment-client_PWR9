import { t } from 'i18next';
import { Box, Grid } from '@material-ui/core';
import Loading from 'assets/icons/ILT/lib/Loading';
import cn from 'classnames';
import DropdownList from 'components/StyleGuide/DropdownList';
import Icon from 'components/StyleGuide/Icon';
import { InputSizes } from 'components/StyleGuide/Input';
import Option from 'components/StyleGuide/Option';
import Pagination from 'components/StyleGuide/Pagination';
import Table from 'components/StyleGuide/Table';
import TableBody from 'components/StyleGuide/TableBody';
import TableCell from 'components/StyleGuide/TableCell';
import { Checkbox } from 'components/StyleGuide/Checkbox';
import TableHeader from 'components/StyleGuide/TableHeader';
import TableRow, { TableRowProps } from 'components/StyleGuide/TableRow';
import Typography, { TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import _get from 'lodash-es/get';
import _isEmpty from 'lodash-es/isEmpty';
import _omit from 'lodash-es/omit';
import _pick from 'lodash-es/pick';
import React, { forwardRef, FunctionComponent, useCallback, useEffect, useMemo, useState } from 'react';
import { isFunction } from 'utils/common';
import { PAGE_SIZE_OPTIONS } from './const';
import styles from './styles.module.scss';
import { getCellStyle } from './helper';
import TableFooter from 'components/StyleGuide/TableFooter';
import { uppercaseFirstLetterAllWords } from 'utils/common/string';

export interface IPagination {
  current: number;
  pageSize: number;
  totalRecord: number;
  onChangePage: (value: number) => void;
  onChangePageSize?: (value: number) => void;
}

export interface TableHeaderProps {
  /**
   * Label of cell
   */
  label: React.ReactNode;
  className?: string;
  /**
   * Value of cell
   */
  value?: string | any;
  /**
   * Width of header:
   * - Number: in px
   * - String: % of parent width
   */
  width?: number | string;
  /**
   * Column sticky position
   */
  sticky?: ColumnSticky;

  Footer?: any;
}

export type TableItem = {
  [key: string]: any;
};

type TableLayout = 'auto' | 'fixed';
export type ColumnSticky = 'left' | 'right';

export interface TableClasses {
  root: string;
  header: string;
  body: string;
  row: string;
  cell: string;
  footer: string;
  'row-empty': string;
  'cell-empty': string;
}

export interface TableDefaultProps {
  /**
   * Classes of table component
   */
  classes: Partial<TableClasses>;
}

export interface TableProps extends Partial<TableDefaultProps> {
  /**
   * Header of table
   * Item in header will render as `TableCell` component
   * Required props: `label` and `value`. Other props will passing to `TableCell` component
   */
  header: TableHeaderProps[];
  /**
   * Data of table
   * Item in data will render as `TableRow` and each value in field will render as `TableCell` component
   * Value of field in item allowed a string or `ReactNode`
   */
  data: TableItem[];
  /**
   * Key of table
   * If set `keys`, rest in data will pass to `TableRow` attributes
   */
  keys?: { [key: string]: string } | string[];
  /**
   * Display content if data is `null`
   */
  emptyContent?: React.ReactNode;
  className?: string;
  /**
   * Table rows props
   */
  tableRowProps?: TableRowProps & {
    onClick?: (row) => void;
  };
  /**
   * Table row checkbox
   */
  tableRowCheckboxProps?: {
    onClick: (selected) => void;
  };
  /**
   * Table pagination
   */
  pagination?: IPagination;
  /**
   * Loading
   */
  loading?: boolean;
  /**
   * OverflowX
   */
  overflowX?: boolean;
  /**
   * Sticky column (header is sticky by default)
   */
  stickyColumn?: boolean;
  /**
   * Table-layout sets the algorithm used to lay out <table> cells, rows, and columns.
   * - https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout
   * - https://css-tricks.com/almanac/properties/t/table-layout/
   */
  tableLayout?: TableLayout;
}

const DEFAULT_EMPTY_TEXT = 'No data';
export const CHECK_BOX_WIDTH = 50;

const defaultProps = {
  classes: {} as TableClasses,
  emptyContent: undefined,
  tableRowProps: {
    onClick: null,
  },
  loading: false,
  tableLayout: 'fixed',
};

export const BaseTable: FunctionComponent<TableProps> = forwardRef((props, ref) => {
  const {
    header,
    data = [],
    keys,
    className,
    classes,
    emptyContent: customEmptyContent,
    tableRowProps,
    tableRowCheckboxProps,
    pagination,
    loading,
    overflowX,
    stickyColumn,
    tableLayout,
    ...rest
  } = {
    ...defaultProps,
    ...props,
  };

  const classOfRoot = cn(styles.root, className, classes.root, {
    [styles['table-overflow-x']]: overflowX,
    [styles['table-sticky']]: stickyColumn,
    [styles['table-layout-auto']]: tableLayout === 'auto',
  });
  const classOfHeader = cn(styles.header, classes.header);
  const classOfBody = cn(styles.body, classes.body);
  const classOfRow = cn(styles.row, classes.row);
  const classOfFooter = cn(styles.footer, classes.footer);

  const classOfHeaderCell = cn(styles.cell, styles['header-cell'], classes.cell);
  const classOfCell = cn(styles.cell, classes.cell);
  const classOfRowEmpty = cn(styles['row-empty'], classes['row-empty']);
  // const classOfCellEmpty = cn(styles['cell-empty'], classes['cell-empty']);

  // const lengthOfHeader = (header || []).length;
  const hasCheckboxes = !!tableRowCheckboxProps;
  const lengthOfData = (data || []).length;
  const isEmpty = lengthOfData === 0;

  const [pageSize, setPageSize] = useState(PAGE_SIZE_OPTIONS[0]);
  const [checkboxes, setCheckboxes] = useState({});

  useEffect(() => {
    setCheckboxes(data.reduce((acc, _, index) => Object.assign(acc, { [index]: false }), {}));
  }, [data]);

  useEffect(() => {
    if (pagination && pagination.pageSize) {
      setPageSize(pagination.pageSize);
    }
  }, [pagination]);

  const handleToggleCheckboxRow = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.stopPropagation();
      const { checked, value } = event.target;

      // ! Workaround - check value
      // ? Because checkbox render twice
      if (value) {
        const newCheckboxes = {
          ...checkboxes,
          [value]: checked,
        };

        setCheckboxes(newCheckboxes);

        if (tableRowCheckboxProps) {
          tableRowCheckboxProps.onClick(
            Object.entries(newCheckboxes)
              .filter(([_, isCheck]) => isCheck)
              .map((item) => data[+item[0]]),
          );
        }
      }
    },
    [data, checkboxes, tableRowCheckboxProps],
  );

  const handleToggleCheckboxAll = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      event.stopPropagation();

      const isCheckAll = Object.values(checkboxes).some((item) => item === false);
      const newCheckboxes = data.reduce((acc, _, index) => Object.assign(acc, { [index]: isCheckAll }), {});

      setCheckboxes(newCheckboxes);

      if (tableRowCheckboxProps) {
        tableRowCheckboxProps.onClick(
          Object.entries(newCheckboxes)
            .filter(([_, isCheck]) => isCheck)
            .map((item) => data[+item[0]]),
        );
      }
    },
    [data, checkboxes, tableRowCheckboxProps],
  );

  const handleChangePageSize = useCallback(
    (value) => {
      setPageSize(value);
      if (pagination.onChangePageSize) {
        pagination.onChangePageSize(value);
      }
    },
    [pagination],
  );

  const cellsOfHeader = useMemo(
    () => (
      <>
        {hasCheckboxes && (
          <TableCell
            key={'all'}
            className={cn(classOfCell, styles.checkbox, {
              [styles['sticky-cell']]: stickyColumn,
              [styles['sticky-checkbox']]: stickyColumn,
            })}
            inHeader
          >
            <Checkbox
              value="all"
              name="all"
              checked={
                Object.values(checkboxes).length > 0 && !Object.values(checkboxes).some((item) => item === false)
              }
              onClick={handleToggleCheckboxAll}
            />
          </TableCell>
        )}
        {(header || []).map(({ label, value, width, sticky, ...rest }, columnIdx) => {
          const cellStyle = getCellStyle(stickyColumn, header, width, sticky, columnIdx, hasCheckboxes);

          return (
            <Typography
              variant={TypoVariants.body1}
              weight={TypoWeights.bold}
              component="th"
              key={value}
              {...rest}
              className={cn(classOfHeaderCell, {
                [styles['sticky-cell']]: stickyColumn && sticky,
                [styles['ellipsis']]: !!width,
              })}
              // width={width}
              style={cellStyle}
            >
              {typeof label === 'string' ? uppercaseFirstLetterAllWords(label) : label}
            </Typography>
          );
        })}
      </>
    ),
    [hasCheckboxes, classOfCell, stickyColumn, checkboxes, handleToggleCheckboxAll, header, classOfHeaderCell],
  );

  const keysIsExisted = !!keys;
  const keysValue = Object.values(keys || {});
  const rowsOfBody = useMemo(
    () =>
      data.map(({ isActive, ...rest }, idx) => {
        const dataOfItem = !keysIsExisted ? rest : _pick(rest, keysValue);
        const otherProps = !keysIsExisted ? {} : _omit(rest, keysValue);
        return (
          <TableRow
            {...otherProps}
            key={idx}
            className={cn(classOfRow, {
              [styles.active]: isActive,
              [styles['can-click']]: !!tableRowProps.onClick,
            })}
            // {...tableRowProps}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              isFunction(tableRowProps?.onClick) && tableRowProps?.onClick(rest);
            }}
          >
            {hasCheckboxes && (
              <TableCell
                key={`checkbox-${idx}`}
                className={cn(classOfCell, styles.checkbox, {
                  [styles['sticky-cell']]: stickyColumn,
                  [styles['sticky-checkbox']]: stickyColumn,
                })}
                inHeader
              >
                <Checkbox
                  name={rest.id}
                  value={idx.toString()}
                  checked={checkboxes[idx]}
                  onClick={handleToggleCheckboxRow}
                />
              </TableCell>
            )}
            {header.map(({ value, width, sticky, ...rest }, columnIdx) => {
              let cellContent = isFunction(value) ? value(dataOfItem) : _get(dataOfItem, value);

              const cellStyle = getCellStyle(stickyColumn, header, width, sticky, columnIdx, hasCheckboxes);

              if (
                typeof cellContent === 'string' ||
                typeof cellContent === 'number' ||
                cellContent?.type === React.Fragment
              ) {
                cellContent = <div className={cn({ [styles['ellipsis']]: !!width })}>{cellContent}</div>;
              }
              return (
                <Typography
                  variant={TypoVariants.body2}
                  weight={TypoWeights.regular}
                  component="td"
                  {...rest}
                  key={value}
                  width={width}
                  className={cn(classOfCell, {
                    [styles['sticky-cell']]: stickyColumn && sticky,
                    [styles['ellipsis']]: !!width,
                  })}
                  style={cellStyle}
                >
                  {cellContent}
                </Typography>
              );
            })}
          </TableRow>
        );
      }),
    [
      data,
      keysIsExisted,
      keysValue,
      classOfRow,
      tableRowProps,
      hasCheckboxes,
      classOfCell,
      stickyColumn,
      checkboxes,
      handleToggleCheckboxRow,
      header,
    ],
  );

  const contentIfEmpty = useMemo(
    () =>
      isEmpty && (
        <Grid container alignItems="center" justifyContent="center" className={classOfRowEmpty}>
          <Grid item xs="auto">
            <Typography variant={TypoVariants.body1} weight={TypoWeights.medium}>
              {!loading ? customEmptyContent || t(DEFAULT_EMPTY_TEXT) : ''}
            </Typography>
          </Grid>
        </Grid>
      ),
    [isEmpty, classOfRowEmpty, loading, customEmptyContent],
  );

  const contentIfLoading = useMemo(
    () => loading && <Icon className={styles['loading']} component={Loading} />,
    [loading],
  );

  const rowsOfFooter = useMemo(
    () =>
      !isEmpty && (
        <TableRow key="footer">
          {header.map(({ Footer, width, ...rest }, id) => {
            let cellContent = Footer?.(data);
            if (typeof cellContent === 'string' || cellContent?.type === React.Fragment) {
              cellContent = <div>{cellContent}</div>;
            }
            return (
              <Typography
                variant={TypoVariants.body1}
                component="td"
                {...rest}
                style={null}
                key={`footer-${id}`}
                width={width}
                className={classOfCell}
              >
                {cellContent}
              </Typography>
            );
          })}
        </TableRow>
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isEmpty, classOfCell, classOfRow, data, keysIsExisted, keysValue, tableRowProps],
  );

  const renderPagination = useMemo(() => {
    if (!pagination || _isEmpty(header) || !pagination.pageSize || !pagination.totalRecord) return null;
    return (
      <div className={styles['footer']}>
        <Grid container alignItems="center" justifyContent="space-between" className={styles['pagination']}>
          <Grid item xs="auto">
            {pagination.pageSize && pagination.onChangePageSize && (
              <DropdownList
                value={pageSize.toString()}
                onChange={handleChangePageSize}
                size={InputSizes.md}
                display={() => `Row: ${pageSize.toString()}`}
              >
                {PAGE_SIZE_OPTIONS.map((x) => x.toString()).map((size) => (
                  <Option value={size}>{size}</Option>
                ))}
              </DropdownList>
            )}
          </Grid>
          <Grid item xs="auto">
            {pagination.totalRecord && pagination.pageSize && <Pagination {...pagination} />}
          </Grid>
        </Grid>
      </div>
    );
  }, [handleChangePageSize, header, pageSize, pagination]);

  const classOfOuterWrapper = cn(styles['table-outer-wrapper'], {
    [styles['table-outer-wrapper-loading']]: loading && !overflowX,
  });
  const classOfInnerWrapper = cn(styles['table-inner-wrapper'], {
    [styles['table-loading']]: loading,
  });

  const classOfEmptyWrapper = cn({ [styles['empty-loading']]: isEmpty });

  return (
    <>
      <Box className={classOfOuterWrapper}>
        <Box className={classOfInnerWrapper}>
          <Table ref={ref} {...rest} className={classOfRoot}>
            <TableHeader className={classOfHeader}>
              <TableRow className={classOfRow}>{cellsOfHeader}</TableRow>
            </TableHeader>
            <TableBody className={classOfBody}>{rowsOfBody}</TableBody>
            <TableFooter className={classOfFooter}>{rowsOfFooter}</TableFooter>
          </Table>
          <Box className={classOfEmptyWrapper}>
            {contentIfEmpty}
            {contentIfLoading}
          </Box>
          {renderPagination}
        </Box>
      </Box>
    </>
  );
});

export default BaseTable;
