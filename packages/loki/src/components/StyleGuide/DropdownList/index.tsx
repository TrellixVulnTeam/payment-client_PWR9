import { AngleDown, AngleUp } from 'assets/icons/ILT';
import cn from 'classnames';
import React, { forwardRef, MutableRefObject, useCallback, useMemo, useRef, useState } from 'react';
import { isFunction } from 'utils/common';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import Icon from 'components/StyleGuide/Icon';
import Input, { InputComponent } from 'components/StyleGuide/Input';
import InputAdornment from 'components/StyleGuide/InputAdornment';
import DropdownListContext from './select-context';
import Menu from 'components/StyleGuide/Menu';
import DropdownListInput from './SelectInput';

import { SelectVariants } from 'components/StyleGuide/SelectInput/types';
import styles from './styles.module.scss';
import Loading from 'assets/icons/ILT/lib/Loading';

interface DropdownListTypeMap<P = {}, D extends React.ElementType = InputComponent> {
  props: P & {
    /**
     * Custom style for dropdown list.
     */
    menuClassName?: string;
    /**
     * The dropdown list placeholder, work with value of ddl is `undefined` or `null`.
     */
    placeholder?: string;
    /**
     * Variant of button
     * Enum: `selected`.
     */
    variant?: SelectVariants;
    /*
     * status loading
     */
    loading?: boolean;

    display?: (value) => void;

    onSearch?: (data: any) => void;
  };
  defaultComponent: D;
}

export type DropdownListProps<
  D extends React.ElementType = DropdownListTypeMap['defaultComponent'],
  P = {},
> = OverrideProps<DropdownListTypeMap<P, D>, D>;

interface DropdownListDefaultProps {
  component: React.ElementType;
}

const defaultProps: DropdownListDefaultProps = {
  component: Input,
};

export type DropdownListComponent = BaseComponent<DropdownListTypeMap> & {
  displayName?: string;
};

function calculatePopoverStyle(ref: HTMLElement) {
  if (!ref) {
    return {};
  }
  const width = Math.max(ref.getBoundingClientRect().width, 180);
  return {
    minWidth: `${width}px`,
    maxWidth: `350px`,
  };
}

function checkIsSelected(value: any) {
  return value !== undefined && value !== null && value !== '';
}

export const DropdownList: DropdownListComponent = forwardRef(
  (props: DropdownListProps, ref: MutableRefObject<any>) => {
    const {
      component: Component,
      children,
      onChange,
      onClick,
      onBlur,
      onFocus,
      onSearch,
      menuClassName,
      className,
      placeholder,
      variant,
      loading,
      display: displayProps,
      ...rest
    } = {
      ...defaultProps,
      ...props,
    };

    const wrapperRef = useRef<HTMLElement>();
    const popoverStyle = useRef(null);

    const isSelected = checkIsSelected(rest.value);

    const [open, setOpen] = useState(false);

    const handleOpen = useCallback(
      (e) => {
        if (loading) return;

        if (!open && !rest.disabled) {
          popoverStyle.current = calculatePopoverStyle(wrapperRef.current);
          setOpen(true);
        }
        if (onFocus) {
          onFocus(e);
        }
        if (onClick) {
          return onClick(e);
        }
      },
      [rest.disabled, onClick, onFocus, open, loading],
    );

    const handleClose = useCallback(
      (e) => {
        setOpen(false);
        if (onBlur) {
          return onBlur(e);
        }
      },
      [onBlur],
    );

    const dropdownListContext = useMemo(
      () => ({
        onChange: (value) => {
          if (!onChange || !isFunction(onChange)) {
            console.warn(`onChange isn't implement yet`);
            return;
          }
          return onChange(value);
        },
        value: rest.value,
      }),
      [onChange, rest.value],
    );

    const afterInput = useMemo(
      () => (
        <InputAdornment size={rest.size} onClick={handleOpen} className={styles[`addon-size-${rest.size}`]}>
          {loading ? (
            <Icon className={styles.icon} component={Loading} />
          ) : (
            <Icon className={styles.icon} component={open ? AngleUp : AngleDown} />
          )}
        </InputAdornment>
      ),
      [loading, open, handleOpen, rest.size],
    );

    const display = !isSelected
      ? placeholder
      : React.Children.toArray(children)
          .filter((child: any) => child?.props?.value === rest.value)
          .map((child: any) => {
            if (displayProps && isFunction(displayProps)) {
              return displayProps(child);
            }
            if (typeof child === 'string') {
              return child;
            }
            const innerChild = child.props.children;
            if (typeof innerChild === 'string') {
              return innerChild;
            }
            return '';
          });

    const classOfComponent = cn(className, styles.input, {
      [styles['is-selected']]: variant === SelectVariants.selected && isSelected,
      // [styles['is-open']]: open,
    });

    return (
      <>
        <Input
          {...rest}
          className={classOfComponent}
          onClick={handleOpen}
          component={DropdownListInput}
          afterInput={afterInput}
          display={display}
          selected={isSelected}
          ref={ref}
          readOnly
          // @ts-ignore
          wrapperRef={wrapperRef}
        />
        {open && (
          <Menu anchorRef={wrapperRef} onClose={handleClose} menuClassName={menuClassName} style={popoverStyle.current}>
            <DropdownListContext.Provider value={dropdownListContext}>
              <div className={styles['wrapper-list']}>{children}</div>
            </DropdownListContext.Provider>
          </Menu>
        )}
      </>
    );
  },
);

DropdownList.displayName = 'DropdownList';
export default DropdownList;
