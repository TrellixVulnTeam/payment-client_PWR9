import cn from 'classnames';
import React, { MutableRefObject, useMemo } from 'react';
import { BackdropVariant } from '../Backdrop';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import MenuList from '../MenuList';
import Popover, { PopoverComponent } from '../Popover';
import { PopperPlacements } from '../Popper';
import MenuContext from './menu-context';
import styles from './styles.scss';

interface MenuTypeMap<P = {}, D extends React.ElementType = PopoverComponent> {
  props: P & {
    onClose: (e) => void;
  };
  anchorRef: MutableRefObject<any>;
  defaultComponent: D;
}

export type MenuProps<D extends React.ElementType = MenuTypeMap['defaultComponent'], P = {}> = OverrideProps<
  MenuTypeMap<P, D>,
  D
>;

interface MenuDefaultProps {
  component: React.ElementType;
  placement: PopperPlacements;
}

const defaultProps: MenuDefaultProps = {
  component: Popover,
  placement: PopperPlacements.bottom,
};

export const Menu: BaseComponent<MenuTypeMap> & {
  displayName: string;
} = (props: MenuProps) => {
  const {
    component: Component,
    className,
    children,
    onClose,
    ...rest
  } = {
    ...defaultProps,
    ...props,
  };

  const classOfComponent = cn(styles.menu, className);
  const menuContext = useMemo(() => ({ close: onClose }), [onClose]);

  return (
    <Component {...rest} backdrop={BackdropVariant.transparent} className={classOfComponent} onClose={onClose}>
      <MenuContext.Provider value={menuContext}>
        <MenuList>{children}</MenuList>
      </MenuContext.Provider>
    </Component>
  );
};

Menu.displayName = 'Menu';
export default Menu;
