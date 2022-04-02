import { RecaptchaClient } from '@greyhole/recaptcha/RecaptchaServiceClientPb';
import { GetCaptchaReply, GetCaptchaRequest } from '@greyhole/recaptcha/recaptcha_pb';

import gRPCClientAbstract from '../abstract/gRPCClient';

class gRPCClient extends gRPCClientAbstract {
  constructor() {
    super(RecaptchaClient, 'RecaptchaClient', process.env.REACT_APP_BIFROST_URL);
  }

  async getCaptcha() {
    const getCaptchaRequest = new GetCaptchaRequest();
    return await this.gRPCClientRequest<GetCaptchaReply.AsObject>('getCaptcha', getCaptchaRequest);
  }
}

export const gRPCaptchaClient = new gRPCClient();
