import { IInvoiceCurrency } from "./InvoiceCurrency";
import { IProject } from "./Project";

export interface IInvoice {
  uuid: string;
  created: string;
  address: string;
  expiry_date: string;
  side_commission: string;
  side_commission_cc: string;
  amount: number;
  amount_usd: number;
  amount_in_fiat: number;
  fee: number;
  fee_usd: number;
  service_fee: number;
  service_fee_usd: number;
  type_payments: string;
  fiat_currency: string;
  status: string;
  is_email_required: boolean;
  link: string;
  invoice_id: string | null;
  currency: IInvoiceCurrency;
  project: IProject;
  test_mode: boolean;
}
