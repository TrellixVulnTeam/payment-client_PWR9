import cn from 'classnames';
import React from 'react';
import styles from './styles.module.scss';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import { AlertVariants, AlertTypes } from './types';
import AlertCircle from 'assets/icons/ILT/lib/AlertCircle';
import Icon from '../Icon';

interface AlertTypeMap<P = {}, D extends React.ElementType = 'div'> {
  props: P & {
    type?: AlertTypes;
    startIcon?: React.ElementType<unknown>;
  };
  defaultComponent: D;
}

type AlertProps<D extends React.ElementType = AlertTypeMap['defaultComponent'], P = {}> = OverrideProps<
  AlertTypeMap<P, D>,
  D
>;

interface AvatarDefaultProps {
  component: React.ElementType;
  variant: AlertVariants;
}

const defaultProps: AvatarDefaultProps = {
  component: 'div',
  variant: AlertVariants.outlined,
};

const Alert: BaseComponent<AlertTypeMap> = (_props: AlertProps) => {
  const {
    component: Component,
    children,
    className,
    variant,
    type,
    startIcon,
    ...rest
  } = {
    ...defaultProps,
    ..._props,
  };

  const classOfComponent = cn(styles.alert, className, {
    [styles[`variant-${variant}`]]: variant,
    [styles[`type-${type}`]]: type,
  });

  const contentStartIcon = (
    <Icon className={cn(styles.icon, styles['start-icon'])} component={startIcon ? startIcon : AlertCircle} />
  );

  return (
    <Component className={classOfComponent} {...rest}>
      {contentStartIcon}
      {children}
    </Component>
  );
};

export default Alert;
