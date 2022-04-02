import { CoulsonClient } from '@mcuc/coulson/CoulsonServiceClientPb';
import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb';
import {
  GetSettingReply,
  EnableAutoApprovalTelcoRequest,
  EnableAutoApprovalTelcoReply,
} from '@mcuc/coulson/coulson_pb';

import gRPCClientAbstract from '../abstract/gRPCClient';

class gRPCClient extends gRPCClientAbstract {
  constructor() {
    super(CoulsonClient, 'CoulsonClient');
  }

  async getSetting() {
    const request = new google_protobuf_empty_pb.Empty();
    return await this.gRPCClientRequest<GetSettingReply.AsObject>('getSetting', request);
  }

  async enableAutoApprovalTelco(params: EnableAutoApprovalTelcoRequest.AsObject) {
    const request = new EnableAutoApprovalTelcoRequest();
    request.setEnable(params.enable);
    return await this.gRPCClientRequest<EnableAutoApprovalTelcoReply.AsObject>('enableAutoApprovalTelco', request);
  }
}

export const gRPCConsoleClient = new gRPCClient();
