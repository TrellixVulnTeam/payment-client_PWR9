import cn from 'classnames';
import React, { useMemo } from 'react';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import Icon from '../Icon';
import styles from './styles.module.scss';

interface ListItemActionTypeMap<P = {}, D extends React.ElementType = 'div'> {
  props: P & {
    /**
     * Set icon for item
     */
    icon?: React.ElementType;
  };
  defaultComponent: D;
}

type ListItemActionProps<
  D extends React.ElementType = ListItemActionTypeMap['defaultComponent'],
  P = {},
> = OverrideProps<ListItemActionTypeMap<P, D>, D>;

interface ListItemActionDefaultProps {
  component: React.ElementType;
}

const defaultProps: ListItemActionDefaultProps = {
  component: 'div',
};

export const ListItemAction: BaseComponent<ListItemActionTypeMap> & {
  displayName?: string;
} = (props: ListItemActionProps) => {
  const {
    component: Component,
    className,
    children,
    icon,
    ...rest
  } = {
    ...defaultProps,
    ...props,
  };

  const classOfComponent = cn(styles.listItemAction, className);
  const contentOfChildren = useMemo(
    () => (!icon ? children : <Icon className={styles.icon} component={icon} />),
    [icon, children],
  );

  return (
    <Component {...rest} className={classOfComponent}>
      {contentOfChildren}
    </Component>
  );
};

ListItemAction.displayName = 'ListItemAction';
export default ListItemAction;
