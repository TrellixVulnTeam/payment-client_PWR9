import cn from 'classnames';
import React, { forwardRef } from 'react';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import { RadioProps } from '../Radio';
import Context from './Context';
import styles from './styles.module.scss';

export { default as Context } from './Context';

interface RadioGroupTypeMap<P = {}, D extends React.ElementType = 'div'> {
  props: P & {
    /**
     * Selected value of radio group
     */
    selected: string | number;
    /**
     * Callback fired on change, pass to `RadioGroup` components
     */
    onChange: RadioProps['onChange'];
    /**
     * Pass `disabled` props to `RadioGroup` components
     */
    disabled?: RadioProps['disabled'];
    /**
     * Defines the `flex-direction` style property.
     * @default column
     */
    direction?: 'column' | 'row';
  };
  defaultComponent: D;
}

type RadioGroupProps<D extends React.ElementType = RadioGroupTypeMap['defaultComponent'], P = {}> = OverrideProps<
  RadioGroupTypeMap<P, D>,
  D
>;

interface RadioGroupDefaultProps {
  component: React.ElementType;
  disabled: boolean;
}

const defaultProps: RadioGroupDefaultProps = {
  component: 'div',
  disabled: false,
};

export type RadioGroupComponent = BaseComponent<RadioGroupTypeMap> & {
  displayName?: string;
};

export const RadioGroup: RadioGroupComponent = forwardRef((props: RadioGroupProps, ref) => {
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

RadioGroup.displayName = 'RadioGroup';
export default RadioGroup;
