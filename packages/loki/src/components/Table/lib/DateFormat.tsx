import Typography, { TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';
import { formatDateTime } from 'utils/date';

type UTC = {
  seconds: number;
  nanos: number;
};
interface Props {
  date?: UTC;
  align?: 'left' | 'right';
}

// https://stackoverflow.com/questions/4631928/convert-utc-epoch-to-local-date
export function getDateFromUTC({ seconds }: UTC): Date {
  let d = new Date(0); // The 0 there is the key, which sets the date to the epoch
  d.setUTCSeconds(seconds);
  return d;
}

export function getDateMonthYear(d: Date) {
  const dateNum = d.getDate();
  const date = dateNum.toString().padStart(2, '0');

  const monthNum = d.getMonth();
  const month = (monthNum + 1).toString().padStart(2, '0');

  const yearNum = d.getFullYear();
  const year = yearNum.toString();

  const hoursNum = d.getHours();
  const hours = hoursNum.toString().padStart(2, '0');

  const minutesNum = d.getMinutes();
  const minutes = minutesNum.toString().padStart(2, '0');

  const secondsNum = d.getSeconds();
  const seconds = secondsNum.toString().padStart(2, '0');

  return {
    date,
    month,
    year,
    hours,
    minutes,
    seconds,
  };
}

const DateFormat = ({ date, align = 'left' }: Props) => {
  if (!date) return <></>;
  return (
    <Typography variant={TypoVariants.body2} type={TypoTypes.sub}>
      {date.seconds !== 0 ? formatDateTime(date.seconds * 1000) : '-'}
    </Typography>
  );
};

export default DateFormat;
