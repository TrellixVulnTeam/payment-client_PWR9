import React, { useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { useAppSelector } from 'redux/store';
import { selectRoleState } from 'redux/features/role/slice';
import { selectGroupEntities, selectGroupStatus } from 'redux/features/group/slice';
import { FormFields, FormTypes } from 'components/Form/types';
import { formatOptions } from 'utils/common';
import FormInput from '../../FormInput/FormInput';
import { t } from 'i18next';
import { StatusEnum } from 'redux/constant';

type Props = {
  userInfo: any;
  onSave: (data: any) => void;
};

type FormValues = {
  groupId: number;
  roleId: number;
};

const FormGroup = ({ userInfo, onSave }: Props) => {
  const groupStatusState = useAppSelector(selectGroupStatus);

  const defaultValues = useMemo(() => {
    return {
      groupId: userInfo.rolesList[0]?.groupId,
      roleId: userInfo.rolesList[0]?.roleId,
    };
  }, [userInfo.rolesList]);

  const methods = useForm<FormValues>({
    defaultValues,
  });

  const { setValue, watch } = methods;
  const watchGroupId = watch('groupId');

  React.useEffect(() => {
    setValue('groupId', defaultValues.groupId);
    setValue('roleId', defaultValues.roleId);
  }, [setValue, defaultValues]);

  const groups = useAppSelector(selectGroupEntities);

  const { roleListByGroupId } = useAppSelector(selectRoleState);

  const roleOptions = useMemo(
    () => formatOptions(roleListByGroupId[watchGroupId], { name: 'name', value: 'id' }),
    [roleListByGroupId, watchGroupId],
  );

  const handleChangeGroup = () => {
    setValue('roleId', undefined);
  };

  const groupOptions = useMemo(() => formatOptions(Object.values(groups), { name: 'name', value: 'id' }), [groups]);

  const fields: FormFields[] = [
    {
      type: FormTypes.SELECT,
      label: t('Group'),
      name: 'groupId',
      width: { xs: 12 },
      placeholder: t('Select your {{key}}', { key: t('Group').toLowerCase() }),
      options: groupOptions,
      onChange: handleChangeGroup,
    },
    {
      type: FormTypes.SELECT,
      label: t('Role'),
      name: 'roleId',
      width: { xs: 12 },
      placeholder: t('Select your {{key}}', { key: t('Role').toLowerCase() }),
      options: roleOptions,
      rules: { required: t('This field is required') },
    },
  ];

  return (
    <FormProvider {...methods}>
      <FormInput
        loadingSkeleton={groupStatusState === StatusEnum.LOADING}
        fields={fields}
        label={t('Group')}
        render={groups[watchGroupId]?.name}
        defaultValues={defaultValues}
        onSave={onSave}
      />
    </FormProvider>
  );
};

export default React.memo(FormGroup);
