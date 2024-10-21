import {
  BalanceError,
  CancelInvoiceError,
  CreateInvoiceError,
  InvoiceInformationError,
  InvoiceListError,
} from "./errors";
import {
  BalanceSuccess,
  CancelInvoiceSuccess,
  CreateInvoiceSuccess,
  InvoiceInformationSuccess,
  InvoiceListSuccess,
  ResponseData,
} from "./responses";
import { Optional } from "./util";

type CurrencyCodes =
  | "USD"
  | "UZS"
  | "KGS"
  | "KZT"
  | "AMD"
  | "AZN"
  | "BYN"
  | "AUD"
  | "TRY"
  | "AED"
  | "CAD"
  | "CNY"
  | "HKD"
  | "IDR"
  | "INR"
  | "JPY"
  | "PHP"
  | "SGD"
  | "THB"
  | "VND"
  | "MYR"
  | "RUB"
  | "UAH"
  | "EUR"
  | "GBP";

export enum HttpMethodEnum {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  HEAD = "HEAD",
  OPTIONS = "OPTIONS",
  PATCH = "PATCH",
  TRACE = "TRACE",
}

export const KNOWN_HTTP_STATUS_ERRORS = [400, 403] as const;

export const HttpMethodConfig = {
  [HttpMethodEnum.GET]: false,
  [HttpMethodEnum.POST]: true,
  [HttpMethodEnum.PUT]: true,
  [HttpMethodEnum.DELETE]: true,
  [HttpMethodEnum.HEAD]: false,
  [HttpMethodEnum.OPTIONS]: false,
  [HttpMethodEnum.PATCH]: true,
  [HttpMethodEnum.TRACE]: false,
} as const;

export type Endpoints =
  | "invoice/create"
  | "invoice/merchant/canceled"
  | "invoice/merchant/info"
  | "merchant/wallet/balance/all"
  | "invoice/merchant/statistics"
  | "invoice/static/create";

export type BodyAllowedMethods = {
  [K in keyof typeof HttpMethodConfig]: (typeof HttpMethodConfig)[K] extends true
    ? K
    : never;
}[keyof typeof HttpMethodConfig];

export type BodyDisallowedMethods = Exclude<
  keyof typeof HttpMethodConfig,
  BodyAllowedMethods
>;

export type HttpMethods = keyof typeof HttpMethodConfig;

interface Query {
  locale?: string;
}

interface AdditionalFields {
  time_to_pay?: {
    hours: number;
    minutes: number;
  };
  email_to_send?: string;
  available_currencies?: string[];
  cryptocurrency?: string;
  period?: "month" | "week" | "day";
}

export interface ICreateInvoice {
  query?: Query;
  shop_id: string;
  amount: number;
  currency?: CurrencyCodes;
  add_fields?: AdditionalFields;
  order_id?: string;
  email?: string;
}

export interface ICancelInvoice {
  uuid: string;
}

export interface IInvoiceList {
  start: string;
  end: string;
  offset?: number;
  limit?: number;
}

export interface IInvoiceInformation {
  uuids: string[];
}

export interface IStatistics {
  start: string;
  end: string;
}

export interface IStaticWallet {
  shop_id: string;
  currency: string;
  identify: string;
}

export interface ICryptoCloud {
  createInvoice({
    query,
    amount,
    currency,
    add_fields,
    order_id,
    email,
  }: Omit<ICreateInvoice, "shop_id">): Promise<
    ResponseData<CreateInvoiceSuccess, CreateInvoiceError>
  >;
  cancelInvoice({
    uuid,
  }: ICancelInvoice): Promise<
    ResponseData<CancelInvoiceSuccess, CancelInvoiceError>
  >;
  invoiceList({
    start,
    end,
    offset,
    limit,
  }: IInvoiceList): Promise<ResponseData<InvoiceListSuccess, InvoiceListError>>;
  invoiceInformation({
    uuids,
  }: IInvoiceInformation): Promise<
    ResponseData<InvoiceInformationSuccess, InvoiceInformationError>
  >;
  balance(): Promise<ResponseData<BalanceSuccess, BalanceError>>;
}

export type RequestParamsBodyAllowed<T> = Optional<RequestParams<T>, "body">;
export type RequestParamsBodyDisallowed = Exclude<
  RequestParams<undefined>,
  "body"
>;
export interface RequestParams<T> {
  method: HttpMethods;
  endpoint: Endpoints;
  optionalHeaders?: HeadersInit;
  body?: T;
}
