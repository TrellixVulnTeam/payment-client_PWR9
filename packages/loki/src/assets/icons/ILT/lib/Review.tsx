import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const Review = (props: SvgIconProps) => (
  <SvgIcon
    width="24"
    height="24"
    viewBox="0 0 20 20"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M16.4 2H3.6C2.72 2 2 2.72 2 3.6V18L5.2 14.8H16.4C17.28 14.8 18 14.08 18 13.2V3.6C18 2.72 17.28 2 16.4 2ZM5.2 11.6V9.624L10.704 4.12C10.864 3.96 11.112 3.96 11.272 4.12L12.688 5.536C12.848 5.696 12.848 5.944 12.688 6.104L7.176 11.6H5.2ZM14 11.6H8.8L10.4 10H14C14.44 10 14.8 10.36 14.8 10.8C14.8 11.24 14.44 11.6 14 11.6Z" />
  </SvgIcon>
);

export default Review;
