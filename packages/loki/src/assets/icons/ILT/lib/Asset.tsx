import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const Asset = (props: SvgIconProps) => (
  <SvgIcon
    width="24"
    height="24"
    viewBox="0 0 20 20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M16 15.25C16.825 15.25 17.4925 14.4625 17.4925 13.5L17.5 4.75C17.5 3.7875 16.825 3 16 3H4C3.175 3 2.5 3.7875 2.5 4.75V13.5C2.5 14.4625 3.175 15.25 4 15.25H1.75C1.3375 15.25 1 15.6438 1 16.125C1 16.6062 1.3375 17 1.75 17H18.25C18.6625 17 19 16.6062 19 16.125C19 15.6438 18.6625 15.25 18.25 15.25H16ZM4.75 4.75H15.25C15.6625 4.75 16 5.14375 16 5.625V12.625C16 13.1062 15.6625 13.5 15.25 13.5H4.75C4.3375 13.5 4 13.1062 4 12.625V5.625C4 5.14375 4.3375 4.75 4.75 4.75Z"
      fill="currentColor"
    />
  </SvgIcon>
);

export default Asset;
