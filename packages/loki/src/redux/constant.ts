import { getErrorMessageFromCode } from 'utils/constant/message';

export enum StatusEnum {
  'IDLE' = 'IDLE',
  'LOADING' = 'LOADING',
  'SUCCEEDED' = 'SUCCEEDED',
  'FAILED' = 'FAILED',
}

export const isLoading = (status: StatusEnum) => status === StatusEnum.LOADING;

export const RECORD_LIMIT = 100;
export const ALL_RECORD_LIMIT = 999;

export const stateLoading = (state: any) => {
  state.status = StatusEnum.LOADING;
  state.error = null;
};

export const stateError = (state: any, error: { code: number; message: string }) => {
  state.status = StatusEnum.FAILED;
  state.error = getErrorMessageFromCode(error.code);
  // @ts-ignore
  console.log(error);
};

export const stateSucceeded = (state: any) => {
  state.status = StatusEnum.SUCCEEDED;
  state.error = null;
};

export const stateIdle = (state: any) => {
  state.status = StatusEnum.IDLE;
  state.error = null;
};
