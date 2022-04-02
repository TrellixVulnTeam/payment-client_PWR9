/* eslint-disable react/jsx-props-no-spreading */
import React, { memo, useRef, useLayoutEffect } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import usePrevious from 'hooks/usePrevious';

export interface SingleOTPInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  focus?: boolean;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    otpInput: {
      width: '56px',
      height: '56px',
      margin: '16px 16px 16px 0px',
      fontSize: '24px',
      textAlign: 'center',
      borderRadius: '8px',
      border: `2px solid #E0E0E0`,
      fontFamily: 'Kanit',
      fontWeight: 600,
      '&:focus-visible': {
        outline: 'none',
        border: '2px solid #0934E0',
        textDecoration: 'underline',
        textDecorationColor: '#0934E0',
      },
    },
  }),
);

export function SingleOTPInputComponent(props: SingleOTPInputProps) {
  const classes = useStyles();

  const { focus, autoFocus, ...rest } = props;
  const inputRef = useRef<HTMLInputElement>(null);
  const prevFocus = usePrevious(!!focus);

  useLayoutEffect(() => {
    if (inputRef.current) {
      if (focus && autoFocus) {
        inputRef.current.focus();
      }
      if (focus && autoFocus && focus !== prevFocus) {
        inputRef.current.focus();
        inputRef.current.select();
      }
    }
  }, [autoFocus, focus, prevFocus]);

  return <input ref={inputRef} {...rest} className={classes.otpInput} />;
}

const Input = memo(SingleOTPInputComponent);

export default Input;
