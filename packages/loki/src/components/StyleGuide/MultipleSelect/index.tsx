import { t } from 'i18next';
import { Box, Grid } from '@material-ui/core';
import { AngleDown, AngleUp } from 'assets/icons/ILT';
import cn from 'classnames';
import React, { forwardRef, MutableRefObject, useCallback, useMemo, useRef, useState } from 'react';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import { CheckboxProps } from '../Checkbox';
import Icon from '../Icon';
import Input, { InputComponent, InputSizes } from '../Input';
import InputAdornment from '../InputAdornment';
import Menu from '../Menu';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from '../Typography';
import MultipleSelectContext from './Context';
import SelectInput from 'components/StyleGuide/SelectInput';
import styles from './styles.module.scss';
import { SelectVariants } from '../SelectInput/types';
import { IOption } from '../GroupDropdown';
import MultipleSelectOption from '../MultipleSelectOption';

interface MultipleSelectTypeMap<P = {}, D extends React.ElementType = InputComponent> {
  props: P & {
    /**
     * Option select
     */
    options: IOption[];
    /**
     * Custom style for dropdown list.
     */
    menuClassName?: string;
    /**
     * The select placeholder, work with value of select is `undefined` or `null`.
     */
    placeholder?: string;
    size?: InputSizes;
    /**
     * Selected value of radio group
     */
    selected: string[];
    /**
     * Callback fired on change, pass to `CheckboxGroup` components
     */
    onChange: CheckboxProps['onChange'];
    /**
     * Pass `disabled` props to `CheckboxGroup` components
     */
    disabled?: CheckboxProps['disabled'];
    /**
     * Callback fired on clear
     */
    onClear?: React.EventHandler<React.SyntheticEvent>;
    /**
     * Note
     */
    note?: React.ReactNode;
    /**
     * variant style
     */
    variant?: SelectVariants;
  };
  defaultComponent: D;
}

export type SelectProps<
  D extends React.ElementType = MultipleSelectTypeMap['defaultComponent'],
  P = {},
> = OverrideProps<MultipleSelectTypeMap<P, D>, D>;

interface MultipleSelectDefaultProps {
  component: React.ElementType;
  size: InputSizes;
}

const defaultProps: MultipleSelectDefaultProps = {
  component: Input,
  size: InputSizes.md,
};

export type MultipleSelectComponent = BaseComponent<MultipleSelectTypeMap> & {
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

export const MultipleSelect: MultipleSelectComponent = forwardRef((props: SelectProps, ref: MutableRefObject<any>) => {
  const {
    component: Component,
    children,
    menuClassName,
    className,
    placeholder,
    disabled,
    selected,
    variant,
    note,
    options,
    onChange,
    onClick,
    onBlur,
    onFocus,
    onClear,
    ...rest
  } = {
    ...defaultProps,
    ...props,
  };

  const wrapperRef = useRef<HTMLElement>();
  const popoverStyle = useRef(null);

  const [open, setOpen] = useState(false);
  const handleOpen = useCallback(
    (e) => {
      if (!open && !disabled) {
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
    [disabled, onClick, onFocus, open],
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

  const afterInput = useMemo(
    () => (
      <InputAdornment size={rest.size} onClick={handleOpen} className={styles[`addon-size-${rest.size}`]}>
        <Icon className={styles.icon} component={open ? AngleUp : AngleDown} />
      </InputAdornment>
    ),
    [open, handleOpen, rest.size],
  );

  const contextValue = {
    disabled,
    selected,
    onChange,
  };

  const classOfComponent = cn(className, styles.input, {
    [styles['is-open']]: open,
    [styles['is-selected']]: variant === SelectVariants.selected && selected.length,
  });

  const displayReset = selected.length > 0 && onClear;

  return (
    <>
      <Input
        {...rest}
        component={SelectInput}
        className={classOfComponent}
        onClick={handleOpen}
        afterInput={afterInput}
        selected={selected}
        placeholder={placeholder}
        options={options}
        ref={ref}
        readOnly
        // @ts-ignore
        wrapperRef={wrapperRef}
      />
      {open && (
        <Menu anchorRef={wrapperRef} onClose={handleClose} menuClassName={menuClassName} style={popoverStyle.current}>
          <Grid container direction="column">
            {note && (
              <Grid item>
                <Box pl={1.5} pt={1.5}>
                  <Typography type={TypoTypes.titleSub}>{note}</Typography>
                </Box>
              </Grid>
            )}
            {displayReset && (
              <Grid item>
                <Box pl={1.5} pt={1.5} pb={0.5}>
                  <Typography
                    variant={TypoVariants.button1}
                    type={TypoTypes.link}
                    weight={TypoWeights.medium}
                    onClick={onClear}
                  >
                    {t('Reset')}
                  </Typography>
                </Box>
              </Grid>
            )}
            <Grid item>
              <MultipleSelectContext.Provider value={contextValue}>
                {children
                  ? children
                  : options.map((item) => (
                      <MultipleSelectOption key={item.value} value={item.value}>
                        {item.name}
                      </MultipleSelectOption>
                    ))}
              </MultipleSelectContext.Provider>
            </Grid>
          </Grid>
        </Menu>
      )}
    </>
  );
});

MultipleSelect.displayName = 'MultipleSelect';
export default MultipleSelect;
