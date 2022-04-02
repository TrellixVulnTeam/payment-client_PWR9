import React, { Fragment } from 'react';
import cn from 'classnames';
import { InputComponent, InputStatuses } from '../Input';
import { BaseComponent, OverrideProps } from '../BaseComponent';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from '../Typography';
import styles from './styles.module.scss';

interface SelectInputTypeMap<P = {}, D extends React.ElementType = InputComponent> {
  props: P & {
    display: React.ReactNode;
    selected: boolean;
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

const SelectInput: SelectInputComponent = React.forwardRef((_props: SelectInputProps, ref: any): any => {
  const {
    component: Component,
    className,
    onClick,
    display,
    placeholder,
    selected,
    status,
    ...rest
  } = {
    ...defaultProps,
    ..._props,
  };

  return (
    <Fragment>
      <div
        className={cn(styles.select, styles[`select-size-${rest.size}`], className, {
          [styles.disabled]: rest.disabled,
          [styles.placeholder]: selected,
        })}
        ref={ref}
        onClick={onClick}
      >
        {selected ? (
          <Typography
            truncate={1}
            variant={TypoVariants.body1}
            type={TypoTypes.sub}
            className={cn(styles['label-text'], styles[`label-size-${rest.size}`])}
          >
            {display}
          </Typography>
        ) : (
          <Typography
            truncate={1}
            variant={TypoVariants.body1}
            type={status === InputStatuses.error ? TypoTypes.error : rest.disabled ? TypoTypes.sub : TypoTypes.disable}
            weight={TypoWeights.light}
            className={styles[`label-size-${rest.size}`]}
          >
            {display}
          </Typography>
        )}
        {/* <CircularProgress /> */}
      </div>
      <Component {...rest} type="hidden" />
    </Fragment>
  );
});

SelectInput.displayName = 'SelectInput';

export default SelectInput;
