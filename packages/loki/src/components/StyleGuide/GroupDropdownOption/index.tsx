import cn from 'classnames';
import React, { forwardRef, useCallback, useContext, useMemo, useRef } from 'react';
import compose from 'utils/common/compose';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import { GroupBase, IOption } from '../GroupDropdown';
import Icon, { IconProps } from '../Icon';
import { InputSizes } from '../Input';
import InputBase from '../InputBase';
import ListItem from '../ListItem';
import ListItemText from '../ListItemText';
import Context from '../GroupDropdown/Context';
import { TypoTypes, TypoWeights } from '../Typography';
import styles from './styles.module.scss';
import { getIconByStatus, getStatusOfCheckbox } from './utils';
export * from './types';

interface GroupDropdownOptionTypeMap<P = {}, D extends React.ElementType = 'label'> {
  props: P & {
    /**
     * Data source
     */
    data: IOption | GroupBase<IOption>;
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
    inset?: boolean;
    groupIndex?: number;
  };
  defaultComponent: D;
}

export type GroupDropdownOptionProps<
  D extends React.ElementType = GroupDropdownOptionTypeMap['defaultComponent'],
  P = {},
> = OverrideProps<GroupDropdownOptionTypeMap<P, D>, D>;

interface GroupDropdownOptionDefaultProps {
  component: React.ElementType;
  disabled: boolean;
  size?: InputSizes;
}

const defaultProps: GroupDropdownOptionDefaultProps = {
  component: ListItem,
  disabled: false,
  size: InputSizes.lg,
};

export type GroupDropdownOptionComponent = BaseComponent<GroupDropdownOptionTypeMap> & {
  displayName?: string;
};

export const GroupDropdownOption: GroupDropdownOptionComponent = forwardRef((props: GroupDropdownOptionProps, ref) => {
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
    data,
    inset,
    groupIndex,
    ...rest
  } = { ...defaultProps, ...props };

  const context = useContext(Context);
  const multipleSelectOptionName = name || context.name;
  const isDisabled = disabled || context.disabled;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onChangeComposed = useCallback(compose(onChange, context.onChange), [onChange, context.onChange]);

  function handleClick(e) {
    if (!disabled) {
      onChangeComposed({
        target: {
          ...e,
          value,
          groupIndex,
        },
      });
    }
  }

  const refOfInput = useRef();
  const statusOfCheckbox = getStatusOfCheckbox(checked, isIntermediate);
  const iconOfCheckbox = getIconByStatus(statusOfCheckbox);

  const classOfRoot = cn(styles.root, className, {
    [styles.disabled]: isDisabled,
    [styles.checked]: checked,
    [styles.intermediate]: isIntermediate,
    [styles.inset]: inset,
  });

  const _renderRoot = useMemo(() => data && <span className={styles.content}>{data.name}</span>, [data]);

  return (
    <Component {...rest} ref={ref} className={classOfRoot} role="checkbox" onClick={handleClick}>
      <Icon {...iconProps} ref={iconRef} className={styles.icon} component={iconOfCheckbox} />
      <ListItemText size={size} type={TypoTypes.default} weight={TypoWeights.bold}>
        {_renderRoot}
      </ListItemText>
      <InputBase
        readOnly
        type="checkbox"
        ref={refOfInput}
        name={multipleSelectOptionName}
        value={value}
        className={styles.input}
        checked={checked}
        onChange={onChangeComposed}
      />
    </Component>
  );
});

GroupDropdownOption.displayName = 'GroupDropdownOption';
export default React.memo(GroupDropdownOption);
