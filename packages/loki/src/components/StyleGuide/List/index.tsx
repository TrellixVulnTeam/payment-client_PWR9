import cn from 'classnames';
import csstype from 'csstype';
import React from 'react';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import styles from './styles.module.scss';

interface ListTypeMap<P = {}, D extends React.ElementType = 'ul'> {
  props: P & {
    direction?: csstype.FlexDirectionProperty;
  };
  defaultComponent: D;
}

type ListProps<D extends React.ElementType = ListTypeMap['defaultComponent'], P = {}> = OverrideProps<
  ListTypeMap<P, D>,
  D
>;

interface ListDefaultProps {
  component: React.ElementType;
  direction: csstype.FlexDirectionProperty;
}

const defaultProps: ListDefaultProps = { component: 'ul', direction: 'column' };

export const List: BaseComponent<ListTypeMap> & {
  displayName: string;
} = (_props: ListProps) => {
  const {
    component: Component,
    className,
    direction,
    ...rest
  } = {
    ...defaultProps,
    ..._props,
  };

  const classOfComponent = cn(styles.list, className, styles[`direction-${direction}`]);

  return <Component {...rest} className={classOfComponent} />;
};

List.displayName = 'List';
export default List;
