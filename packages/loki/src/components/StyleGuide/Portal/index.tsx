import usePortal from 'hooks/usePortal';
import React, { FC } from 'react';
import { createPortal } from 'react-dom';
import checkIsBrowser from 'utils/common/checkIsBrowser';

export enum PortalIds {
  popover = 'alopay-popover',
  dialog = 'alopay-dialog',
  toast = 'alopay-toast',
  tooltip = 'alopay-popper',
}

export type PortalProps = React.PropsWithChildren<{
  /**
   * Set `id` of element will append to document
   */
  id: PortalIds | string;
}>;

const Portal: FC<PortalProps> = ({ id, children }: PortalProps) => {
  const isBrowser = checkIsBrowser();
  if (!isBrowser) {
    return null;
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const element = usePortal(id);
  return createPortal(children, element);
};

export default Portal;
