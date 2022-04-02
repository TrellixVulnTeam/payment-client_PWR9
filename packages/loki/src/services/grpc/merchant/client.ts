import { NatashaClient } from '@mcuc/natasha/NatashaServiceClientPb';
import {
  ListMerchantsReply,
  ListMerchantsRequest,
  GetMerchantRequest,
  GetMerchantReply,
} from '@mcuc/natasha/natasha_pb';

import gRPCClientAbstract from '../abstract/gRPCClient';

class gRPCClient extends gRPCClientAbstract {
  constructor() {
    super(NatashaClient, 'NatashaClient');
  }

  async getListMerchants(params: ListMerchantsRequest.AsObject) {
    const request = new ListMerchantsRequest();
    request.setPage(params.page);
    request.setSize(params.size);
    request.setKeyword(params.keyword);
    return await this.gRPCClientRequest<ListMerchantsReply.AsObject>('listMerchants', request);
  }

  async getMerchant(params: GetMerchantRequest.AsObject) {
    const request = new GetMerchantRequest();
    request.setId(params.id);
    return await this.gRPCClientRequest<GetMerchantReply.AsObject>('getMerchant', request);
  }
}

export const gRPCMerchantsClient = new gRPCClient();
