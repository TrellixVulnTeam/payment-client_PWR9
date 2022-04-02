import SvgIcon, { SvgIconProps } from '@material-ui/core/SvgIcon';

const IconCheckPending = (props: SvgIconProps) => (
  <SvgIcon width="24" height="24" viewBox="0 0 24 24" {...props}>
    <circle cx="12" cy="12" r="11.5" stroke="#CCCCCC" />
    <circle cx="12" cy="12" r="7.5" fill="#CCCCCC" stroke="#CCCCCC" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M15.7071 9.29289C16.0976 9.68342 16.0976 10.3166 15.7071 10.7071L11.7071 14.7071C11.3166 15.0976 10.6834 15.0976 10.2929 14.7071L8.29289 12.7071C7.90237 12.3166 7.90237 11.6834 8.29289 11.2929C8.68342 10.9024 9.31658 10.9024 9.70711 11.2929L11 12.5858L14.2929 9.29289C14.6834 8.90237 15.3166 8.90237 15.7071 9.29289Z"
      fill="#E0E0E0"
    />
  </SvgIcon>
);

export default IconCheckPending;
