import DropdownList from 'components/StyleGuide/DropdownList';
import Option from 'components/StyleGuide/Option';
import Typography, { TypoTypes, TypoVariants, TypoWeights } from 'components/StyleGuide/Typography';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';
import { t } from 'i18next';
import React from 'react';
import { dateRange, formatWithSchema } from 'utils/date';
import styles from './styles.module.scss';

interface Props {}

const Filter = (props: Props) => {
  const from = '2020-01-01';
  const to = formatWithSchema(new Date().getTime(), 'yyyy-MM-dd');
  const dateRangeObj = dateRange(from, to);
  const arrYears = Object.keys(dateRangeObj);

  const [urlParams, setUrlParams] = useUpdateUrlParams();
  const firstYear = dateRangeObj[arrYears[arrYears.length - 1]];
  let { startDate = firstYear[firstYear.length - 1] } = urlParams;
  if (isNaN(startDate)) {
    startDate = firstYear[firstYear.length - 1];
  }

  function handleSelectDate(value) {
    setUrlParams({
      startDate: value,
      period: '',
    });
  }

  function renderTimeOptions() {
    let xhtml = [];
    for (let i = arrYears.length - 1; i >= 0; i--) {
      const year = arrYears[i];
      xhtml.push(
        <Option key={`${year}-${i}`} value={year} disabled>
          <Typography weight={TypoWeights.bold}>{year}</Typography>
        </Option>,
      );
      const arrSeconds = dateRangeObj[year];
      for (let j = arrSeconds.length - 1; j >= 0; j--) {
        const seconds = arrSeconds[j];
        xhtml.push(
          <Option key={`${seconds}-${j}`} value={seconds.toString()}>
            {/* {format(seconds, 'LLLL', { locale: enUS })} */}
            {formatWithSchema(seconds, 'LLLL')}
          </Option>,
        );
      }
    }
    return xhtml;
  }

  return (
    <div className={styles['root']}>
      <DropdownList
        value={startDate.toString()}
        onChange={handleSelectDate}
        display={(child) => {
          const milis = child.props?.value;
          const year = new Date(+milis).getFullYear();
          const innerChild = child.props?.children;
          return (
            <Typography type={TypoTypes.sub} variant={TypoVariants.body1} weight={TypoWeights.bold}>
              {/* {t('Month')}:{' '} */}
              {innerChild || t('selected')} {year}
            </Typography>
          );
        }}
      >
        {renderTimeOptions()}
      </DropdownList>
    </div>
  );
};

export default React.memo(Filter);
