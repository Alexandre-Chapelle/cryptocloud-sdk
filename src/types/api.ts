import { CreateInvoiceError } from "./errors";
import { CreateInvoiceSuccess, ResponseData } from "./responses";
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

export interface ICryptoCloud {
  createInvoice({
    query,
    shop_id,
    amount,
    currency,
    add_fields,
    order_id,
    email,
  }: ICreateInvoice): Promise<
    ResponseData<CreateInvoiceSuccess, CreateInvoiceError>
  >;
}

export type RequestParamsBodyAllowed<T> = Optional<RequestParams<T>, "body">;
export type RequestParamsBodyDisallowed<T> = Exclude<RequestParams<T>, "body">;
export interface RequestParams<T> {
  method: HttpMethods;
  endpoint: Endpoints;
  optionalHeaders?: HeadersInit;
  body: T;
}
