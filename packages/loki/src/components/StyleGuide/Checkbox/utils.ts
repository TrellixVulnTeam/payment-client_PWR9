import { CheckboxStatuses } from './types';
import { Checked, Uncheck, MultiChecked } from 'assets/icons/ILT';

const mapOfIcons = {
  [CheckboxStatuses.unchecked]: Uncheck,
  [CheckboxStatuses.checked]: Checked,
  [CheckboxStatuses.intermediate]: MultiChecked,
};

export const getIconByStatus = (status: CheckboxStatuses) => mapOfIcons[status];

export const getStatusOfCheckbox = (isChecked: boolean, isIntermediate: boolean) =>
  (!isChecked && CheckboxStatuses.unchecked) ||
  (isIntermediate ? CheckboxStatuses.intermediate : CheckboxStatuses.checked);
