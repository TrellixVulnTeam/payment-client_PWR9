import { t } from 'i18next';
import { useEffect, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useAppSelector } from 'redux/store';
import { UserInfoCustom } from 'redux/features/users/types';
import { selectRoleEntities, selectRoleStatus } from 'redux/features/role/slice';
import { FormFields, FormTypes } from 'components/Form/types';
import FormInput from '../FormInput';
import { formatOptions } from 'utils/common';
import { StatusEnum } from 'redux/constant';

type Props = {
  userInfo: UserInfoCustom;
  onSave?: (data: any) => void;
};

const FormRole = ({ onSave, userInfo }: Props) => {
  const roleStatusState = useAppSelector(selectRoleStatus);

  const roleId = userInfo.rolesList[0]?.roleId;
  const groupId = userInfo.rolesList[0]?.groupId;

  const defaultValues = useMemo(
    () => ({
      roleId,
    }),
    [roleId],
  );

  const methods = useForm({
    defaultValues,
  });
  const { setValue } = methods;
  const roles = useAppSelector(selectRoleEntities);

  useEffect(() => {
    setValue('roleId', roleId);
  }, [setValue, roleId]);

  const roleOptions = useMemo(() => {
    const options = Object.values(roles).filter((role) => role.group.id === groupId);
    return formatOptions(options, { name: 'name', value: 'id' });
  }, [roles, groupId]);

  const fields: FormFields[] = [
    {
      label: t('Role'),
      type: FormTypes.SELECT,
      name: 'roleId',
      width: { xs: 12 },
      placeholder: t('Select your {{key}}', { key: t('Role').toLowerCase() }),
      options: roleOptions,
    },
  ];

  return (
    <FormProvider {...methods}>
      <FormInput
        loadingSkeleton={roleStatusState === StatusEnum.LOADING}
        label={t('Role')}
        render={roles[roleId]?.name}
        fields={fields}
        onSave={onSave}
        defaultValues={defaultValues}
      />
    </FormProvider>
  );
};

export default FormRole;
