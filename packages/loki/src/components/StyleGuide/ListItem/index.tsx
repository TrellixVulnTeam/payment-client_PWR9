import { AngleDown, AngleUp } from 'assets/icons/ILT';
import React, { forwardRef, useCallback } from 'react';
import cn from 'classnames';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import ListItemAction from '../ListItemAction';
import styles from './styles.module.scss';

interface ListItemClass {
  wrapper?: string;
  content?: string;
}

interface ListItemTypeMap<P = {}, D extends React.ElementType = 'li'> {
  props: P & {
    disabled?: boolean;
    children?: React.ReactNode;
    activated?: boolean;
    open?: boolean;
    classes?: ListItemClass;
    size?: string;
  };
  defaultComponent: D;
}

type GridProps<D extends React.ElementType = ListItemTypeMap['defaultComponent'], P = {}> = OverrideProps<
  ListItemTypeMap<P, D>,
  D
>;

interface ListItemDefaultProps {
  component: React.ElementType;
  disabled: boolean;
  activated: boolean;
  open: boolean;
  classes: ListItemClass;
}

const defaultProps: ListItemDefaultProps = {
  component: 'div',
  disabled: false,
  activated: false,
  open: null,
  classes: {},
};

export const ListItem: BaseComponent<ListItemTypeMap> & {
  displayName?: string;
} = forwardRef((props: GridProps, ref) => {
  const {
    component: Component,
    className,
    disabled,
    children,
    activated,
    open,
    classes,
    ...rest
  } = {
    ...defaultProps,
    ...props,
  };

  const classOfWrapper = cn(styles.item, className, {
    [styles.disabled]: !!disabled,
    [styles.activated]: !!activated,
    [classes.wrapper]: !!classes.wrapper,
  });
  const classOfContent = cn(
    styles.content,
    {
      [styles[`content-size-${rest.size}`]]: !!rest.size,
    },
    {
      [classes.content]: !!classes.content,
    },
  );

  const openIsBool = open === undefined || typeof open === 'boolean';
  const contentOfToggle = openIsBool && <ListItemAction icon={!open ? AngleDown : AngleUp} />;

  const handleOnClick = useCallback(
    (event: React.MouseEvent<any>) => {
      if (disabled) return;
      if (rest.onClick) {
        rest.onClick(event);
      }
    },
    [disabled, rest],
  );

  return (
    <li ref={ref} className={classOfWrapper}>
      <Component {...rest} className={classOfContent} onClick={handleOnClick}>
        {children}
        {contentOfToggle}
      </Component>
    </li>
  );
});

ListItem.displayName = 'ListItem';
export default ListItem;
