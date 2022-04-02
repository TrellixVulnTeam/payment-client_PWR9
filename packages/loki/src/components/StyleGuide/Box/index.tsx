import cn from 'classnames';
import _merge from 'lodash-es/merge';
import React from 'react';
import camelCaseToKebabCase from 'utils/common/camelToKebabCase';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import styles from './styles.module.scss';

function memoize(fn: (arg: any) => any): any {
  const cache = {};
  return (arg: any) => {
    if (cache[arg] === undefined) {
      cache[arg] = fn(arg);
    }
    return cache[arg];
  };
}

const spacingKeys = [
  'm',
  'mt',
  'mr',
  'mb',
  'ml',
  'mx',
  'my',
  'p',
  'pt',
  'pr',
  'pb',
  'pl',
  'px',
  'py',
  'margin',
  'marginTop',
  'marginRight',
  'marginBottom',
  'marginLeft',
  'marginX',
  'marginY',
  'padding',
  'paddingTop',
  'paddingRight',
  'paddingBottom',
  'paddingLeft',
  'paddingX',
  'paddingY',
];

const properties = {
  m: 'margin',
  p: 'padding',
};

const directions = {
  t: 'Top',
  r: 'Right',
  b: 'Bottom',
  l: 'Left',
  x: ['Left', 'Right'],
  y: ['Top', 'Bottom'],
};

const aliases = {
  marginX: 'mx',
  marginY: 'my',
  paddingX: 'px',
  paddingY: 'py',
};

// memoize() impact:
// From 300,000 ops/sec
// To 350,000 ops/sec
const getCssProperties = memoize((prop) => {
  // It's not a shorthand notation.
  if (prop.length > 2) {
    if (aliases[prop]) {
      prop = aliases[prop];
    } else {
      return [prop];
    }
  }

  const [a, b] = prop.split('');
  const property = properties[a];
  const direction = directions[b] || '';
  return Array.isArray(direction) ? direction.map((dir) => property + dir) : [property + direction];
});

function getValue(propValue: string | number): string | number {
  if (typeof propValue === 'string') {
    return propValue;
  }

  const transformed = Math.abs(propValue);
  if (propValue >= 0) {
    return transformed;
  }

  return -transformed;
}

function getStyleFromPropValue(cssProperties: any, breakpoint?: any): any {
  return (propValue: any) =>
    cssProperties.reduce((acc: any, cssProperty: any) => {
      const spacingKey = camelCaseToKebabCase(cssProperty);
      const spacingValue = getValue(propValue);
      const spacingClassName = breakpoint
        ? styles[`spacing-${breakpoint}-${spacingKey}-${spacingValue}`]
        : styles[`spacing-${spacingKey}-${spacingValue}`];
      acc[spacingClassName] = !!spacingValue;
      return acc;
    }, {});
}

function spacing(props: any, breakpoint?: any): any {
  return Object.keys(props)
    .map((prop) => {
      if (!spacingKeys.includes(prop)) {
        return null;
      }

      const cssProperties = getCssProperties(prop);
      const styleFromPropValue = getStyleFromPropValue(cssProperties, breakpoint);
      const propValue = props[prop];
      return styleFromPropValue(propValue);
    })
    .reduce(_merge, {});
}

interface SpacingKey {
  /**
   * The short-key of margin
   */
  m?: number;
  /**
   * The short-key of marginTop
   */
  mt?: number;
  /**
   * The short-key of marginRight
   */
  mr?: number;
  /**
   * The short-key of marginBottom
   */
  mb?: number;
  /**
   * The short-key of marginLeft
   */
  ml?: number;
  /**
   * The short-key of marginX
   */
  mx?: number;
  /**
   * The short-key of marginY
   */
  my?: number;
  /**
   * The short-key of padding
   */
  p?: number;
  /**
   * The short-key of paddingTop
   */
  pt?: number;
  /**
   * The short-key of paddingRight
   */
  pr?: number;
  /**
   * The short-key of paddingBottom
   */
  pb?: number;
  /**
   * The short-key of paddingLeft
   */
  pl?: number;
  /**
   * The short-key of paddingX
   */
  px?: number;
  /**
   * The short-key of paddingY
   */
  py?: number;
  /**
   * Property sets the margin area on all four sides of an element
   */
  margin?: number;
  /**
   * Property sets the margin area on the top of an element
   */
  marginTop?: number;
  /**
   * Property sets the margin area on the right of an element
   */
  marginRight?: number;
  /**
   * Property sets the margin area on the bottom of an element
   */
  marginBottom?: number;
  /**
   * Property sets the margin area on the left of an element
   */
  marginLeft?: number;
  /**
   * Property sets the margin area on the left and the right of an element
   */
  marginX?: number;
  /**
   * Property sets the margin area on the top and the bottom of an element
   */
  marginY?: number;
  /**
   * Property sets the padding area on all four sides of an element
   */
  padding?: number;
  /**
   * Property sets the height of the padding area on the top of an element
   */
  paddingTop?: number;
  /**
   * Property sets the height of the padding area on the right of an element
   */
  paddingRight?: number;
  /**
   * Property sets the height of the padding area on the bottom of an element
   */
  paddingBottom?: number;
  /**
   * Property sets the height of the padding area on the left of an element
   */
  paddingLeft?: number;
  /**
   * Property sets the height of the padding area on the left and the right of an element
   */
  paddingX?: number;
  /**
   * Property sets the height of the padding area on the top and the bottom of an element
   */
  paddingY?: number;
}

interface BoxTypeMap<P = {}, D extends React.ElementType = 'div'> {
  props: P &
    SpacingKey & {
      xs?: SpacingKey;
      sm?: SpacingKey;
      md?: SpacingKey;
      xl?: SpacingKey;
    };
  defaultComponent: D;
}

export type BoxProps<D extends React.ElementType = BoxTypeMap['defaultComponent'], P = {}> = OverrideProps<
  BoxTypeMap<P, D>,
  D
>;

interface BoxDefaultProps {
  component: React.ElementType;
}

const defaultProps: BoxDefaultProps = {
  component: 'div',
};

const defaultBreakpoint = ['xs', 'sm', 'md', 'lg', 'xl'];

export const Box: BaseComponent<BoxTypeMap> & {
  displayName: string;
} = (props: BoxProps) => {
  const _props = { ...defaultProps, ...props };

  const { component: Component, className, style, children, ...rest } = _props;
  const styledBreakPoint = defaultBreakpoint.map((key) => spacing(Object.assign({}, _props[key]), key));
  const classOfComponent = cn(styles.Box, spacing(Object.assign({}, rest)), ...styledBreakPoint, className);

  return (
    <Component className={classOfComponent} style={style}>
      {children}
    </Component>
  );
};

Box.displayName = 'Box';
export default Box;
