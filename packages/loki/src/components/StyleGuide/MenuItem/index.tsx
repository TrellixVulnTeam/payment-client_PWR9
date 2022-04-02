import cx from 'classnames';
import React, { forwardRef, useCallback, useContext } from 'react';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import ListItem from '../ListItem';
import MenuContext from '../Menu/menu-context';
import styles from './styles.module.scss';

interface MenuItemTypeMap<P = {}, D extends React.ElementType = 'a'> {
  props: P & {
    /**
     * Set item is `disabled`
     */
    disabled?: boolean;
    /**
     * Set item is `activated`
     */
    activated?: boolean;
    size?: string;
  };
  defaultComponent: D;
}

export type MenuItemProps<D extends React.ElementType = MenuItemTypeMap['defaultComponent'], P = {}> = OverrideProps<
  MenuItemTypeMap<P, D>,
  D
>;

interface MenuItemDefaultProps {
  component: React.ElementType;
}

const defaultProps: MenuItemDefaultProps = {
  component: 'a',
};

export type MenuItemComponent = BaseComponent<MenuItemTypeMap> & {
  displayName?: string;
};

export const MenuItem: MenuItemComponent = forwardRef((props: MenuItemProps, ref) => {
  const { className, ...rest } = {
    ...defaultProps,
    ...props,
  };

  const menuContext = useContext(MenuContext);

  const classOfComponent = cx(styles.menuItem, className, {
    [styles.disabled]: !!rest.disabled,
  });

  const handleOnClick = useCallback(
    (event: React.MouseEvent<any>) => {
      if (rest.onClick) {
        rest.onClick(event);
      }
      menuContext?.close();
    },
    [rest, menuContext],
  );

  return <ListItem {...rest} ref={ref} className={classOfComponent} onClick={handleOnClick} />;
});

MenuItem.displayName = 'MenuItem';
export default MenuItem;
