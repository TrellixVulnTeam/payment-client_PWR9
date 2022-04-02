import cn from 'classnames';
import csstype from 'csstype';
import React, { forwardRef } from 'react';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import styles from './styles.module.scss';
import { GridBreakpoint } from './types';

export * from './types';

interface GridTypeMap<P = {}, D extends React.ElementType = 'div'> {
  props: P & {
    container?: boolean;
    spacing?: number;
    item?: boolean;
    nowrap?: boolean;
    direction?: csstype.FlexDirectionProperty;
    justifyContent?: csstype.JustifyContentProperty;
    alignItem?: csstype.AlignItemsProperty;
  } & Partial<GridBreakpoint>;
  defaultComponent: D;
}

export type GridProps<D extends React.ElementType = GridTypeMap['defaultComponent'], P = {}> = OverrideProps<
  GridTypeMap<P, D>,
  D
>;

interface GridDefaultProps {
  component: React.ElementType;
  container: boolean;
  item: boolean;
  nowrap: boolean;
}

const defaultProps: GridDefaultProps = {
  component: 'div',
  container: false,
  item: false,
  nowrap: false,
};

const Grid: BaseComponent<GridTypeMap> & {
  displayName?: string;
} = forwardRef((props: GridProps, ref: any) => {
  const {
    component: Component,
    className,
    container,
    item,
    nowrap,
    direction,
    justifyContent,
    alignItem,
    xs,
    lg,
    xl,
    md,
    sm,
    spacing,
    ...rest
  } = { ...defaultProps, ...props };
  const classOfComponent = cn(className, {
    [styles.grid]: container,
    [styles.item]: item,
    [styles.wrap]: !nowrap,
    [styles[direction]]: !!direction,
    [styles[`s-${spacing}`]]: !!spacing,
    [styles[`justify-${justifyContent}`]]: !!justifyContent,
    [styles[`align-${alignItem}`]]: !!alignItem,
    [styles[`xs-${xs as string}`]]: xs !== undefined,
    [styles[`sm-${sm as string}`]]: sm !== undefined,
    [styles[`md-${md as string}`]]: md !== undefined,
    [styles[`lg-${lg as string}`]]: lg !== undefined,
    [styles[`xl-${xl as string}`]]: xl !== undefined,
  });

  return <Component className={classOfComponent} {...rest} ref={ref} />;
});

Grid.displayName = 'Grid';
export default Grid;
