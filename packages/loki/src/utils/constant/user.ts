import { Status as StatusAccount } from '@greyhole/myid/myid_pb';

type ColorType = {
  color: string;
  type: string;
};

export const getColorTypeStatusAccount = (statusType: StatusAccount): ColorType => {
  let color = '';
  let type = '';

  switch (statusType) {
    case StatusAccount.ACTIVE:
      color = '#30CB00';
      type = 'Active';
      break;

    case StatusAccount.INACTIVE:
      color = '#FFB41F';
      type = 'Inactive';
      break;

    case StatusAccount.LOCKED:
      color = '#F53131';
      type = 'Locked';
      break;
    default:
      break;
  }

  return { color, type };
};

export const PREFIX_ACTION_LOG = "ACTION."
export const PREFIX_RESOURCE_LOG = "RESOURCE."
