import { ICurrencyNetwork } from "./CurrencyNetwork";

export interface IInvoiceCurrency {
  id: number;
  code: string;
  fullcode: string;
  network: ICurrencyNetwork;
  name: string;
  is_email_required: boolean;
  stablecoin: boolean;
  icon_base: string;
  icon_network: string;
  icon_qr: string;
  order: number;
}
