import cn from 'classnames';
import React from 'react';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import styles from './styles.module.scss';
import { DividerOrientation, DividerType, DividerVarients } from './types';

export * from './types';

interface DividerTypeMap<P = {}, D extends React.ElementType = 'hr'> {
  props: P & {
    /**
     * The type to use.
     */
    type?: DividerType;
    /**
     * Absolutely position the element.
     */
    absolute?: boolean;
    /**
     * If `true`, the divider will adapt to a parent flex container.
     */
    flexItem?: boolean;
    /**
     * The divider orientation.
     */
    orientation?: DividerOrientation;
  };
  defaultComponent: D;
}

export type DividerProps<D extends React.ElementType = DividerTypeMap['defaultComponent'], P = {}> = OverrideProps<
  DividerTypeMap<P, D>,
  D
>;

interface DividerDefaultProps {
  component: React.ElementType;
  type: DividerType;
  orientation: DividerOrientation;
  variant: DividerVarients;
}

const defaultProps: DividerDefaultProps = {
  component: 'hr',
  type: DividerType.line,
  orientation: DividerOrientation.horizontal,
  variant: DividerVarients.fullWidth,
};

export type DividerComponent = BaseComponent<DividerTypeMap> & {
  displayName?: string;
};

export const Divider: DividerComponent = (props: DividerProps) => {
  const {
    component: Component,
    className,
    type,
    orientation,
    variant,
    absolute,
    flexItem,
    ...rest
  } = {
    ...defaultProps,
    ...props,
  };

  const classOfComponent = cn(
    styles.divider,
    {
      [styles[String(type)]]: !!type,
      [styles[variant]]: variant !== DividerVarients.fullWidth,
      [styles.absolute]: !!absolute,
      [styles.flexItem]: !!flexItem,
      [styles.vertical]: orientation === DividerOrientation.vertical,
    },
    className,
  );

  return <Component {...rest} className={classOfComponent} />;
};

Divider.displayName = 'Divider';
export default Divider;
