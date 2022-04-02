import { LOGIN } from 'configs/routes/path';
import { Error, StatusCode as grpcStatusCode } from 'grpc-web';
import _isEmpty from 'lodash-es/isEmpty';
import { Code } from '@greyhole/myid/myid_code_pb';

export interface GRPCClientResponse<T> {
  error: Error | null;
  response: T | null;
}

export const KEY_ACCESS_TOKEN = 'accessToken';

export const handleLogout = (code?: number) => {
  localStorage.removeItem(KEY_ACCESS_TOKEN);
  let href = window.location.origin;
  if (code) href += `${LOGIN}?c=${code}`;
  return (window.location.href = href);
};

class gRPCClientAbstract {
  client: any = null;
  clientName: string = '';

  constructor(Client: any, clientName?: string, env?: any) {
    this.clientName = clientName || 'NoClientName';
    this.client = new Client(env || process.env.REACT_APP_HEIMDALL_URL);
  }

  logFuncName(funcName: string) {
    return `${this.clientName}.${funcName}`;
  }

  async gRPCClientRequest<T>(func: string, request: any): Promise<GRPCClientResponse<T>> {
    try {
      const token = localStorage.getItem(KEY_ACCESS_TOKEN);
      let option = {};
      if (token) {
        option = { ...option, Authorization: `Bearer ${token}` };
      }

      console.log(
        `%c gRPCClientRequest -> [${this.logFuncName(func)}] -> REQUEST:`,
        'background-color: #deeb34; color: #000; font-size: 14px',
        `>>> request: `,
        request.toObject(),
        option,
      );

      const response = await this.client[func](request, option);

      console.log(
        `%c>>>>> gRPCClientResponse -> [${this.logFuncName(func)}] -> SUCCESS:`,
        'background-color: #23d947; color: #000; font-size: 14px',
        response.toObject(),
      );

      return {
        error: null,
        response: !_isEmpty(response) ? response.toObject() : {},
      };
    } catch (error: any) {
      switch (error?.code) {
        case grpcStatusCode.UNAUTHENTICATED:
          console.log(
            `%c>>>>> gRPCClientResponse -> [${this.logFuncName(func)}] -> ERROR -> UNAUTHENTICATED: `,
            'background-color: #c0392b; color: #000; font-size: 14px',
            error,
          );
          handleLogout(error?.code);
          break;

        case Code.ABORTED:
          console.log(
            `%c>>>>> gRPCClientResponse -> [${this.logFuncName(func)}] -> ERROR -> ABORTED: `,
            'background-color: #c0392b; color: #000; font-size: 14px',
            error,
          );
          handleLogout(error?.code);
          break;

        case grpcStatusCode.UNKNOWN:
        case grpcStatusCode.UNIMPLEMENTED:
        case grpcStatusCode.INVALID_ARGUMENT:
        case grpcStatusCode.NOT_FOUND:
          console.log(
            `%c>>>>> gRPCClientResponse -> [${this.logFuncName(func)}] -> ERROR: `,
            'background-color: #c0392b; color: #000; font-size: 14px',
            error,
          );
          break;

        default:
          console.log(
            `%c>>>>> gRPCClientResponse  -> [${this.logFuncName(func)}] -> ERROR: `,
            'background-color: #c0392b; color: #000; font-size: 14px',
            error,
          );
          break;
      }

      return {
        error: !_isEmpty(error) ? error : {},
        response: null,
      };
    }
  }
}

export default gRPCClientAbstract;
