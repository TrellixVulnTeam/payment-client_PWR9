import React, { useContext } from 'react';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import { InputSizes } from '../Input';
import ListItemText from '../ListItemText';
import MenuItem, { MenuItemComponent } from '../MenuItem';
import SelectContext from '../DropdownList/select-context';

interface OptionTypeMap<P = {}, D extends React.ElementType = MenuItemComponent> {
  props: P & {
    value: any;
    size?: InputSizes;
  };
  defaultComponent: D;
}

export type OptionProps<D extends React.ElementType = OptionTypeMap['defaultComponent'], P = {}> = OverrideProps<
  OptionTypeMap<P, D>,
  D
>;

interface OptionDefaultProps {
  component: React.ElementType;
  size: InputSizes;
}

const defaultProps: OptionDefaultProps = {
  component: MenuItem,
  size: InputSizes.lg,
};

export type OptionComponent = BaseComponent<OptionTypeMap> & {
  displayName?: string;
};

export const Option: OptionComponent = (props: OptionProps) => {
  const {
    component: Component,
    value: valueProps,
    children,
    size,
    ...rest
  } = {
    ...defaultProps,
    ...props,
  };

  const selectContext = useContext(SelectContext);

  function handleClick() {
    if (!rest.disabled && valueProps !== selectContext?.value) {
      selectContext?.onChange(valueProps, children?.toString() || valueProps);
    }
  }

  const activated = selectContext?.value === valueProps;
  return (
    <Component {...rest} onClick={handleClick} activated={activated} size={rest}>
      <ListItemText size={size}>{children}</ListItemText>
    </Component>
  );
};

Option.displayName = 'Option';
export default Option;
