import React, { forwardRef } from 'react';
import { BaseComponent, OverrideProps } from '../BaseComponent';

export interface InputBaseTypeMap<P = {}, D extends React.ElementType = 'input'> {
  props: P & {};
  defaultComponent: D;
}

type InputBaseProps<D extends React.ElementType = InputBaseTypeMap['defaultComponent'], P = {}> = OverrideProps<
  InputBaseTypeMap<P, D>,
  D
>;

interface InputBaseDefaultProps {
  component: React.ElementType;
}

const defaultProps: InputBaseDefaultProps = {
  component: 'input',
};

export type InputBaseType = BaseComponent<InputBaseTypeMap> & {
  displayName?: string;
};

// @ts-ignore
export const InputBase: InputBaseType = forwardRef((_props: InputBaseProps, ref: any) => {
  const { component: Component, ...rest } = {
    ...defaultProps,
    ..._props,
  };
  return <Component {...rest} ref={ref} />;
});

export default InputBase;
