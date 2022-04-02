import cn from 'classnames';
import React from 'react';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import styles from './styles.module.scss';

interface ImageBaseTypeMap<P = {}, D extends React.ElementType = 'img'> {
  props: P & {
    /**
     * Pass `src` to `img` component
     */
    src: string;
    /**
     * Pass `alt` to `img` component
     */
    alt: string;
    /**
     * Handle on error event
     */
    onError?: React.EventHandler<React.SyntheticEvent>;
  };
  defaultComponent: D;
}

type ImageBaseProps<D extends React.ElementType = ImageBaseTypeMap['defaultComponent'], P = {}> = OverrideProps<
  ImageBaseTypeMap<P, D>,
  D
>;

interface ImageBaseDefaultProps {
  component: React.ElementType;
  className: string | null;
}

const defaultProps: ImageBaseDefaultProps = {
  component: 'img',
  className: null,
};

export type ImageBaseType = BaseComponent<ImageBaseTypeMap> & {
  displayName?: string;
};

export const ImageBase: ImageBaseType = (props: ImageBaseProps) => {
  const {
    component: Component,
    className,
    src,
    alt,
    ...rest
  } = {
    ...defaultProps,
    ...props,
  };

  const classOfComponent = cn(styles.imageBase, className);

  return <Component {...rest} src={src} alt={alt} className={classOfComponent} />;
};

ImageBase.displayName = 'ImageBase';
export default ImageBase;
