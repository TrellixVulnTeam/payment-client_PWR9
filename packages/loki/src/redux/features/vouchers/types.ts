import { Voucher } from '@mcuc/natasha/natasha_pb';
import { StatusEnum } from 'redux/constant';

export interface VouchersState {
  status: StatusEnum;
  error: any;
  vouchers: Array<Voucher.AsObject>;
  totalRecord: number;
  totalPage: number;
  voucher: Voucher.AsObject;
  pagination: {
    page: number;
    size: number;
  };
}
