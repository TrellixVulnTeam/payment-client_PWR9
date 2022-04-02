import React from 'react';
import cn from 'classnames';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import styles from './styles.module.scss';

interface IconTypeMap<P = {}, D extends React.ElementType = 'svg'> {
  props: P & {
    width?: string | number;
    height?: string | number;
    color?: string;
  };
  defaultComponent: D;
}

export type IconProps<D extends React.ElementType = IconTypeMap['defaultComponent'], P = {}> = OverrideProps<
  IconTypeMap<P, D>,
  D
>;

interface IconDefaultProps {
  component: React.ElementType;
  width?: number;
  height?: number;
  color?: string;
}

const defaultProps: IconDefaultProps = {
  component: 'svg',
  width: 24,
  height: 24,
  color: '#031352'
};

export const Icon: BaseComponent<IconTypeMap> & {
  displayName: string;
} = (_props: IconProps) => {
  const {
    component: Component,
    className,
    ...rest
  } = {
    ...defaultProps,
    ..._props,
  };
  const classOfComponent = cn(styles.icon, className);

  return (
    <Component
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={classOfComponent}
      {...rest}
    />
  );
};

Icon.displayName = 'Icon';
export default Icon;
