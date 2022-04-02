import { t } from 'i18next';
import React, { useState, useEffect, useMemo } from 'react';
import * as yup from 'yup';
import { endOfDay, isSameDay, startOfDay } from 'date-fns';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import FormData from 'components/Form';
import AlopayDialog from 'components/Dialog';
import { FormFields, FormTypes } from 'components/Form/types';
import { Button, ButtonSizes, ButtonVariants } from 'components/StyleGuide/Button';
import Typography, { TypoTypes, TypoVariants } from 'components/StyleGuide/Typography';
import { PeriodType } from 'context/url_params_context/resolve_url_params';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';
import { formatWithSchema, getRangeByPeriod, PeriodTypeText } from 'utils/date';
import { uppercaseFirstLetterAllWords } from 'utils/common/string';
import { TimeSheet } from 'assets/icons/ILT';
import styles from './styles.module.scss';

type TimeRange = { start: Date | number | null; end: Date | number | null };

type FormValues = {
  periodType: PeriodType;
  startDate: Date | null;
  endDate: Date | null;
};

type DateRangeProps = {
  defaultPeriod?: PeriodType;
  onChange?: (data: TimeRange, periodType: PeriodType) => void;
};

const schema = yup.object().shape({
  periodType: yup.string(),
  startDate: yup
    .date()
    .nullable()
    .when('periodType', {
      is: (periodType: string) => periodType === PeriodType.Custom,
      then: yup.date().nullable().typeError(t('Invalid Date')).required(t('This field is required')),
    }),
  endDate: yup
    .date()
    .nullable()
    .when('periodType', {
      is: (periodType: string) => periodType === PeriodType.Custom,
      then: yup
        .date()
        .nullable()
        .typeError(t('Invalid Date'))
        .min(yup.ref('startDate'), t('End date should be later than start date'))
        .required(t('This field is required')),
    }),
});

const DateRange = ({ defaultPeriod, onChange }: DateRangeProps) => {
  const [urlParams, setUrlParams] = useUpdateUrlParams();

  const { period = defaultPeriod, startDate: startDateParam, endDate: endDateParam } = urlParams;

  const defaultValues = useMemo(
    () => ({
      periodType: period,
      startDate: period === PeriodType.Custom ? new Date(startDateParam) : null,
      endDate: period === PeriodType.Custom ? new Date(endDateParam) : null,
    }),
    [period, startDateParam, endDateParam],
  );

  const methods = useForm<FormValues>({
    defaultValues,
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const { watch, reset, setValue, handleSubmit } = methods;

  const watchPeriodType = watch('periodType');
  const watchStartDate = watch('startDate');

  useEffect(() => {
    if (!startDateParam && !endDateParam) {
      reset({ ...defaultValues });
    }
  }, [setValue, reset, startDateParam, endDateParam, defaultValues]);

  const [openModal, setOpenModal] = useState(false);

  const handleOpen = () => {
    setOpenModal(true);
  };

  const handleClose = () => {
    setOpenModal(false);
  };

  const handleApply = (formValues: FormValues) => {
    let date = null;
    if (PeriodType.Custom === formValues.periodType) {
      if (isSameDay(formValues.endDate, formValues.startDate)) {
        date = {
          start: +startOfDay(new Date(formValues.startDate)),
          end: +endOfDay(new Date(formValues.endDate)),
        };
      } else {
        date = {
          start: +startOfDay(formValues.startDate),
          end: +endOfDay(formValues.endDate),
        };
      }
    } else {
      date = getRangeByPeriod(formValues.periodType);
    }

    setUrlParams({
      period: formValues.periodType,
      startDate: date.start,
      endDate: date.end,
    });

    if (typeof onChange === 'function') {
      onChange(date, formValues.periodType);
    }

    handleClose();
  };

  const getDisplayTitle = () => {
    if (period) {
      if (period === PeriodType.Custom) {
        return `${t('Time range')}: ${formatWithSchema(startDateParam, 'dd MMM, yyyy')} - ${formatWithSchema(
          endDateParam,
          'dd MMM, yyyy',
        )}`;
      } else {
        return `${t('Time range')}: ${t(PeriodTypeText[period])}`;
      }
    }

    return t('Time range');
  };

  const fields: FormFields[] = [
    {
      type: FormTypes.RADIO,
      name: 'periodType',
      columns: 2,
      options: [
        {
          value: PeriodType.Last7Days,
          name: uppercaseFirstLetterAllWords(t('Last {{day}} days', { day: 7 })),
        },
        {
          value: PeriodType.Last30Days,
          name: uppercaseFirstLetterAllWords(t('Last {{day}} days', { day: 30 })),
        },
        {
          value: PeriodType.LastWeek,
          name: uppercaseFirstLetterAllWords(t('Last week')),
        },
        {
          value: PeriodType.ThisWeek,
          name: uppercaseFirstLetterAllWords(t('This week')),
        },
        {
          value: PeriodType.LastMonth,
          name: uppercaseFirstLetterAllWords(t('Last month')),
        },
        {
          value: PeriodType.ThisMonth,
          name: uppercaseFirstLetterAllWords(t('This month')),
        },
        {
          value: PeriodType.LastYear,
          name: uppercaseFirstLetterAllWords(t('Last year')),
        },
        {
          value: PeriodType.ThisYear,
          name: uppercaseFirstLetterAllWords(t('This year')),
        },
        {
          value: PeriodType.Custom,
          name: uppercaseFirstLetterAllWords(t('Custom range')),
        },
      ],
      width: { xs: 12 },
    },
    {
      label: t('Start date'),
      name: 'startDate',
      type: FormTypes.DATE,
      maxDate: new Date(),
      width: { xs: 12 },
      hidden: watchPeriodType !== PeriodType.Custom,
      disabled: watchPeriodType !== PeriodType.Custom,
    },
    {
      label: t('End date'),
      name: 'endDate',
      type: FormTypes.DATE,
      minDate: new Date(watchStartDate),
      maxDate: new Date(),
      width: { xs: 12 },
      hidden: watchPeriodType !== PeriodType.Custom,
      disabled: watchPeriodType !== PeriodType.Custom,
    },
  ];

  const isSelected = !!watchPeriodType;

  return (
    <>
      <Button
        variant={ButtonVariants.secondary}
        size={ButtonSizes.md}
        selected={isSelected}
        startIcon={TimeSheet}
        onClick={handleOpen}
        fullWidth={false}
        className={styles['date-range']}
      >
        <Typography type={isSelected ? TypoTypes.primary : TypoTypes.default} variant={TypoVariants.button1}>
          {getDisplayTitle()}
        </Typography>
      </Button>
      {openModal && (
        <AlopayDialog
          title={t('Time Range')}
          onClose={handleClose}
          actions={
            <>
              <Button size={ButtonSizes.lg} onClick={handleSubmit(handleApply)}>
                {t('Apply')}
              </Button>
              <Button variant={ButtonVariants.secondary} size={ButtonSizes.lg} onClick={handleClose}>
                {t('Cancel')}
              </Button>
            </>
          }
        >
          <FormData methods={methods} fields={fields} onSubmit={handleApply} />
        </AlopayDialog>
      )}
    </>
  );
};

export default React.memo(DateRange);
