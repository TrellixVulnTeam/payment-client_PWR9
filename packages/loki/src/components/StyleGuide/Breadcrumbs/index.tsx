import cn from 'classnames';
import React, { Children, HTMLAttributes, useMemo } from 'react';
import styles from './styles.module.scss';

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement> {
  component?: React.ElementType;
  separator?: string | React.ReactNode;
}

interface BreadcrumbsDefaultProps {
  component: React.ElementType;
  separator: string;
}

const defaultProps: BreadcrumbsDefaultProps = {
  component: 'nav',
  separator: '/',
};

export const Breadcrumbs = (props: BreadcrumbsProps) => {
  const {
    component: Component,
    className,
    children,
    separator,
    ...rest
  } = {
    ...defaultProps,
    ...props,
  };

  const classOfRoot = cn(styles.root, className);
  const contentOfSeparator = <li className={styles.separator}>{separator}</li>;
  const countOfItems = Children.count(children);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const transformItems = (child: React.ReactNode, idx: number) => (
    <>
      <li className={styles.item}>{child}</li>
      {idx + 1 < countOfItems && contentOfSeparator}
    </>
  );

  const contentOfItems = useMemo(() => Children.map(children, transformItems), [children, transformItems]);

  return (
    <Component {...rest} className={classOfRoot}>
      <ol className={styles.container}>{contentOfItems}</ol>
    </Component>
  );
};

Breadcrumbs.displayName = 'Breadcrumbs';
export default Breadcrumbs;
