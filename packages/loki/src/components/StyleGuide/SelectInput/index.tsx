import React, { Fragment } from 'react';
import cn from 'classnames';
import { Box } from '@material-ui/core';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { InputComponent } from 'components/StyleGuide/Input';
import { IOption } from 'components/StyleGuide/GroupDropdown';
import { SelectVariants } from 'components/StyleGuide/SelectInput/types';
import { BaseComponent, OverrideProps } from 'components/StyleGuide/BaseComponent';
import styles from './styles.module.scss';

interface SelectInputTypeMap<P = {}, D extends React.ElementType = InputComponent> {
  props: P & {
    display: React.ReactNode;
    selected: string[];
    options: IOption[];
    variant: SelectVariants;
  };
  defaultComponent: D;
}

export type SelectInputProps<
  D extends React.ElementType = SelectInputTypeMap['defaultComponent'],
  P = {},
> = OverrideProps<SelectInputTypeMap<P, D>, D>;

interface SelectDefaultProps {
  component: React.ElementType;
}
const defaultProps: SelectDefaultProps = {
  component: 'input',
};

export type SelectInputComponent = BaseComponent<SelectInputTypeMap> & {
  displayName?: string;
};

function checkIsUsePlaceholder(value: string[]) {
  return value === undefined || value === null || value.length === 0;
}

function getDisplay(selected: (string | IOption)[], options: IOption[]) {
  if (selected.length > 1) {
    return `${selected.length} selected`;
  }

  if (selected.length === 0) {
    return '';
  }

  if (options === undefined) {
    return `${selected.length} selected`;
  }

  const firstItem = selected[0];

  let result;

  if (typeof firstItem === 'string') {
    result = options.find((item) => item.value === firstItem);
  } else {
    const group = options.find((op) => op.groupValue === firstItem.groupValue);
    result = group.options.find((op) => op.value === firstItem.value);
  }
  return (result || {}).name || '-';
}

const SelectInput: SelectInputComponent = React.forwardRef((_props: SelectInputProps, ref: any): any => {
  const {
    component: Component,
    className,
    onClick,
    placeholder,
    selected,
    variant,
    options,
    ...rest
  } = {
    ...defaultProps,
    ..._props,
  };

  const isDisplayPlaceholder = checkIsUsePlaceholder(selected);
  const display = getDisplay(selected, options);
  return (
    <Fragment>
      <div
        className={cn(styles.select, styles[`select-size-${rest.size}`], className, {
          [styles.disabled]: rest.disabled,
          [styles.placeholder]: isDisplayPlaceholder,
        })}
        ref={ref}
        onClick={onClick}
      >
        {isDisplayPlaceholder ? (
          <Typography
            truncate={1}
            variant={TypoVariants.body1}
            weight={TypoWeights.bold}
            type={TypoTypes.sub}
            className={cn(styles['label-text'], styles[`label-size-${rest.size}`])}
          >
            {placeholder}
          </Typography>
        ) : (
          <Box display="flex">
            <Typography
              truncate={1}
              variant={TypoVariants.body1}
              weight={TypoWeights.bold}
              type={TypoTypes.primary}
              className={cn(styles['label-text'], styles[`label-size-${rest.size}`])}
            >
              {placeholder}:{' '}
              <Typography
                component="span"
                variant={TypoVariants.body1}
                type={TypoTypes.primary}
                className={cn(styles['label-text'], styles[`label-size-${rest.size}`])}
              >
                {display}
              </Typography>
            </Typography>
          </Box>
        )}
      </div>
      <Component {...rest} type="hidden" />
    </Fragment>
  );
});

SelectInput.displayName = 'SelectInput';

export default SelectInput;
