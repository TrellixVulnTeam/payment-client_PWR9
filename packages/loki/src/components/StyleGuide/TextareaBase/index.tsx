import React, { forwardRef } from 'react';
import { BaseComponent, OverrideProps } from '../BaseComponent';

export interface TextareaBaseTypeMap<P = {}, D extends React.ElementType = 'textarea'> {
  props: P & {};
  defaultComponent: D;
}

type TextareaBaseProps<D extends React.ElementType = TextareaBaseTypeMap['defaultComponent'], P = {}> = OverrideProps<
  TextareaBaseTypeMap<P, D>,
  D
>;

interface TextareaBaseDefaultProps {
  component: React.ElementType;
}

const defaultProps: TextareaBaseDefaultProps = {
  component: 'textarea',
};

export type TextareaBaseType = BaseComponent<TextareaBaseTypeMap> & {
  displayName?: string;
};

// @ts-ignore
export const TextareaBase: TextareaBaseType = forwardRef((_props: TextareaBaseProps, ref: any) => {
  const { component: Component, ...rest } = {
    ...defaultProps,
    ..._props,
  };
  return <Component {...rest} ref={ref} />;
});

export default TextareaBase;
