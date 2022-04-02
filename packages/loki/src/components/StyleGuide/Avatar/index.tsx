import cn from 'classnames';
import React from 'react';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import styles from './styles.module.scss';
import { AvatarSize } from './type';
import { getColorWithCharacter } from 'utils/common';
import useImageLoaded from 'hooks/useImageLoaded';
import { default as MuiAvatar } from '@material-ui/core/Avatar';

interface AvatarTypeMap<P = {}, D extends React.ElementType = 'div'> {
  props: P & {
    src?: string;
    alt?: string;
  };
  defaultComponent: D;
}

type AvatarProps<D extends React.ElementType = AvatarTypeMap['defaultComponent'], P = {}> = OverrideProps<
  AvatarTypeMap<P, D>,
  D
>;

interface AvatarDefaultProps {
  component: React.ElementType;
  size: AvatarSize;
}

const defaultProps: AvatarDefaultProps = {
  component: 'div',
  size: AvatarSize.medium,
};

const AvatarImage = ({ size = AvatarSize.medium, src }: any) => {
  return <MuiAvatar className={styles[`avatar-content-${size}`]} src={src} />;
  // return <div className={styles['avatar-image']} style={{ backgroundImage: `url(${src})` }}></div>;
};

const AvatarContent = ({ size = AvatarSize.medium, children }: any) => {
  return (
    <MuiAvatar
      className={styles[`avatar-content-${size}`]}
      style={{ backgroundColor: typeof children === 'string' ? getColorWithCharacter(children) : '#7C84A3' }}
    >
      {typeof children === 'string' ? children.toUpperCase() : children}
    </MuiAvatar>
  );
};

const Avatar2: BaseComponent<AvatarTypeMap> = (_props: AvatarProps) => {
  const {
    component: Component,
    className,
    size,
    src,
    alt,
    children: childrenProp,
    ...rest
  } = {
    ...defaultProps,
    ..._props,
  };

  let children = null;

  const image = useImageLoaded({ src: src });
  const hasImg = src;
  const hasImgNotFailing = hasImg && image.isLoaded;

  if (hasImgNotFailing) {
    children = <AvatarImage size={size} src={src} />;
  } else if (childrenProp !== null) {
    children = <AvatarContent size={size}>{childrenProp}</AvatarContent>;
  } else {
    // fallback image
    children = <AvatarContent size={size}>{childrenProp}</AvatarContent>;
  }

  const classOfComponent = cn(styles.avatar, className, {
    [styles[`size-${size}`]]: size,
    [styles[`avatar-${size}`]]: size,
  });

  return (
    <Component className={classOfComponent} {...rest}>
      {children}
    </Component>
  );
};

export default Avatar2;
