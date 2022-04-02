import { FormFields, FormTypes } from 'components/Form/types';
import { t } from 'i18next';

import { regexpPassword } from 'utils/common/password';

export const fields: FormFields[] = [
  {
    name: 'newPassword',
    label: t('New password'),
    type: FormTypes.INPUT_PASSWORD,
    placeholder: 'Type your new password',
    rules: {
      required: t('This field is required'),
      pattern: {
        value: regexpPassword,
        message: t('Password is wrong format'),
      },
    },
    validation: true,
    width: { xs: 12 },
  },
  {
    name: 'confirmNewPassword',
    label: t('Confirm new password'),
    type: FormTypes.INPUT_PASSWORD,
    placeholder: t('Type your confirm new password'),
    rules: { required: t('This field is required') },
    width: { xs: 12 },
  },
];
