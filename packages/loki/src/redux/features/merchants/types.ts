import { Merchant } from '@mcuc/natasha/natasha_pb';

export interface MerchantsState {
  loading: boolean;
  error: any;
  merchants: Merchant.AsObject[];
  selected: Merchant.AsObject | undefined;
  page: number;
  size: number;
  ids: string[];
  entities: Record<string, Merchant.AsObject>;
  displayIds: (string | number)[];
}
