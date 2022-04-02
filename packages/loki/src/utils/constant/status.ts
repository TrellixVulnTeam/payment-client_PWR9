import { Status } from '@greyhole/myid/myid_pb';
import i18n from 'i18n';

export const STATUS = [
  {
    value: Status.ACTIVE,
    name: i18n.t('Active'),
  },
  {
    value: Status.INACTIVE,
    name: i18n.t('Inactive'),
  },
  {
    value: Status.LOCKED,
    name: i18n.t('Locked'),
  },
];

export function getStatus(statusId = 0) {
  const id = Object.keys(Status).find((key) => Status[key] === statusId);
  return Status[id];
}
