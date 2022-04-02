import _uniq from 'lodash-es/uniq';
import _isNaN from 'lodash-es/isNaN';
import { useMemo, useEffect, useState } from 'react';

import useAuth from './useAuth';
import { StatusEnum } from 'redux/constant';
import { useAppDispatch, useAppSelector } from 'redux/store';
import { selectUsersMap } from 'redux/features/common/slice';
import { getUsersThunk } from 'redux/features/common/thunks';
import { isLegalPermission } from 'components/AllowedTo/utils';
import { PerformPermission } from 'configs/routes/permission';

export default function useUsersMap(userIDs: (number | undefined)[]) {
  const dispatch = useAppDispatch();
  const usersMap = useAppSelector(selectUsersMap);
  const { userPermissions } = useAuth();
  const [status, setStatus] = useState(StatusEnum.IDLE);

  const userFiltered = useMemo(
    () => userIDs && _uniq(userIDs).filter((id) => !_isNaN(+id) && !usersMap[+id]),
    [userIDs, usersMap],
  );

  useEffect(() => {
    (async () => {
      if (isLegalPermission(PerformPermission.userManagementUserList.getUsers, userPermissions)) {
        if (userFiltered && userFiltered.length) {
          setStatus(StatusEnum.LOADING);
          await dispatch(
            getUsersThunk({
              userIdsList: userFiltered,
            }),
          );
          setStatus(StatusEnum.SUCCEEDED);
        }
      }
    })();
  }, [dispatch, userFiltered, userPermissions]);

  return {
    status,
    usersMap,
  };
}
