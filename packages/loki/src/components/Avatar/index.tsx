import { default as MuiAvatar } from '@material-ui/core/Avatar';

type AvatarProps = {
  logo: any;
  children: React.ReactNode;
};

export default function Avatar(props: AvatarProps) {
  const { logo, children, ...rest } = props;

  return (
    <MuiAvatar src={logo} {...rest}>
      {children}
    </MuiAvatar>
  );
}
