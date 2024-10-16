import { ICurrencyNetwork } from "./CurrencyNetwork";

export interface IBalanceCurrency {
  id: number;
  code: string;
  short_code: string;
  name: string;
  is_email_required: boolean;
  stablecoin: boolean;
  icon_base: string;
  icon_network: string;
  icon_qr: string;
  order: number;
  obj_network: ICurrencyNetwork;
  enable: boolean;
}
