import { t } from 'i18next';
import { FormFields, FormTypes } from 'components/Form/types';
import { regexpPassword } from 'utils/common/password';

export const fields: FormFields[] = [
  {
    name: 'newPassword',
    label: t('New password'),
    type: FormTypes.INPUT_PASSWORD,
    placeholder: t('Fill your {{key}}', { key: t('New password').toLowerCase() }),
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
    placeholder: t('Fill your {{key}}', { key: t('Confirm new password') }),
    rules: { required: t('This field is required') },
    width: { xs: 12 },
  },
];
