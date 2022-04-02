import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import React, { FC, useRef, useEffect } from 'react';

interface CountDownProps {
  expiryTime: number;
  setExpireTime: (time: number | Function) => void;
  countDownFinish: boolean;
  onCountdownFinish?: () => void;
}

const ONE_SECOND = 1000;

const parseHumanTime = (time: number) => {
  let minus = Math.floor(time / 60) < 10 ? `0${Math.floor(time / 60)}` : `${Math.floor(time / 60)}`;
  let seconds = time % 60 < 10 ? `0${time % 60}` : `${time % 60}`;

  return `${minus}:${seconds}`;
};

const CountDown: FC<CountDownProps> = ({ expiryTime, setExpireTime, countDownFinish, onCountdownFinish }) => {
  const timeIntervalRef = useRef<number>();

  useEffect(() => {
    if (countDownFinish) return;
    timeIntervalRef.current = window.setInterval(() => setExpireTime((t: number) => t - 1), ONE_SECOND);
    return () => clearInterval(timeIntervalRef.current);
  }, [countDownFinish, setExpireTime]);

  useEffect(() => {
    if (expiryTime <= 0) {
      if (typeof onCountdownFinish === 'function') {
        onCountdownFinish();
      }
      clearInterval(timeIntervalRef.current);
    }
  }, [expiryTime, onCountdownFinish]);

  return (
    <Typography
      variant={TypoVariants.body1}
      weight={TypoWeights.bold}
      type={expiryTime <= 0 ? TypoTypes.error : TypoTypes.primary}
    >
      {parseHumanTime(expiryTime)}
    </Typography>
  );
};

export default React.memo(CountDown);
