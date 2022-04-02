import cn from 'classnames';
import csstype from 'csstype';
import React from 'react';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import List from '../List';
import styles from './styles.module.scss';

interface MenuListTypeMap<P = {}, D extends React.ElementType = 'ul'> {
  props: P & {
    direction?: csstype.FlexDirectionProperty;
    disabled?: boolean;
  };
  defaultComponent: D;
}

export type MenuListProps<D extends React.ElementType = MenuListTypeMap['defaultComponent'], P = {}> = 
OverrideProps<
  MenuListTypeMap<P, D>,
  D
>;

interface MenuListDefaultProps {
  component: React.ElementType;
  direction: csstype.FlexDirectionProperty;
}

const defaultProps: MenuListDefaultProps = {
  component: 'ul',
  direction: 'column',
};

export type MenuListComponent = BaseComponent<MenuListTypeMap> & {
  displayName?: string;
};

export const MenuList: MenuListComponent = React.forwardRef((props: MenuListProps, ref: any) => {
  const { className, children, ...rest } = {
    ...defaultProps,
    ...props,
  };

  const classOfComponent = cn(styles.menuList, className);

  return (
    <List role="menu" ref={ref} className={classOfComponent} {...rest}>
      {children}
    </List>
  );
});

MenuList.displayName = 'MenuList';

export default MenuList;
