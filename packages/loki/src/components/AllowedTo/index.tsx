import useAuth from 'hooks/useAuth';
import React from 'react';
import _difference from 'lodash-es/difference';
import { isLegalPermission } from './utils';

export type Permission = string;

export type Perform = Permission | Permission[];

export type AllowedToType = {
  perform: Perform;
  children?: React.ReactNode;
  renderYes?: React.ComponentType;
  renderNo?: React.ComponentType;
  logic?: 'and' | 'or';
  watch?: any[];
};

const AllowedTo = ({
  perform = [],
  children,
  renderYes: RenderYes = () => <React.Fragment>{children}</React.Fragment>,
  renderNo: RenderNo = () => null,
  logic = 'and',
}: AllowedToType) => {
  const { userPermissions } = useAuth();
  if (isLegalPermission(perform, userPermissions, logic)) {
    return <RenderYes />;
  }
  return <RenderNo />;
};

/*
  * @param perform 
  ! In case we want it to render when changing @perform or any other PROPS change then use the function below
  =>
  const areEqual = (prevProps: AllowedToType, nextProps: AllowedToType) => {
    return prevProps.perform === nextProps.perform;
  };
*/

/*
  ! Because we only need it to render once
  * @pram: watch => Use in case when we need it to re-render when the value in watch changes
  * 
*/
const areEqual = (prevProps: AllowedToType, nextProps: AllowedToType) => {
  return _difference(prevProps.watch, nextProps.watch).length === 0;
};

export default React.memo(AllowedTo, areEqual);
