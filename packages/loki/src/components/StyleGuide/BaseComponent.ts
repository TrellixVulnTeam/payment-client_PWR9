import React from 'react';

export interface BaseComponent<M extends OverridableTypeMap> {
  <C extends React.ElementType>(props: { component?: C } & OverrideProps<M, C>): JSX.Element;
  (props: DefaultComponentProps<M>): JSX.Element;
}

/**
 * Props of the component if `component={Component}` is used.
 */
export type OverrideProps<M extends OverridableTypeMap, C extends React.ElementType> = BaseProps<M> &
  Omit<React.ComponentPropsWithRef<C>, keyof CommonProps>;

/**
 * Props if `component={Component}` is NOT used.
 */
export type DefaultComponentProps<M extends OverridableTypeMap> = BaseProps<M> &
  Omit<React.ComponentPropsWithRef<M['defaultComponent']>, keyof BaseProps<M>>;

/**
 * Props defined on the component (+ common props).
 */
export type BaseProps<M extends OverridableTypeMap> = M['props'] & CommonProps;

export interface CommonProps {
  className?: string;
  style?: React.CSSProperties;
  children?: any;
}

export interface OverridableTypeMap {
  props: {};
  defaultComponent: React.ElementType;
  classKey?: string;
}
