import { t } from 'i18next';
import React from 'react';
import { useAppSelector } from 'redux/store';
import { selectIncomeStatement } from 'redux/features/report/slice';
import SplineChart from 'components/Charts/SplineChart';
import LayoutPaper from 'components/Layout/LayoutPaper';

type Props = {};

const IncomeStatement = (props: Props) => {
  const data = useAppSelector(selectIncomeStatement);

  return (
    <LayoutPaper header={t('Income Statement')} style={{ height: 488 }}>
      <SplineChart
        categories={data.categories}
        series={data.series}
        chartOptions={{
          chart: {
            height: 340,
          },
        }}
      />
    </LayoutPaper>
  );
};

export default React.memo(IncomeStatement);
