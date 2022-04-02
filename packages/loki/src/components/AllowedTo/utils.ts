import { Permission } from '@greyhole/myid/myid_pb';
import _isEmpty from 'lodash-es/isEmpty';
import _camelCase from 'lodash-es/camelCase';
import _difference from 'lodash-es/difference';
import _intersection from 'lodash-es/intersection';

/*
  ? Format action list to action name camelCase to compare
  * @param Resource: Payment Top-up
  * @param Action: Auto Approval
  => paymentTopup.autoApproval
*/
export const combineResourceWithActionList = (permissions: Permission.AsObject[]): string[] => {
  return permissions.reduce(
    (resourceAction, { actionsList }) =>
      resourceAction.concat(
        actionsList.map((action) => `${_camelCase(action.resource.name)}.${_camelCase(action.name)}`),
      ),
    [],
  );
};

export const isLegalPermission = (
  perform: string | string[],
  permissions: string[],
  logic: 'and' | 'or' = 'and',
): boolean => {
  if (_isEmpty(perform)) return true;
  if (typeof perform === 'string') {
    return permissions.includes(perform);
  }
  if (Array.isArray(perform)) {
    // all perform entries are into permissions
    return logic === 'and'
      ? _difference(perform, permissions).length === 0
      : _intersection(perform, permissions).length > 0;
  }
  return false;
};
