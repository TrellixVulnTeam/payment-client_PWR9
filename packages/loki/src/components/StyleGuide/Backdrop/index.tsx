import cn from 'classnames';
import React from 'react';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import styles from './styles.module.scss';
import { BackdropVariant } from './types';

export * from './types';

interface BackdropTypeMap<P = {}, D extends React.ElementType = 'div'> {
  props: P & {
    variant?: BackdropVariant;
  };
  defaultComponent: D;
}

type BackdropProps<D extends React.ElementType = BackdropTypeMap['defaultComponent'], P = {}> = OverrideProps<
  BackdropTypeMap<P, D>,
  D
>;

interface BackdropDefaultProps {
  component: React.ElementType;
  variant: BackdropVariant;
}

const defaultProps: BackdropDefaultProps = {
  component: 'div',
  variant: BackdropVariant.grey,
};

export const Backdrop: BaseComponent<BackdropTypeMap> & {
  displayName?: string;
} = (_props: BackdropProps) => {
  const {
    component: Component,
    className,
    variant,
    ...rest
  } = {
    ...defaultProps,
    ..._props,
  };
  return (
    <Component
      className={cn(styles.backdrop, className, {
        [styles[variant]]: !!styles[variant],
      })}
      {...rest}
    />
  );
};

Backdrop.displayName = 'Backdrop';

export default Backdrop;
