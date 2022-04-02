import { FormFields, FormTypes } from 'components/Form/types';
import { t } from 'i18next';

const fields: FormFields[] = [
  {
    name: 'email',
    label: `Email`,
    type: FormTypes.INPUT,
    placeholder: t('Fill your {{key}}', { key: t('Email').toLowerCase() }),
    rules: {
      required: t('This field is required'),
      pattern: {
        value:
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: 'Wrong mail format',
      },
    },
    width: { xs: 12 },
  },
];

export default fields;
