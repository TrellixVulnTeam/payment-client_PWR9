import cn from 'classnames';
import React, { forwardRef } from 'react';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import styles from './styles.module.scss';

export interface ButtonBaseTypeMap<P = {}, D extends React.ElementType = 'div'> {
  props: P & {};
  defaultComponent: D;
}

type ButtonBaseProps<D extends React.ElementType = ButtonBaseTypeMap['defaultComponent'], P = {}> = OverrideProps<
  ButtonBaseTypeMap<P, D>,
  D
>;

interface ButtonBaseDefaultProps {
  component: React.ElementType;
}

const defaultProps: ButtonBaseDefaultProps = {
  component: 'button',
};

export const ButtonBase: BaseComponent<ButtonBaseTypeMap> & {
  displayName?: string;
} = forwardRef((props: ButtonBaseProps, ref) => {
  const {
    component: Component,
    className,
    ...rest
  } = {
    ...defaultProps,
    ...props,
  };

  const classOfComponent = cn(styles.btn, className);
  return <Component {...rest} ref={ref} className={classOfComponent} />;
});

ButtonBase.displayName = 'ButtonBase';
export default ButtonBase;
