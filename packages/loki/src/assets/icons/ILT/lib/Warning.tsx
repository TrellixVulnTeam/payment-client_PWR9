import { OverrideProps } from 'components/StyleGuide/BaseComponent';
import React from 'react';

interface IconTypeMap<P = {}, D extends React.ElementType = 'span'> {
  props: P & {
    width?: string | number;
    height?: string | number;
  };
  defaultComponent: D;
}

export type IconProps<D extends React.ElementType = IconTypeMap['defaultComponent'], P = {}> = OverrideProps<
  IconTypeMap<P, D>,
  D
>;

interface IconDefaultProps {
  component: React.ElementType;
  width: number;
  height: number;
}

const defaultProps: IconDefaultProps = {
  component: 'svg',
  width: 24,
  height: 24,
};

const Warning = (props: IconProps) => {
  const { component: Component, ...rest } = {
    ...defaultProps,
    ...props,
  };

  return (
    <Component version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...rest}>
      <title>Warning</title>
      <path
        fill="currentColor"
        d="M16 5.335c-5.891 0-10.667 4.776-10.667 10.667s4.776 10.667 10.667 10.667c5.891 0 10.667-4.776 10.667-10.667s-4.776-10.667-10.667-10.667zM2.667 16.001c0-7.364 5.97-13.333 13.333-13.333s13.333 5.97 13.333 13.333-5.97 13.333-13.333 13.333c-7.364 0-13.333-5.97-13.333-13.333z"
      ></path>
      <path
        fill="currentColor"
        d="M16 9.332c0.736 0 1.333 0.597 1.333 1.333v5.333c0 0.736-0.597 1.333-1.333 1.333s-1.333-0.597-1.333-1.333v-5.333c0-0.736 0.597-1.333 1.333-1.333z"
      ></path>
      <path
        fill="currentColor"
        d="M14.666 21.333c0-0.736 0.597-1.333 1.333-1.333h0.013c0.736 0 1.333 0.597 1.333 1.333s-0.597 1.333-1.333 1.333h-0.013c-0.736 0-1.333-0.597-1.333-1.333z"
      ></path>
    </Component>
  );
};

export default Warning;
