import React, { forwardRef, MutableRefObject } from 'react';
import cn from 'classnames';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import TextareaBase, { TextareaBaseType } from '../TextareaBase';
import { TextareaSize, TextareaStatus } from './types';
import styles from './styles.module.scss';

interface TextareaTypeMap<P = {}, D extends React.ElementType = TextareaBaseType> {
  props: P & {
    status?: TextareaStatus;
    size?: TextareaSize;
    wrapperRef?: MutableRefObject<HTMLDivElement>;
  };
  defaultComponent: D;
}

export type TextareaProps<D extends React.ElementType = TextareaTypeMap['defaultComponent'], P = {}> = OverrideProps<
  TextareaTypeMap<P, D>,
  D
>;

interface TextareaDefaultProps {
  component: React.ElementType;
  size: TextareaSize;
}

const defaultProps: TextareaDefaultProps = {
  component: TextareaBase,
  size: TextareaSize.md,
};

export type TextareaComponent = BaseComponent<TextareaTypeMap> & {
  displayName?: string;
};

export const Textarea: TextareaComponent = forwardRef((_props: TextareaProps, ref: any) => {
  const {
    component: Component,
    className,
    wrapperRef,
    status,
    ...rest
  } = {
    ...defaultProps,
    ..._props,
  };

  const classOfRoot = cn(styles.root, styles[`status-${status}`], className, rest.disabled && styles.disabled);

  const classOfTextareaBase = cn(styles.textarea, styles[`size-${rest.size}`], rest.disabled && styles.disabled);

  return (
    <div className={classOfRoot} role="presentation" ref={wrapperRef}>
      <Component {...rest} ref={ref} className={classOfTextareaBase} />
      
    </div>
  );
});

Textarea.displayName = 'Textarea';
export default Textarea;
