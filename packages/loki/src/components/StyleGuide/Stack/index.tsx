import cn from 'classnames';
import React, { forwardRef } from 'react';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import styles from './styles.module.scss';
import { joinChildren } from './util';

interface StackTypeMap<P = {}, D extends React.ElementType = 'div'> {
  props: P & {
    /**
     * Add an element between each child.
     */
    divider?: React.ReactElement;
    /**
     * Defines the space between immediate children.
     * @default 0
     */
    spacing?: number;
    /**
     * Defines the `flex-direction` style property.
     * @default row
     */
    direction?: 'column' | 'row';
  };
  defaultComponent: D;
}

type StackProps<D extends React.ElementType = StackTypeMap['defaultComponent'], P = {}> = OverrideProps<
  StackTypeMap<P, D>,
  D
>;

interface StackDefaultProps {
  component: React.ElementType;
}

const defaultProps: StackDefaultProps = {
  component: 'div',
};

export const Stack: BaseComponent<StackTypeMap> & {
  displayName?: string;
} = forwardRef((props: StackProps, ref: any) => {
  const {
    component: Component,
    divider,
    direction,
    spacing,
    className,
    children,
    ...rest
  } = {
    ...defaultProps,
    ...props,
  };

  const classOfComponent = cn(
    styles.stack,
    {
      [styles[`spacing-${spacing}`]]: spacing,
      [styles[`direction-${direction}`]]: direction,
    },
    className,
  );

  return (
    <Component {...rest} className={classOfComponent} ref={ref}>
      {divider ? joinChildren(children, divider) : children}
    </Component>
  );
});

Stack.displayName = 'Stack';
export default Stack;
