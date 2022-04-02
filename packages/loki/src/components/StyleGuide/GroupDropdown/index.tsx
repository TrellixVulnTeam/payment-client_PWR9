import { Box, Grid } from '@material-ui/core';
import { AngleDown, AngleUp } from 'assets/icons/ILT';
import cn from 'classnames';
import _get from 'lodash-es/get';
import _isEmpty from 'lodash-es/isEmpty';
import React, { forwardRef, MutableRefObject, useCallback, useMemo, useRef, useState } from 'react';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import { CheckboxProps } from '../Checkbox';
import GroupDropdownOption from '../GroupDropdownOption';
import Icon from '../Icon';
import Input, { InputComponent, InputSizes } from '../Input';
import InputAdornment from '../InputAdornment';
import Menu from '../Menu';
import Typography, { TypoTypes, TypoWeights, TypoVariants } from '../Typography';
import GroupDropdownContext from './Context';
import SelectInput from 'components/StyleGuide/SelectInput';
import styles from './styles.module.scss';
import { SelectVariants } from 'components/StyleGuide/SelectInput/types';

export interface ISelected {
  readonly value: string;
  readonly groupIndex: number;
  readonly groupValue?: string;
}

export interface IOption {
  readonly name: string;
  readonly value: string;
  readonly groupValue?: string;
  readonly options?: readonly IOption[];
}

export interface GroupBase<Option> {
  readonly options: readonly Option[];
  readonly name: string;
  readonly groupValue?: string;
}

export type OptionsOrGroups<Option, Group extends GroupBase<Option>> = readonly (Option | Group)[];

interface GroupDropdownTypeMap<P = {}, D extends React.ElementType = InputComponent> {
  props: P & {
    /**
     * Data source.
     */
    options?: OptionsOrGroups<IOption, GroupBase<IOption>>;
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
    selected: ISelected[];
    /**
     * Callback fired on change, pass to `CheckboxGroup` components
     */
    onChange: React.EventHandler<React.SyntheticEvent>;
    /**
     * Pass `disabled` props to `CheckboxGroup` components
     */
    disabled?: CheckboxProps['disabled'];
    /**
     * Callback fired on clear
     */
    onClear?: React.EventHandler<React.SyntheticEvent>;
    /**
     * Variant style
     */
    variant?: SelectVariants;
  };
  defaultComponent: D;
}

export type SelectProps<D extends React.ElementType = GroupDropdownTypeMap['defaultComponent'], P = {}> = OverrideProps<
  GroupDropdownTypeMap<P, D>,
  D
>;

interface GroupDropdownDefaultProps {
  component: React.ElementType;
  size: InputSizes;
}

const defaultProps: GroupDropdownDefaultProps = {
  component: Input,
  size: InputSizes.md,
};

export type GroupDropdownComponent = BaseComponent<GroupDropdownTypeMap> & {
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

export const GroupDropdown: GroupDropdownComponent = forwardRef((props: SelectProps, ref: MutableRefObject<any>) => {
  const {
    component: Component,
    children,
    onChange,
    onClick,
    onBlur,
    onFocus,
    menuClassName,
    className,
    placeholder,
    disabled,
    selected,
    onClear,
    options,
    variant,
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

  function renderOptions() {
    let xhtml = null;
    if (!_isEmpty(options)) {
      xhtml = options.map((x: IOption, groupIndex) => {
        let children = null;
        const itemsOfGroup = selected.filter((x: ISelected) => x.groupIndex === groupIndex);
        // render children
        const childOptions = _get(x, 'options');
        const isIntermediate = itemsOfGroup.length > 0 && itemsOfGroup.length < childOptions.length;
        if (!_isEmpty(childOptions)) {
          children = childOptions.map((item: IOption, index) => {
            const checked = selected.find((x: ISelected) => x.value === item.value && groupIndex === x.groupIndex);
            return (
              <GroupDropdownOption
                data={item}
                key={index}
                inset={true}
                value={item.value}
                groupIndex={groupIndex}
                checked={!!checked}
              />
            );
          });
        }
        const isSelectAll = itemsOfGroup.length === childOptions.length;

        return (
          <>
            <GroupDropdownOption
              data={x}
              key={groupIndex}
              value={x.value}
              groupIndex={groupIndex}
              isIntermediate={isIntermediate}
              checked={isSelectAll}
            />
            {children}
          </>
        );
      });
    }
    return xhtml;
  }

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
    [styles['is-selected']]: variant === SelectVariants.selected && selected.length,
    [styles['is-open']]: open,
  });

  const displayReset = selected.length > 0 && onClear;

  return (
    <>
      <Input
        {...rest}
        className={classOfComponent}
        onClick={handleOpen}
        component={SelectInput}
        afterInput={afterInput}
        placeholder={placeholder}
        selected={selected}
        options={options}
        ref={ref}
        readOnly
        // @ts-ignore
        wrapperRef={wrapperRef}
      />
      {open && (
        <Menu anchorRef={wrapperRef} onClose={handleClose} menuClassName={menuClassName} style={popoverStyle.current}>
          <Grid container direction="column" spacing={1}>
            {displayReset && (
              <Grid item>
                <Box pl={1.5} pt={1.5}>
                  <Typography
                    variant={TypoVariants.button1}
                    type={TypoTypes.link}
                    weight={TypoWeights.medium}
                    onClick={onClear}
                  >
                    Reset
                  </Typography>
                </Box>
              </Grid>
            )}
            <Grid item>
              <GroupDropdownContext.Provider value={contextValue}>{renderOptions()}</GroupDropdownContext.Provider>
            </Grid>
          </Grid>
        </Menu>
      )}
    </>
  );
});

GroupDropdown.displayName = 'GroupDropdown';
export default GroupDropdown;
