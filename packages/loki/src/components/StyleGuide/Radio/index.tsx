import cn from 'classnames';
import React, { forwardRef, useCallback, useContext, useMemo, useRef } from 'react';
import InputBase from 'components/StyleGuide/InputBase';
import { Context } from 'components/StyleGuide/RadioGroup';
import { BaseComponent, OverrideProps } from 'components/StyleGuide/BaseComponent';
import compose from 'utils/common/compose';
import styles from './styles.module.scss';

interface RadioTypeMap<P = {}, D extends React.ElementType = 'label'> {
  props: P & {
    /**
     * Set name of `InputBase` component
     */
    name?: string;
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

export type RadioProps<D extends React.ElementType = RadioTypeMap['defaultComponent'], P = {}> = OverrideProps<
  RadioTypeMap<P, D>,
  D
>;

interface RadioDefaultProps {
  component: React.ElementType;
  disabled: boolean;
}

const defaultProps: RadioDefaultProps = {
  component: 'label',
  disabled: false,
};

export type RadioComponent = BaseComponent<RadioTypeMap> & {
  displayName?: string;
};

export const Radio: RadioComponent = forwardRef((props: RadioProps, ref) => {
  const {
    component: Component,
    className,
    disabled,
    onChange,
    value,
    checked,
    isIntermediate,
    name,
    children,
    ...rest
  } = { ...defaultProps, ...props };

  const context = useContext(Context);
  const checkboxName = name || context.name;
  const isDisabled = disabled || context.disabled;
  const checkIsBoolean = typeof checked === 'boolean';
  const isChecked = checkIsBoolean ? checked : context.selected === value;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onChangeComposed = useCallback(compose(onChange, context.onChange), [onChange, context.onChange]);

  const refOfInput = useRef();

  const classOfRoot = cn(styles.container, className, {
    [styles.disabled]: isDisabled,
    [styles.checked]: isChecked,
    [styles.intermediate]: isIntermediate,
  });

  const _children = useMemo(() => children && <span className={styles.content}>{children}</span>, [children]);

  return (
    <Component {...rest} ref={ref} className={classOfRoot} role="radio">
      {_children}
      <InputBase
        readOnly
        type="radio"
        ref={refOfInput}
        name={checkboxName}
        value={value}
        className={styles.radio}
        checked={isChecked}
        onChange={onChangeComposed}
      />
      <span className={styles.checkmark}></span>
    </Component>
  );
});

Radio.displayName = 'Radio';
export default React.memo(Radio);
