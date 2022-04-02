import { PaperBackgrounds } from 'components/StyleGuide/Paper';
import SelectButton from 'components/StyleGuide/SelectButton';
import { PeriodType } from 'context/url_params_context/resolve_url_params';
import { useUpdateUrlParams } from 'context/url_params_context/use_url_params';
import React, { useEffect } from 'react';

interface Props {}

const periodData = [PeriodType.Daily, PeriodType.Weekly, PeriodType.Monthly];

const Filter = (props: Props) => {
  const [urlParams, setUrlParams] = useUpdateUrlParams();
  const { period } = urlParams;

  useEffect(() => {
    if (!period) {
      setUrlParams({
        period: periodData[0],
      });
    }
  }, [setUrlParams, period]);

  function handleChangePeriod(selected) {
    setUrlParams({
      period: selected,
    });
  }

  return (
    <SelectButton background={PaperBackgrounds.gray} data={periodData} value={period} onChange={handleChangePeriod} />
  );
};

export default Filter;
