import { SvgIconProps } from '@material-ui/core/SvgIcon';

const Close = (props: SvgIconProps) => (
  <svg
    width={22}
    height={22}
    viewBox="0 0 22 22"
    xmlns="http://www.w3.org/2000/svg"
    style={{ width: props.width, height: props.height }}
    {...props}
  >
    <path
      d="M14.71 7.29a1.001 1.001 0 00-1.42 0L11 9.59l-2.29-2.3a1.004 1.004 0 00-1.42 1.42L9.59 11l-2.3 2.29a1 1 0 000 1.42.998.998 0 001.42 0l2.29-2.3 2.29 2.3a.997.997 0 001.095.219.999.999 0 00.325-.22 1 1 0 000-1.42L12.41 11l2.3-2.29a1.001 1.001 0 000-1.42zm3.36-3.36A10 10 0 103.93 18.07 10 10 0 1018.07 3.93zm-1.41 12.73A8 8 0 1119 11a7.95 7.95 0 01-2.34 5.66z"
      fill="currentColor"
    />
  </svg>
);

export default Close;
