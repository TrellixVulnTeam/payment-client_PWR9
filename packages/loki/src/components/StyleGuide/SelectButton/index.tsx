import { t } from 'i18next';
import { Box, Grid } from '@material-ui/core';
import _upperFirst from 'lodash-es/upperFirst';
import React, { forwardRef, MutableRefObject, useMemo } from 'react';
import { isFunction } from 'utils/common';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import Button, { ButtonSizes, ButtonVariants } from '../Button';
import Paper, { PaperRadius } from '../Paper';
import SelectButtonContext from './SelectButtonContext';
import Typography, { TypoTypes, TypoVariants } from '../Typography';
import styles from './styles.module.scss';

interface SelectButtonTypeMap<P = {}, D extends React.ElementType = 'div'> {
  props: P & {
    data: string[];
    value?: string;
  };
  defaultComponent: D;
}

export type DropdownListProps<
  D extends React.ElementType = SelectButtonTypeMap['defaultComponent'],
  P = {},
> = OverrideProps<SelectButtonTypeMap<P, D>, D>;

interface DropdownListDefaultProps {
  component: React.ElementType;
  data: string[];
}

const defaultProps: DropdownListDefaultProps = {
  component: Paper,
  data: [],
};

export type SelectButtonComponent = BaseComponent<SelectButtonTypeMap> & {
  displayName?: string;
};

export const SelectButton: SelectButtonComponent = forwardRef(
  (props: DropdownListProps, ref: MutableRefObject<any>) => {
    const {
      component: Component,
      children,
      onChange,
      onClick,
      className,
      data,
      ...rest
    } = {
      ...defaultProps,
      ...props,
    };

    const contextValue = useMemo(
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

    return (
      <Component radius={PaperRadius.bold} {...rest}>
        <Box p={0.5}>
          <SelectButtonContext.Provider value={contextValue}>
            <Grid container spacing={1}>
              {data.map((item, index) => (
                <Grid item xs="auto">
                  <Button
                    className={styles['btn']}
                    onClick={() => contextValue.onChange(item)}
                    size={ButtonSizes.sm}
                    fullWidth={false}
                    key={index}
                    variant={rest.value === item ? ButtonVariants.select : ButtonVariants.invert}
                  >
                    <Typography
                      variant={TypoVariants.button2}
                      type={rest.value === item ? TypoTypes.invert : TypoTypes.titleDefault}
                    >
                      {t(_upperFirst(item))}
                    </Typography>
                  </Button>
                </Grid>
              ))}
            </Grid>
          </SelectButtonContext.Provider>
        </Box>
      </Component>
    );
  },
);

export default SelectButton;
