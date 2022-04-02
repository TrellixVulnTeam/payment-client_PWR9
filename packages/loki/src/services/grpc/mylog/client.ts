import { MyLogClient } from '@greyhole/mylog/MylogServiceClientPb';
import { ListLogsReply, ListLogsRequest, MeRequest } from '@greyhole/mylog/mylog_pb';
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb';
import gRPCClientAbstract from '../abstract/gRPCClient';

class gRPCClient extends gRPCClientAbstract {
  constructor() {
    super(MyLogClient, 'MyLogClient');
  }

  async listLogs(params: ListLogsRequest.AsObject) {
    const request = new ListLogsRequest();
    if (params.from && params.to) {
      request.setFrom(new google_protobuf_timestamp_pb.Timestamp().setSeconds(params.from.seconds));
      request.setTo(new google_protobuf_timestamp_pb.Timestamp().setSeconds(params.to.seconds));
    }
    request.setGroupsIdsList(params.groupsIdsList);
    request.setRoleIdsList(params.roleIdsList);
    request.setUserIdsList(params.userIdsList);
    request.setLimit(params.limit);
    request.setCursor(params.cursor);
    return await this.gRPCClientRequest<ListLogsReply.AsObject>('listLogs', request);
  }

  async me(params: MeRequest.AsObject) {
    const request = new MeRequest();
    request.setLimit(params.limit);
    request.setCursor(params.cursor);

    return await this.gRPCClientRequest<ListLogsReply.AsObject>('me', request);
  }
}

export const gRPCMyLogClient = new gRPCClient();
