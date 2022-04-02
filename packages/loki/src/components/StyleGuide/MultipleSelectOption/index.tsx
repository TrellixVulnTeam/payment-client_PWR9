import cn from 'classnames';
import React, { forwardRef, useCallback, useContext, useMemo, useRef } from 'react';
import compose from 'utils/common/compose';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import Icon, { IconProps } from '../Icon';
import { InputSizes } from '../Input';
import InputBase from '../InputBase';
import ListItem from '../ListItem';
import ListItemText from '../ListItemText';
import Context from '../MultipleSelect/Context';
import { TypoTypes, TypoWeights } from '../Typography';
import styles from './styles.module.scss';
import { getIconByStatus, getStatusOfCheckbox } from './utils';
export * from './types';

interface MultipleSelectOptionTypeMap<P = {}, D extends React.ElementType = 'label'> {
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
     * Callback fired on change value of multiple select option, value is `boolean`
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
    size?: InputSizes;
  };
  defaultComponent: D;
}

export type MultipleSelectOptionProps<
  D extends React.ElementType = MultipleSelectOptionTypeMap['defaultComponent'],
  P = {},
> = OverrideProps<MultipleSelectOptionTypeMap<P, D>, D>;

interface MultipleSelectOptionDefaultProps {
  component: React.ElementType;
  disabled: boolean;
  size?: InputSizes;
}

const defaultProps: MultipleSelectOptionDefaultProps = {
  component: ListItem,
  disabled: false,
  size: InputSizes.lg,
};

export type MultipleSelectOptionComponent = BaseComponent<MultipleSelectOptionTypeMap> & {
  displayName?: string;
};

export const MultipleSelectOption: MultipleSelectOptionComponent = forwardRef(
  (props: MultipleSelectOptionProps, ref) => {
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
      size,
      ...rest
    } = { ...defaultProps, ...props };

    const context = useContext(Context);
    const multipleSelectOptionName = name || context.name;
    const isDisabled = disabled || context.disabled;
    const checkIsBoolean = typeof checked === 'boolean';
    const isChecked = checkIsBoolean
      ? checked
      : (context.selected || []).find((item) => item === value) !== undefined;

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onChangeComposed = useCallback(compose(onChange, context.onChange), [onChange, context.onChange]);

    function handleClick(e) {
      if (!disabled) {
        onChangeComposed({
          target: {
            ...e,
            value,
          },
        });
      }
    }

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
      <Component {...rest} ref={ref} className={classOfRoot} role="checkbox" onClick={handleClick}>
        <Icon {...iconProps} ref={iconRef} className={styles.icon} component={iconOfCheckbox} />
        <ListItemText size={size} type={TypoTypes.default} weight={TypoWeights.bold}>
          {_children}
        </ListItemText>
        <InputBase
          readOnly
          type="checkbox"
          ref={refOfInput}
          name={multipleSelectOptionName}
          value={value}
          className={styles.input}
          checked={isChecked}
          onChange={onChangeComposed}
        />
      </Component>
    );
  },
);

MultipleSelectOption.displayName = 'MultipleSelectOption';
export default React.memo(MultipleSelectOption);
