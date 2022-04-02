export enum TypoTypes {
  primary = 'primary',
  secondary = 'secondary',
  default = 'default',
  titleDefault = 'title-default',
  disable = 'disable',
  error = 'error',
  invert = 'invert',
  link = 'link',
  sub = 'sub',
  titleSub = 'title-sub',
  body = 'body',
  success = 'success',
  warning = 'warning',
  strikethrough = 'strikethrough',
  inherit = 'inherit',
}

export enum TypoVariants {
  head1 = 'head1',
  head2 = 'head2',
  head3 = 'head3',
  head4 = 'head4',
  body1 = 'body1',
  body2 = 'body2',
  caption = 'caption',
  button1 = 'button1',
  button2 = 'button2',
  inherit = 'inherit',
}

export const defaultTypoVariantMapping = {
  head1: 'h1',
  head2: 'h2',
  head3: 'h3',
  head4: 'h4',
  body1: 'p',
  body2: 'p',
  button1: 'p',
  button2: 'p',
  caption: 'p',
  inherit: 'p',
};

export enum TypoWeights {
  bold = 'bold',
  medium = 'medium',
  regular = 'regular',
  light = 'light',
  inherit = 'inherit',
}
