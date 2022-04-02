import cn from 'classnames';
import React, { forwardRef, useCallback, useContext, useMemo, useRef } from 'react';
import compose from 'utils/common/compose';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import { Context } from '../CheckboxGroup';
import Icon, { IconProps } from '../Icon';
import InputBase from '../InputBase';
import styles from './styles.module.scss';
import { getIconByStatus, getStatusOfCheckbox } from './utils';
export * from './types';

interface CheckboxTypeMap<P = {}, D extends React.ElementType = 'label'> {
  props: P & {
    /**
     * Set name of `InputBase` component
     */
    name?: string;
    /**
     * Use ref of `Icon` component
     */
    iconRef?: React.Ref<unknown>;
    /**
     * Pass all props to `Icon` component
     */
    iconProps?: IconProps;
    /**
     * Set component is `checked`
     */
    checked?: boolean;
    /**
     * Value of component
     */
    value?: string;
    /**
     * Callback fired on change value of checkbox, value is `boolean`
     */
    onChange?: React.EventHandler<React.SyntheticEvent>;
    /**
     * Set component is `intermediate`, default is `false`
     */
    isIntermediate?: boolean;
    /**
     * Set component is `disabled`
     */
    disabled?: boolean;
  };
  defaultComponent: D;
}

export type CheckboxProps<D extends React.ElementType = CheckboxTypeMap['defaultComponent'], P = {}> = OverrideProps<
  CheckboxTypeMap<P, D>,
  D
>;

interface CheckboxDefaultProps {
  component: React.ElementType;
  disabled: boolean;
}

const defaultProps: CheckboxDefaultProps = {
  component: 'label',
  disabled: false,
};

export type CheckboxComponent = BaseComponent<CheckboxTypeMap> & {
  displayName?: string;
};

export const Checkbox: CheckboxComponent = forwardRef((props: CheckboxProps, ref) => {
  const {
    component: Component,
    className,
    disabled,
    onChange,
    value,
    checked,
    isIntermediate,
    name,
    iconRef,
    iconProps,
    children,
    ...rest
  } = { ...defaultProps, ...props };

  const context = useContext(Context);
  const checkboxName = name || context.name;
  const isDisabled = disabled || context.disabled;
  const checkIsBoolean = typeof checked === 'boolean';
  const isChecked = checkIsBoolean ? checked : (context.selected || []).find((item) => item === value) !== undefined;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onChangeComposed = useCallback(compose(onChange, context.onChange), [onChange, context.onChange]);

  const refOfInput = useRef();
  const statusOfCheckbox = getStatusOfCheckbox(isChecked, isIntermediate);
  const iconOfCheckbox = getIconByStatus(statusOfCheckbox);

  const classOfRoot = cn(styles.root, className, {
    [styles.disabled]: isDisabled,
    [styles.checked]: isChecked,
    [styles.intermediate]: isIntermediate,
  });

  const _children = useMemo(() => children && <span className={styles.content}>{children}</span>, [children]);

  return (
    <Component {...rest} ref={ref} className={classOfRoot} role="checkbox">
      <Icon {...iconProps} ref={iconRef} className={styles.icon} component={iconOfCheckbox} />
      {_children}
      <InputBase
        readOnly
        type="checkbox"
        ref={refOfInput}
        name={checkboxName}
        value={value}
        className={styles.input}
        checked={isChecked}
        onChange={onChangeComposed}
      />
    </Component>
  );
});

Checkbox.displayName = 'Checkbox';
export default React.memo(Checkbox);
