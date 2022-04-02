import React, { forwardRef, MutableRefObject } from 'react';
import NumberFormat, { NumberFormatValues } from 'react-number-format';
import cn from 'classnames';
import { BaseComponent, OverrideProps } from 'components/StyleGuide/BaseComponent';
import { InputSizes, InputStatuses } from 'components/StyleGuide/Input';
import { getArrayOf } from 'utils/common/getArrayOf';
import styles from './styles.module.scss';

export interface InputMoneyFormatTypeMap<P = {}, D extends React.ElementType = 'input'> {
  props: P & {
    status?: InputStatuses;
    thousandSeparator?: string;
    decimalSeparator?: string;
    suffix?: string;
    wrapperRef?: MutableRefObject<HTMLDivElement>;
    beforeInput?: React.ReactNode;
    afterInput?: React.ReactNode;
    size?: InputSizes;
  };
  defaultComponent: D;
}

type InputMoneyFormatProps<
  D extends React.ElementType = InputMoneyFormatTypeMap['defaultComponent'],
  P = {},
> = OverrideProps<InputMoneyFormatTypeMap<P, D>, D>;

interface InputMoneyFormatDefaultProps {
  component: React.ElementType;
  thousandSeparator: string;
  decimalSeparator: string;
  suffix: string;
  size: InputSizes;
  status: InputStatuses;
}

const defaultProps: InputMoneyFormatDefaultProps = {
  component: NumberFormat,
  thousandSeparator: ',',
  decimalSeparator: '.',
  suffix: ' đ',
  size: InputSizes.md,
  status: InputStatuses.primary,
};

export type InputMoneyFormatType = BaseComponent<InputMoneyFormatTypeMap> & {
  displayName?: string;
};

export const InputMoneyFormat: InputMoneyFormatType = forwardRef((props: InputMoneyFormatProps, ref: any) => {
  const {
    component: Component,
    wrapperRef,
    className,
    status,
    beforeInput,
    afterInput,
    onChange,
    name,
    ...rest
  } = {
    ...defaultProps,
    ...props,
  };

  const classOfRoot = cn(styles.root, styles[`status-${status}`], className, rest.disabled && styles.disabled);
  const beforeInputs = getArrayOf(beforeInput);
  const afterInputs = getArrayOf(afterInput);

  const classOfInputBase = cn(
    styles.input,
    styles[`size-${rest.size}`],
    beforeInputs.length > 0 && styles['has-before'],
    afterInputs.length > 0 && styles['has-after'],
    rest.disabled && styles.disabled,
  );

  const handleValueChange = (values: NumberFormatValues) => {
    if (typeof onChange === 'function') {
      onChange({
        // @ts-ignore
        target: {
          name: name,
          value: values.value,
        },
      });
    }
  };

  return (
    <div className={classOfRoot} role="presentation" ref={wrapperRef}>
      {beforeInputs.map((component, index) =>
        // @ts-ignore
        React.cloneElement(component, {
          key: index.toString(),
          disabled: rest.disabled,
          size: rest.size,
          className: styles['adornment'],
        }),
      )}
      <Component ref={ref} className={classOfInputBase} onValueChange={handleValueChange} {...rest} />
      {afterInputs.map((component, index) =>
        // @ts-ignore
        React.cloneElement(component, {
          key: index.toString(),
          disabled: rest.disabled,
          size: rest.size,
          className: styles['adornment'],
        }),
      )}
    </div>
  );
});

InputMoneyFormat.displayName = 'InputMoneyFormat';
export default InputMoneyFormat;
