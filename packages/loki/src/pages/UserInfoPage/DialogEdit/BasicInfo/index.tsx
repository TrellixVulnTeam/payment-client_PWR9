import { t } from 'i18next';
import { useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { PhoneNumber } from '@greyhole/myid/myid_pb';

import { useAppSelector } from 'redux/store';
import { selectRoleState } from 'redux/features/role/slice';
import { selectGroupEntities } from 'redux/features/group/slice';

import FormData from 'components/Form';
import { FormFields, FormTypes } from 'components/Form/types';
import { formatOptions } from 'utils/common';

export default function BasicInfoForm() {
  const methods = useFormContext();

  const { setValue, watch } = methods;

  const watchGroupId = watch('groupId');

  const groups = useAppSelector(selectGroupEntities);
  const { roleListByGroupId } = useAppSelector(selectRoleState);

  const groupOptions = useMemo(() => formatOptions(Object.values(groups), { name: 'name', value: 'id' }), [groups]);
  const roleOptions = useMemo(
    () => formatOptions(roleListByGroupId[watchGroupId], { name: 'name', value: 'id' }),
    [roleListByGroupId, watchGroupId],
  );

  const handleChangeGroup = () => {
    setValue('roleId', null);
  };

  const fields: FormFields[] = [
    {
      name: 'fullName',
      type: FormTypes.INPUT,
      width: { xs: 12 },
      rules: { required: t('This field is required') },
      placeholder: t('Fill your {{key}}', { key: t('Full name').toLowerCase() }),
    },
    {
      name: 'groupId',
      label: t('Group'),
      type: FormTypes.SELECT,
      options: groupOptions,
      width: { xs: 6 },
      placeholder: t('Select'),
      onChange: handleChangeGroup,
      rules: { required: t('This field is required') },
    },
    {
      name: 'roleId',
      label: t('Role'),
      type: FormTypes.SELECT,
      options: roleOptions,
      width: { xs: 6 },
      placeholder: t('Select'),
      disabled: !watchGroupId,
      rules: { required: watchGroupId && t('This field is required') },
    },
    {
      name: 'phoneNumber',
      label: t('Phone number'),
      type: FormTypes.PHONE_NUMBER,
      placeholder: t('Fill your {{key}}', { key: t('Phone number').toLowerCase() }),
      width: { xs: 12 },
      rules: {
        required: t('This field is required'),
        validate: (value: PhoneNumber.AsObject) => {
          return (
            (value.nationalNumber?.length >= 10 && value.nationalNumber?.length <= 11) ||
            t('Phone number must be 10 or 11 digits')
          );
        },
      },
    },
  ];

  return <FormData methods={methods} fields={fields} />;
}
