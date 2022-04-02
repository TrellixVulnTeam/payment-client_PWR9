export const BASE_OPTIONS_SPLINE_CHARTS = {
  chart: {
    type: 'areaspline',
    style: {
      fontFamily: 'Inter',
    },
  },
  title: {
    text: '',
  },
  legend: {
    enabled: false,
  },
  credits: {
    enabled: false,
  },
  plotOptions: {
    areaspline: {
      fillOpacity: 0.5,
    },
  },
};

export const TOOLTIP_OPTIONS = {
  borderRadius: 8,
  borderWidth: 0,
  shadow: false,
  padding: 0,
  style: {
    padding: 0,
  },
  headerFormat: '',
  useHTML: true,
  shared: true,
};
