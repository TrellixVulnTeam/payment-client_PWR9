import cx from 'classnames';
import useClickOutside from 'hooks/useClickOutside';
import useKeydown from 'hooks/useKeydown';
import noop from 'lodash-es/noop';
import React, { ElementType, forwardRef, MutableRefObject, useMemo } from 'react';
import Backdrop, { BackdropVariant } from '../Backdrop';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import Paper, { PaperRadius } from '../Paper';
import Popper, { PopperPlacements } from '../Popper';
import styles from './styles.module.scss';

export * from './types';

interface PopoverTypeMap<P = {}, D extends ElementType = 'div'> {
  props: P & {
    anchorRef?: MutableRefObject<any>;
    anchorEl?: HTMLElement;
    placement?: PopperPlacements;
    menuClassName?: string;
    backdrop?: BackdropVariant;
    onClose?: () => void;
  };
  defaultComponent: D;
}

type PopoverProps<D extends ElementType = PopoverTypeMap['defaultComponent'], P = {}> = OverrideProps<
  PopoverTypeMap<P, D>,
  D
>;

interface PopoverDefaultProps {
  component: ElementType;
  placement: PopperPlacements;
  backdrop: BackdropVariant;
}

const defaultProps: PopoverDefaultProps = {
  component: 'div',
  placement: PopperPlacements.bottom,
  backdrop: BackdropVariant.transparent,
};

const defaultPopperOptions = {
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 8],
      },
    },
  ],
};

export type PopoverComponent = BaseComponent<PopoverTypeMap> & {
  displayName?: string;
};

export const Popover: PopoverComponent = forwardRef((_props: PopoverProps, ref) => {
  const {
    component: Component,
    children,
    placement,
    className,
    anchorEl,
    anchorRef,
    style,
    menuClassName,
    backdrop,
    onClose,
    ...rest
  } = {
    ...defaultProps,
    ..._props,
  };

  const [onParentClick, onChildClick] = useClickOutside(onClose);

  useKeydown(27, onClose || noop);

  const popperOptions = useMemo(
    () => ({
      ...defaultPopperOptions,
      placement,
    }),
    [placement],
  );

  const anchor = anchorEl || anchorRef?.current;
  if (anchor) {
    return (
      <Backdrop onClick={onParentClick} variant={backdrop}>
        <Popper
          component={Component}
          className={cx(styles.popover, className)}
          popperOptions={popperOptions}
          ref={ref}
          anchorEl={anchor}
          {...rest}
        >
          <Paper elevation={2} radius={PaperRadius.bold} className={menuClassName} style={style} onClick={onChildClick}>
            {children}
          </Paper>
        </Popper>
      </Backdrop>
    );
  }
  return null;
});

Popover.displayName = 'Popover';
export default Popover;
