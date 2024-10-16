import { ApiError, AuthorizationError } from "./errors";
import { IBalance } from "./models/Balance";
import { IInvoice } from "./models/Invoice";
import { IStaticWallet } from "./models/StaticWallet";
import { IStatistics } from "./models/Statistics";

export interface SuccessResponse<R> {
  status: "success";
  result: R;
}

export interface ErrorResponse<E> {
  status: "error";
  result: E | AuthorizationError;
}

export type ResponseData<R, E> = SuccessResponse<R> | ErrorResponse<E>;

export type CreateInvoiceSuccess = IInvoice;

export type CancelInvoiceSuccess = ["ok"];

export type InvoiceListSuccess = IInvoice[];

export type InvoiceInformationSuccess = IInvoice[];

export type BalanceSuccess = IBalance[];

export type StatisticsSuccess = IStatistics;

export type StaticWalletSuccess = IStaticWallet;
