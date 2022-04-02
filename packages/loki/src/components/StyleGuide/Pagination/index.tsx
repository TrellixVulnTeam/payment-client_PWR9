import { Grid } from '@material-ui/core';
import { AngleLeft, AngleRight } from 'assets/icons/ILT';
import cx from 'classnames';
import React, { useCallback, useState } from 'react';
import compose from 'utils/common/compose';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import Button, { ButtonVariants } from '../Button';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from '../Typography';
import { START_INDEX, STEP_VALUE } from './const';
import styles from './styles.module.scss';
import { getLabelFromIndex } from './utils';

interface PaginationTypeMap<P = {}, D extends React.ElementType = 'li'> {
  props: P & {
    /**
     * The total number of page
     */
    total?: number;
    /**
     * The zero-based index of the current page
     */
    current: number;
    /**
     * Callback fired when the number of page index is changed
     */
    onChangePage: (selectedPage: number) => void;
    /**
     * The total record
     */
    totalRecord?: number;
    /**
     * The page size
     */
    pageSize?: number;
  };
  defaultComponent: D;
}

type PaginationProps<D extends React.ElementType = PaginationTypeMap['defaultComponent'], P = {}> = OverrideProps<
  PaginationTypeMap<P, D>,
  D
>;

interface PaginationDefaultProps {
  component: React.ElementType;
  totalRecord: number;
  currentOfPage: number;
  pageSize: number;
}

const defaultProps: PaginationDefaultProps = {
  component: 'div',
  totalRecord: 0,
  currentOfPage: 1,
  pageSize: 0,
};

export const Pagination: BaseComponent<PaginationTypeMap> & {
  displayName: string;
} = (props: PaginationProps) => {
  const {
    component: Component,
    current: currentOfPage,
    className,
    onChangePage,
    totalRecord,
    pageSize,
    ...rest
  } = { ...defaultProps, ...props };

  const totalPage = Math.ceil(totalRecord / pageSize);
  const isAllowedPrev = currentOfPage - STEP_VALUE < START_INDEX;
  const isAllowedNext = currentOfPage + STEP_VALUE > totalPage;

  const classOfComponent = cx(styles.pagination, className);
  const classOfIconPrev = cx(styles.icon, styles.prev, isAllowedPrev && styles.disabled);
  const classOfIconNext = cx(styles.icon, styles.next, isAllowedNext && styles.disabled);

  const [, setInputValue] = useState(getLabelFromIndex(currentOfPage));

  const handleOnChangePage = useCallback(
    (selectedPage: number) => onChangePage(Math.min(totalPage, Math.abs(selectedPage))),
    [onChangePage, totalPage],
  );
  const handleOnClickButton = useCallback(
    (nextPage) => () => compose(handleOnChangePage, (selectedPage: number) => setInputValue(selectedPage))(nextPage),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [totalPage, handleOnChangePage, setInputValue],
  );
  const indexOfPrev = Math.max(START_INDEX, currentOfPage - STEP_VALUE);
  const indexOfNext = Math.min(totalPage, currentOfPage + STEP_VALUE);

  if (!currentOfPage || !pageSize || !totalRecord) return null;

  return (
    <Component {...rest} className={classOfComponent}>
      <Grid container alignItems="center" spacing={2}>
        <Grid item xs="auto">
          <Button
            variant={ButtonVariants.ghost}
            icon={AngleLeft}
            onClick={handleOnClickButton(indexOfPrev)}
            className={classOfIconPrev}
            disabled={isAllowedPrev}
          />
        </Grid>
        <Grid item xs="auto">
          <Typography weight={TypoWeights.bold} variant={TypoVariants.body1} type={TypoTypes.sub}>
            {currentOfPage * pageSize - pageSize + 1} - {Math.min(pageSize * currentOfPage, totalRecord)} of{' '}
            {totalRecord}
          </Typography>
        </Grid>
        <Grid item xs="auto">
          <Button
            variant={ButtonVariants.ghost}
            icon={AngleRight}
            onClick={handleOnClickButton(indexOfNext)}
            className={classOfIconNext}
            disabled={isAllowedNext}
          />
        </Grid>
      </Grid>
    </Component>
  );
};

Pagination.displayName = 'Pagination';
export default Pagination;
