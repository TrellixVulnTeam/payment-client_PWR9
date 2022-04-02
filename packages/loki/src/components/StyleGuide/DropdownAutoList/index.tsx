import { AngleDown, AngleUp } from 'assets/icons/ILT';
import cn from 'classnames';
import Popper from '@material-ui/core/Popper';
import React, { forwardRef, MutableRefObject, useCallback, useMemo, useRef, useState } from 'react';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import Icon from '../Icon';
import Input, { InputComponent } from '../Input';
import InputAdornment from '../InputAdornment';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { SelectVariants } from 'components/StyleGuide/SelectInput/types';
import Loading from 'assets/icons/ILT/lib/Loading';
import SelectInput from './SelectInput';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from '../Typography';
import { Box, InputBase } from '@material-ui/core';

import styles from './styles.module.scss';

type Option = { name: string; value: string | number };

interface DropdownAutoListTypeMap<P = {}, D extends React.ElementType = InputComponent> {
  props: P & {
    /**
     * Custom style for dropdown list.
     */
    menuClassName?: string;
    /**
     * The dropdown list placeholder, work with value of ddl is `undefined` or `null`.
     */
    placeholder?: string;

    placeholderSearch?: string;
    /**
     * Variant of button
     * Enum: `selected`.
     */
    variant?: SelectVariants;
    /*
     * status loading
     */

    loading?: boolean;

    options: Option[];

    display?: (value) => void;

    onSearch?: (data: any) => void;

    renderOption?: (option: Option) => React.ReactNode;

    filterOptions?: (options: Option[], state: object) => Option[];
  };
  defaultComponent: D;
}

export type DropdownAutoListProps<
  D extends React.ElementType = DropdownAutoListTypeMap['defaultComponent'],
  P = {},
> = OverrideProps<DropdownAutoListTypeMap<P, D>, D>;

interface DropdownAutoListDefaultProps {
  component: React.ElementType;
}

const defaultProps: DropdownAutoListDefaultProps = {
  component: Input,
};

export type DropdownAutoListComponent = BaseComponent<DropdownAutoListTypeMap> & {
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

export const DropdownAutoList: DropdownAutoListComponent = forwardRef(
  (props: DropdownAutoListProps, ref: MutableRefObject<any>) => {
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
      placeholderSearch,
      variant,
      loading,
      options,
      display: displayProps,
      renderOption,
      filterOptions,
      ...rest
    } = {
      ...defaultProps,
      ...props,
    };

    const wrapperRef = useRef<HTMLElement>();
    const popoverStyle = useRef(null);

    const isSelected = checkIsSelected(rest.value);

    const [anchorEl, setAnchorEl] = useState(null);
    const [open, setOpen] = useState(false);

    const handleOpen = useCallback(
      (e) => {
        if (loading || open) return;

        if (!open && !rest.disabled) {
          popoverStyle.current = calculatePopoverStyle(wrapperRef.current);
          setOpen(true);
        }
        if (onFocus) {
          onFocus(e);
        }
        if (onClick) {
          onClick(e);
        }

        setAnchorEl(wrapperRef.current);
      },
      [rest.disabled, onClick, onFocus, open, loading],
    );

    const handleClose = useCallback(
      (event, reason) => {
        if (reason === 'toggleInput') {
          return;
        }
        if (anchorEl) {
          anchorEl.focus();
        }
        if (onBlur) {
          onBlur(event);
        }
        setAnchorEl(null);
        setOpen(false);
      },
      [anchorEl, onBlur],
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
      [loading, open, rest.size, handleOpen],
    );

    const displayValue = displayProps ? displayProps(rest.value) : rest.value;
    const display = isSelected ? displayValue : placeholder;

    const classOfComponent = cn(className, styles.input, {
      [styles['is-selected']]: variant === SelectVariants.selected && isSelected,
      // [styles['is-open']]: open,
    });

    const optionsMemo = useMemo(
      () =>
        [...options].sort((a, b) => {
          if (a.name < b.name) return -1;
          if (a.name > b.name) return 1;
          return 0;
        }),
      [options],
    );

    return (
      <>
        <Input
          {...rest}
          className={classOfComponent}
          onClick={handleOpen}
          component={SelectInput}
          afterInput={afterInput}
          display={display}
          selected={isSelected}
          ref={ref}
          readOnly
          // @ts-ignore
          wrapperRef={wrapperRef}
        />
        <Popper
          modifiers={{
            offset: {
              enabled: true,
              offset: '0, 8',
            },
          }}
          style={popoverStyle.current}
          id="dropdown-auto-complete"
          open={open}
          anchorEl={anchorEl}
          placement="bottom-start"
          className={styles.popper}
        >
          <Autocomplete
            open
            onClose={handleClose}
            classes={{
              paper: styles.paper,
              option: styles.option,
              popperDisablePortal: styles.popperDisablePortal,
            }}
            onChange={(event, newValue) => {
              onChange((newValue as any).value);
            }}
            filterOptions={filterOptions}
            disablePortal
            renderTags={() => null}
            noOptionsText={
              <Box p={1} display="flex" justifyContent="center">
                <Typography variant={TypoVariants.body1} type={TypoTypes.sub} weight={TypoWeights.light}>
                  {props.loading ? 'Loading...' : 'No data'}
                </Typography>
              </Box>
            }
            renderOption={(option) =>
              renderOption ? (
                renderOption(option)
              ) : (
                <Typography variant={TypoVariants.body1} type={TypoTypes.sub} weight={TypoWeights.light}>
                  {option.name}
                </Typography>
              )
            }
            options={optionsMemo}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <InputBase
                autoFocus
                placeholder={placeholderSearch}
                ref={params.InputProps.ref}
                inputProps={params.inputProps}
                className={styles.inputBase}
              />
            )}
          />
        </Popper>
      </>
    );
  },
);

DropdownAutoList.displayName = 'DropdownAutoList';
export default DropdownAutoList;
