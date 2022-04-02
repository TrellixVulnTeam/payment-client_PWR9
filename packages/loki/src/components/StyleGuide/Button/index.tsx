import Loading from 'assets/icons/ILT/lib/Loading';
import cn from 'classnames';
import React, { forwardRef } from 'react';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import ButtonBase from '../ButtonBase';
import Icon from '../Icon';
import styles from './styles.module.scss';
import { ButtonSizes, ButtonVariants } from './types';
export * from './types';

interface ButtonTypeMap<P = {}, D extends React.ElementType = 'button'> {
  props: P & {
    /**
     * Variant of button
     * Enum: `primary`, `secondary`, `ghost`.
     */
    variant?: ButtonVariants;
    /**
     * Size of button
     * For text: `xl`, `lg`, `md`, `sm`, `xs`.
     * For icon: `xl`, `lg`, `md`.
     */
    size?: ButtonSizes;
    /**
     * Disabled attribute
     */
    disabled?: boolean;
    /**
     * Use full width, default is `true`
     */
    fullWidth?: boolean;
    /**
     * Type attribute
     */
    type?: string;
    /**
     * Handle event on click button
     */
    onClick?: (event: React.SyntheticEvent) => void;
    /**
     * Use button icon, pass value to `Icon` component.
     * Note: if set `icon`, children of component will not display!
     */
    icon?: React.ElementType<unknown>;
    /**
     * Use start icon, pass value to `Icon` component.
     */
    startIcon?: React.ElementType<unknown>;
    /**
     * Set component is `activated`
     */
    activated?: boolean;
    /**
     * Set component is `selected`
     */
    selected?: boolean;
    /**
     * Set component is `loading`
     */
    loading?: boolean;
  };
  defaultComponent: D;
}

type ButtonProps<D extends React.ElementType = ButtonTypeMap['defaultComponent'], P = {}> = OverrideProps<
  ButtonTypeMap<P, D>,
  D
>;

interface ButtonDefaultProps {
  component: React.ElementType;
  disabled: boolean;
  fullWidth: boolean;
  loading: boolean;
  variant: ButtonVariants;
  size: ButtonSizes;
}

const defaultProps: ButtonDefaultProps = {
  component: 'button',
  disabled: false,
  fullWidth: true,
  loading: false,
  variant: ButtonVariants.primary,
  size: ButtonSizes.md,
};

export type ButtonComponent = BaseComponent<ButtonTypeMap> & {
  displayName?: string;
};

export const Button: ButtonComponent = forwardRef((props: ButtonProps, ref) => {
  const {
    component: Component,
    variant,
    size,
    className,
    children,
    disabled,
    activated,
    selected,
    fullWidth,
    loading,
    icon,
    startIcon,
    onClick,
    ...rest
  } = { ...defaultProps, ...props };

  const shouldUseIcon = !!icon || !!loading;

  const handleOnClick = (event: React.SyntheticEvent) => {
    if (!loading && !disabled) {
      if (typeof onClick === 'function') {
        onClick(event);
      }
    }
  };

  const classOfComponent = cn(styles.btn, styles[`variant-${variant}`], styles[`size-${size}`], className, {
    [styles.disabled]: disabled,
    [styles.activated]: activated,
    [styles.selected]: selected,
    [styles.loading]: loading,
    [styles['full-width']]: fullWidth,
    [styles['use-icon']]: shouldUseIcon,
  });

  const contentOfButton = shouldUseIcon ? (
    <Icon className={styles.icon} component={loading ? Loading : icon} />
  ) : (
    children
  );

  const contentStartIcon = startIcon ? (
    <Icon className={cn(styles.icon, styles['start-icon'])} component={startIcon} />
  ) : null;

  return (
    <ButtonBase
      {...rest}
      ref={ref}
      component={Component}
      disabled={disabled || loading}
      onClick={handleOnClick}
      className={classOfComponent}
    >
      {contentStartIcon}
      {contentOfButton}
    </ButtonBase>
  );
});

Button.displayName = 'Button';
export default Button;
