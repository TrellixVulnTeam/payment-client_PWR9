import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const Me = (props: SvgIconProps) => (
  <SvgIcon
    width="24"
    height="24"
    viewBox="0 0 20 20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M10 2C5.584 2 2 5.584 2 10C2 14.416 5.584 18 10 18C14.416 18 18 14.416 18 10C18 5.584 14.416 2 10 2ZM10 4.4C11.328 4.4 12.4 5.472 12.4 6.8C12.4 8.128 11.328 9.2 10 9.2C8.672 9.2 7.6 8.128 7.6 6.8C7.6 5.472 8.672 4.4 10 4.4ZM10 15.76C8 15.76 6.232 14.736 5.2 13.184C5.224 11.592 8.4 10.72 10 10.72C11.592 10.72 14.776 11.592 14.8 13.184C13.768 14.736 12 15.76 10 15.76Z" />
  </SvgIcon>
);

export default Me;
