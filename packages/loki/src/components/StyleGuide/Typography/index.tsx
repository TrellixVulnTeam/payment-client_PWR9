import cn from 'classnames';
import React from 'react';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import styles from './styles.module.scss';
import { TypoTypes, TypoVariants, TypoWeights, defaultTypoVariantMapping } from './types';
export * from './types';
export { TypoVariants, TypoTypes, TypoWeights };

interface TypoTypeMap<P = {}, D extends React.ElementType = 'span'> {
  props: P & {
    type?: TypoTypes;
    weight?: TypoWeights;
    variant?: TypoVariants;
    truncate?: number;
    component?: React.ElementType;
  };
  defaultComponent: D;
}

type TypoProps<D extends React.ElementType = TypoTypeMap['defaultComponent'], P = {}> = OverrideProps<
  TypoTypeMap<P, D>,
  D
>;

interface TypoDefaultProps {
  type: TypoTypes;
  variant: TypoVariants;
}

const defaultProps: TypoDefaultProps = {
  type: TypoTypes.default,
  variant: TypoVariants.body2,
};

export const Typography: BaseComponent<TypoTypeMap> & {
  displayName?: string;
} = (_props: TypoProps) => {
  const { component, className, variant, type, weight, truncate, ...rest } = { ...defaultProps, ..._props };

  const Component = component || defaultTypoVariantMapping[variant] || 'span';

  const hasTruncate = truncate > 0;
  const classOfComponent = cn(className, styles['root'], {
    [styles.truncate]: hasTruncate,
    [styles[`truncate-${truncate}`]]: hasTruncate,
    [styles[`variant-${String(variant)}`]]: variant,
    [styles[`weight-${String(weight)}`]]: weight,
    [styles[`type-${String(type)}`]]: type,
  });

  return <Component className={classOfComponent} {...rest} />;
};

Typography.displayName = 'Typography';

export default Typography;
