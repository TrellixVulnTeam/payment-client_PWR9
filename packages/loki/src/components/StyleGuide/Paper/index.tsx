import cn from 'classnames';
import React, { forwardRef } from 'react';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import styles from './style.module.scss';
import { PaperRadius, PaperBackgrounds } from './types';

export * from './types';

type Elevation = 0 | 1 | 2;

interface PaperTypeMap<P = {}, D extends React.ElementType = 'div'> {
  props: P & {
    /**
     * Border radius value
     */
    radius?: PaperRadius;
    /**
     * Background color value
     * Enum: ghost
     */
    background?: PaperBackgrounds;
    /**
     * Callback fired on click to component
     */
    onClick?: React.EventHandler<React.SyntheticEvent>;

    elevation?: Elevation;
  };
  defaultComponent: D;
}

export type PaperProps<D extends React.ElementType = PaperTypeMap['defaultComponent'], P = {}> = OverrideProps<
  PaperTypeMap<P, D>,
  D
>;

interface PaperDefaultProps {
  component: React.ElementType;
  radius: PaperRadius;
  elevation: Elevation;
}

const defaultProps: PaperDefaultProps = {
  component: 'div',
  radius: PaperRadius.regular,
  elevation: 0,
};

export type PaperComponent = BaseComponent<PaperTypeMap> & {
  displayName?: string;
};

export const Paper: PaperComponent = forwardRef((props: PaperProps, ref) => {
  const {
    component: Component,
    className,
    elevation,
    radius,
    background,
    ...rest
  } = {
    ...defaultProps,
    ...props,
  };

  const classOfComponent = cn(styles.paper, className, {
    [styles[`radius-${String(radius)}`]]: radius,
    [styles[`elevation-${String(elevation)}`]]: !!elevation,
    [styles[`background-${String(background)}`]]: !!background,
  });

  return <Component {...rest} className={classOfComponent} ref={ref} />;
});

Paper.displayName = 'Paper';
export default Paper;
