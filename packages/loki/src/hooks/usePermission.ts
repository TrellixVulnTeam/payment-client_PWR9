import { useEffect } from 'react';
import { selectActions } from 'redux/features/action/slice';
import { getListActionsThunk } from 'redux/features/action/thunks';
import { selectGroupEntities, selectGroups } from 'redux/features/group/slice';
import { getListGroupThunk } from 'redux/features/group/thunks';
import { selectResourceEntities, selectResources } from 'redux/features/resource/slice';
import { getListResourcesThunk } from 'redux/features/resource/thunks';
import { selectRoleEntities, selectRoles } from 'redux/features/role/slice';
import { getListRolesThunk } from 'redux/features/role/thunks';
import { useAppDispatch, useAppSelector } from 'redux/store';

export default function usePermission() {
  const dispatch = useAppDispatch();

  const groups = useAppSelector(selectGroups);
  const groupEntities = useAppSelector(selectGroupEntities);

  const resources = useAppSelector(selectResources);
  const resourceEntities = useAppSelector(selectResourceEntities);

  const actions = useAppSelector(selectActions);
  const actionEntities = useAppSelector(selectRoles);

  const roles = useAppSelector(selectRoles);
  const roleEntities = useAppSelector(selectRoleEntities);

  useEffect(() => {
    dispatch(getListRolesThunk());
    dispatch(getListActionsThunk());
    dispatch(getListGroupThunk());
    dispatch(getListResourcesThunk());
  }, [dispatch]);

  return {
    // group
    groups,
    groupEntities,
    // resource
    resources,
    resourceEntities,
    // action
    actions,
    actionEntities,
    // role
    roles,
    roleEntities,
  };
}
