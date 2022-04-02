import React from 'react';
import cn from 'classnames';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import Typography, { TypoTypes, TypoWeights } from '../Typography';
import styles from './styles.module.scss';

interface ListItemTextTypeMap<P = {}, D extends React.ElementType = 'span'> {
  props: P & {
    /**
     * If `true`, the children will be indented. This should be used if there is no left avatar or left icon.
     */
    inset?: boolean;
    weight?: TypoWeights;
    size?: string;
  };
  defaultComponent: D;
}

type ListItemTextProps<D extends React.ElementType = ListItemTextTypeMap['defaultComponent'], P = {}> = OverrideProps<
  ListItemTextTypeMap<P, D>,
  D
>;

interface ListItemTextDefaultProps {
  component: React.ElementType;
  weight: TypoWeights;
  type: TypoTypes;
  inset: boolean;
}

const defaultProps: ListItemTextDefaultProps = {
  component: 'span',
  weight: TypoWeights.light,
  type: TypoTypes.inherit,
  inset: false,
};

export const ListItemText: BaseComponent<ListItemTextTypeMap> & {
  displayName?: string;
} = (props: ListItemTextProps) => {
  const { className, inset, ...rest } = {
    ...defaultProps,
    ...props,
  };

  const classOfComponent = cn(
    styles.listItemText,
    [styles[`text-size-${rest.size}`]],
    inset && styles.inset,
    className,
  );

  return <Typography {...rest} className={classOfComponent} />;
};

ListItemText.displayName = 'ListItemText';
export default ListItemText;
