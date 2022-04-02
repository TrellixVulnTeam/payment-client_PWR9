import { StatisticFilterType } from '@mcuc/stark/howard_pb';
import { KEY_ENGLISH, KEY_I18N } from 'components/Layout/components/MenuLanguages';
import { PeriodType } from 'context/url_params_context/resolve_url_params';
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  endOfYear,
  endOfYesterday,
  startOfDay,
  startOfMonth,
  startOfWeek,
  startOfYear,
  startOfYesterday,
  subDays,
  subMonths,
  subYears,
} from 'date-fns';
import format from 'date-fns/format';
import { enUS, vi, zhCN, zhTW } from 'date-fns/locale';
import { t } from 'i18next';

const dateLocales = { en: enUS, vi: vi, cn: zhCN, tw: zhTW };

export const getUTCStartOfDate = (timestamp: number): number => {
  const date = new Date(timestamp);

  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0);
};

export const getLocalStartOfDate = (timestamp: number): number => {
  const date = new Date(timestamp);

  return date.setHours(0, 0, 0, 0);
};

export function getDateFromStartToEnd(start: Date, end: Date) {
  let date = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

  return {
    seconds: Math.floor(date.getTime() / 1000),
    nanos: 0,
  };
}

export function getRandomDate() {
  return getDateFromStartToEnd(new Date(2010, 0, 1), new Date(2021, 0, 1));
}

// GET DISTANCE
export const getLastWeek = () => {
  const dateOfLastWeek = subDays(new Date(), 7);
  return {
    start: +startOfWeek(dateOfLastWeek, { weekStartsOn: 1 }),
    end: +endOfWeek(dateOfLastWeek, { weekStartsOn: 1 }),
  };
};

export const getLastYear = () => {
  const dateOfLastYear = subYears(new Date(), 1);
  return {
    start: +startOfYear(dateOfLastYear),
    end: +endOfYear(dateOfLastYear),
  };
};

export const getThisWeek = () => {
  const date = new Date();
  return {
    start: +startOfWeek(date, { weekStartsOn: 1 }),
    end: +endOfWeek(date, { weekStartsOn: 1 }),
  };
};

export const getLastMonth = () => {
  const lastMonth = subMonths(new Date(), 1);
  return {
    start: +startOfMonth(lastMonth),
    end: +endOfMonth(lastMonth),
  };
};

export const getThisMonth = () => {
  const date = new Date();
  return {
    start: +startOfMonth(date),
    end: +endOfMonth(date),
  };
};

export const getThisYear = () => {
  const date = new Date();
  return {
    start: +startOfYear(date),
    end: +endOfYear(date),
  };
};

export const getFromThisTimeLastDay = () => {
  const dateOfLastDay = subDays(new Date(), 1);
  return {
    start: +startOfDay(dateOfLastDay),
    end: +endOfDay(new Date()),
  };
};

export const getFromThisTimeLastWeek = () => {
  const dateOfLastWeek = subDays(new Date(), 7);
  return {
    start: +startOfDay(dateOfLastWeek),
    end: +endOfDay(new Date()),
  };
};

export const getFromThisTimeLastMonth = () => {
  const dateOfLastMonth = subMonths(new Date(), 1);
  return {
    start: +startOfDay(dateOfLastMonth),
    end: +endOfDay(new Date()),
  };
};

export const getYesterday = () => {
  return {
    start: +startOfYesterday(),
    end: +endOfYesterday(),
  };
};

export const getToday = () => {
  return {
    start: +startOfDay(new Date()),
    end: +endOfDay(new Date()),
  };
};

export const getLast30Days = () => {
  const dateOfLast30Days = subDays(new Date(), 30);
  return {
    start: +startOfDay(dateOfLast30Days),
    end: +endOfDay(new Date()),
  };
};

export const getLast7Days = () => {
  const now = new Date();
  const dateOfLast7Days = subDays(now, 7);
  return {
    start: +startOfDay(dateOfLast7Days),
    end: +endOfDay(now),
  };
};

export const getRangeByPeriod = (period: PeriodType) => {
  switch (period) {
    case PeriodType.Daily:
      return getToday();
    case PeriodType.Yesterday:
      return getYesterday();
    case PeriodType.Weekly:
      return getThisWeek();
    case PeriodType.Monthly:
      return getThisMonth();
    case PeriodType.Last7Days:
      return getLast7Days();
    case PeriodType.Last30Days:
      return getLast30Days();
    case PeriodType.ThisWeek:
      return getThisWeek();
    case PeriodType.LastWeek:
      return getLastWeek();
    case PeriodType.ThisMonth:
      return getThisMonth();
    case PeriodType.LastMonth:
      return getLastMonth();
    case PeriodType.ThisYear:
      return getThisYear();
    case PeriodType.LastYear:
      return getLastYear();
    default:
      return {
        start: 0,
        end: 0,
      };
  }
};

export const getFilterTypeByPeriod = (period: PeriodType) => {
  switch (period) {
    case PeriodType.Daily:
      return StatisticFilterType.STATISTIC_FILTER_DAILY;
    case PeriodType.Weekly:
      return StatisticFilterType.STATISTIC_FILTER_WEEKLY;
    case PeriodType.Monthly:
      return StatisticFilterType.STATISTIC_FILTER_MONTHLY;
    default:
      return StatisticFilterType.STATISTIC_FILTER_DAILY;
  }
};

export function dateRange(startDate, endDate) {
  const start = startDate.split('-');
  const end = endDate.split('-');
  const startYear = parseInt(start[0]);
  const endYear = parseInt(end[0]);
  const result = {};

  for (let i = startYear; i <= endYear; i++) {
    if (!result[i]) {
      result[i] = [];
    }
    const endMonth = i !== endYear ? 11 : parseInt(end[1]) - 1;
    const startMonth = i === startYear ? parseInt(start[1]) - 1 : 0;
    for (let j = startMonth; j <= endMonth; j = j > 12 ? j % 12 || 11 : j + 1) {
      const seconds = new Date(Date.UTC(i, j, 1)).getTime();
      result[i].push(seconds);
    }
  }
  return result;
}

export const PeriodTypeText = {
  [PeriodType.Daily]: t('Daily'),
  [PeriodType.Weekly]: t('Weekly'),
  [PeriodType.Yesterday]: t('Yesterday'),
  [PeriodType.Monthly]: t('Monthly'),
  [PeriodType.Last7Days]: t('Last {{day}} days', { day: 7 }),
  [PeriodType.Last30Days]: t('Last {{day}} days', { day: 30 }),
  [PeriodType.LastWeek]: t('Last week'),
  [PeriodType.LastMonth]: t('Last month'),
  [PeriodType.LastYear]: t('Last year'),
  [PeriodType.ThisWeek]: t('This week'),
  [PeriodType.ThisMonth]: t('This month'),
  [PeriodType.ThisYear]: t('This year'),
  [PeriodType.Custom]: t('Custom range'),
};

// FORMAT
export const formatTimeStampToSeconds = (timestamp: number) => Math.floor(timestamp / 1000);

export const formatWithSchema = (timestamp: number, schema: string): string =>
  format(timestamp, schema, { locale: dateLocales[localStorage.getItem(KEY_I18N) || KEY_ENGLISH] });

export const formatDate = (timestamp: number): string => formatWithSchema(timestamp, 'dd MMM yyyy');

export const formatTime = (timestamp: number): string => formatWithSchema(timestamp, 'HH:mm');

export const formatDateTime = (timestamp: number): string => formatWithSchema(timestamp, 'dd MMM yyyy, HH:mm');

// * if your time zone is GMT+7, -420 will be returned.
export const getCurrentTimeZone = () => -(new Date().getTimezoneOffset() / 60);
