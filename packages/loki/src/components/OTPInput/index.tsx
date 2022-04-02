import React, { memo, useState, useCallback, useEffect, CSSProperties } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Input from './Input';
import useQuery from 'hooks/useQuery';

export interface OTPInputProps {
  length: number;
  autoFocus?: boolean;
  isNumberInput?: boolean;
  disabled?: boolean;
  otpDisplay: any;
  onChangeOtpDisplay: (otp: Array<string>) => void;
  onChangeOtpToSend: (otp: string) => void;
  style?: CSSProperties;
  inputStyle?: CSSProperties;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    otpContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginLeft: '16px',
    },
  }),
);

export function OTPInputComponent(props: OTPInputProps) {
  const {
    length,
    isNumberInput,
    autoFocus,
    disabled,
    inputStyle,
    otpDisplay,
    onChangeOtpDisplay,
    onChangeOtpToSend,
    ...rest
  } = props;

  const classes = useStyles();
  const query = useQuery();

  const otp = query.get('otp');

  const [activeInput, setActiveInput] = useState(otp && otp.length === length ? length - 1 : 0);

  useEffect(() => {
    if (otpDisplay && otpDisplay[0] === '') {
      const FIRST_INPUT = 0;
      setActiveInput(FIRST_INPUT);
    }
  }, [otpDisplay]);

  // Helper to return OTP from inputs
  const handleOtpChange = useCallback(
    (otp: string[]) => {
      const otpValue = otp.join('');
      onChangeOtpToSend(otpValue);
    },
    [onChangeOtpToSend],
  );

  // Helper to return value with the right type: 'text' or 'number'
  const getRightValue = useCallback(
    (str: string) => {
      let changedValue = str;
      if (!isNumberInput) {
        return changedValue;
      }
      return !changedValue || /\d/.test(changedValue) ? changedValue : '';
    },
    [isNumberInput],
  );

  // Change OTP value at focussing input
  const changeCodeAtFocus = useCallback(
    (str: string) => {
      const updatedOTPValues = [...otpDisplay];
      updatedOTPValues[activeInput] = str[0] || '';
      onChangeOtpDisplay(updatedOTPValues);
      handleOtpChange(updatedOTPValues);
    },
    [activeInput, handleOtpChange, otpDisplay, onChangeOtpDisplay],
  );

  // Focus `inputIndex` input
  const focusInput = useCallback(
    (inputIndex: number) => {
      const selectedIndex = Math.max(Math.min(length - 1, inputIndex), 0);
      setActiveInput(selectedIndex);
    },
    [length],
  );

  const focusPrevInput = useCallback(() => {
    focusInput(activeInput - 1);
  }, [activeInput, focusInput]);

  const focusNextInput = useCallback(() => {
    focusInput(activeInput + 1);
  }, [activeInput, focusInput]);

  // Handle onFocus input
  const handleOnFocus = useCallback(
    (index: number) => () => {
      focusInput(index);
    },
    [focusInput],
  );

  // Handle onChange value for each input
  const handleOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = getRightValue(e.currentTarget.value);
      if (!val) {
        e.preventDefault();
        return;
      }
      changeCodeAtFocus(val);
      focusNextInput();
    },
    [changeCodeAtFocus, focusNextInput, getRightValue],
  );

  // Hanlde onBlur input
  const onBlur = useCallback(() => {
    setActiveInput(-1);
  }, []);

  // Handle onKeyDown input
  const handleOnKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      switch (e.key) {
        case 'Backspace':
        case 'Delete': {
          e.preventDefault();
          if (otpDisplay[activeInput]) {
            changeCodeAtFocus('');
          } else {
            focusPrevInput();
          }
          break;
        }
        case 'ArrowLeft': {
          e.preventDefault();
          focusPrevInput();
          break;
        }
        case 'ArrowRight': {
          e.preventDefault();
          focusNextInput();
          break;
        }
        case ' ': {
          e.preventDefault();
          break;
        }
        default:
          break;
      }
    },
    [activeInput, changeCodeAtFocus, focusNextInput, focusPrevInput, otpDisplay],
  );

  const handleOnPaste = useCallback(
    (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      if (disabled) return;
      const pastedData = e.clipboardData
        .getData('text/plain')
        .trim()
        .slice(0, length - activeInput)
        .split('');
      if (pastedData) {
        let nextFocusIndex = 0;
        const updatedOTPValues = [...otpDisplay];
        updatedOTPValues.forEach((val, index) => {
          if (index >= activeInput) {
            const changedValue = getRightValue(pastedData.shift() || val);
            if (changedValue) {
              updatedOTPValues[index] = changedValue;
              nextFocusIndex = index;
            }
          }
        });
        onChangeOtpDisplay(updatedOTPValues);
        setActiveInput(Math.min(nextFocusIndex + 1, length - 1));
        handleOtpChange(updatedOTPValues);
      }
    },
    [activeInput, getRightValue, length, otpDisplay, handleOtpChange, disabled, onChangeOtpDisplay],
  );

  return (
    <div className={classes.otpContainer} {...rest}>
      {Array(length)
        .fill('')
        .map((_, index) => (
          <Input
            key={`otp-input-${index}`}
            focus={activeInput === index}
            value={otpDisplay && otpDisplay[index]}
            autoFocus={autoFocus}
            onFocus={handleOnFocus(index)}
            onChange={handleOnChange}
            onKeyDown={handleOnKeyDown}
            onBlur={onBlur}
            onPaste={handleOnPaste}
            style={inputStyle}
            disabled={disabled}
          />
        ))}
    </div>
  );
}

const OTPInput = memo(OTPInputComponent);
export default OTPInput;
