import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const AngleRight = (props: SvgIconProps) => (
  <SvgIcon
    width="24"
    height="24"
    viewBox="0 0 24 24" // ? DESIGN
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M15.3708 10.9458L9.71079 5.2958C9.61783 5.20207 9.50723 5.12768 9.38537 5.07691C9.26351 5.02614 9.1328 5 9.00079 5C8.86878 5 8.73807 5.02614 8.61622 5.07691C8.49436 5.12768 8.38376 5.20207 8.29079 5.2958C8.10454 5.48316 8 5.73661 8 6.0008C8 6.26498 8.10454 6.51844 8.29079 6.7058L13.2408 11.7058L8.29079 16.6558C8.10454 16.8432 8 17.0966 8 17.3608C8 17.625 8.10454 17.8784 8.29079 18.0658C8.38341 18.1603 8.49385 18.2355 8.61573 18.287C8.7376 18.3384 8.86849 18.3652 9.00079 18.3658C9.1331 18.3652 9.26398 18.3384 9.38586 18.287C9.50773 18.2355 9.61818 18.1603 9.71079 18.0658L15.3708 12.4158C15.4723 12.3222 15.5533 12.2085 15.6087 12.082C15.6641 11.9555 15.6927 11.8189 15.6927 11.6808C15.6927 11.5427 15.6641 11.4061 15.6087 11.2796C15.5533 11.1531 15.4723 11.0394 15.3708 10.9458Z"
      fill="currentColor"
    />
  </SvgIcon>
);

export default AngleRight;