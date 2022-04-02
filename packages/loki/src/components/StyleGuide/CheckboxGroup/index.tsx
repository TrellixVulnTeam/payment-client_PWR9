import cn from 'classnames';
import React, { forwardRef } from 'react';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import { CheckboxProps } from '../Checkbox';
import Context from './Context';
import styles from './styles.module.scss';

export { default as Context } from './Context';

interface CheckboxGroupTypeMap<P = {}, D extends React.ElementType = 'div'> {
  props: P & {
    /**
     * Selected value of radio group
     */
    selected: string[];
    /**
     * Callback fired on change, pass to `CheckboxGroup` components
     */
    onChange: CheckboxProps['onChange'];
    /**
     * Pass `disabled` props to `CheckboxGroup` components
     */
    disabled?: CheckboxProps['disabled'];
    /**
     * Defines the `flex-direction` style property.
     * @default column
     */
    direction?: 'column' | 'row';
  };
  defaultComponent: D;
}

type CheckboxGroupProps<D extends React.ElementType = CheckboxGroupTypeMap['defaultComponent'], P = {}> = OverrideProps<
  CheckboxGroupTypeMap<P, D>,
  D
>;

interface CheckboxGroupDefaultProps {
  component: React.ElementType;
  disabled: boolean;
}

const defaultProps: CheckboxGroupDefaultProps = {
  component: 'div',
  disabled: false,
};

export type CheckboxGroupComponent = BaseComponent<CheckboxGroupTypeMap> & {
  displayName?: string;
};

export const CheckboxGroup: CheckboxGroupComponent = forwardRef((props: CheckboxGroupProps, ref) => {
  const {
    component: Component,
    direction = 'column',
    className,
    disabled,
    selected,
    onChange,
    children,
    ...rest
  } = {
    ...defaultProps,
    ...props,
  };

  const classOfComponent = cn(styles.root, className, {
    [styles.disabled]: disabled,
    [styles[`direction-${direction}`]]: direction,
  });

  const context = {
    disabled,
    selected,
    onChange,
  };

  return (
    <Component {...rest} ref={ref} className={classOfComponent}>
      <Context.Provider value={context}>{children}</Context.Provider>
    </Component>
  );
});

CheckboxGroup.displayName = 'CheckboxGroup';
export default CheckboxGroup;
