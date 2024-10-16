export interface AuthorizationError {
  authorization: string;
}

export interface CreateInvoiceMandatoryFieldsError {
  amount?: string;
  shop_id?: string;
}

export interface CreateInvoiceInvalidAmountError {
  amount: string;
}

export interface CreateInvoiceInvalidCurrencyError {
  currency: string;
}

export interface InvoiceListMandatoryFieldsError {
  start: string;
  end: string;
}

export interface ForbiddenError {
  detail: string;
}

export interface ValidateError {
  validate_error: string;
}

export type CreateInvoiceError =
  | CreateInvoiceMandatoryFieldsError
  | CreateInvoiceInvalidAmountError
  | CreateInvoiceInvalidCurrencyError;

export type CancelInvoiceError = ValidateError;

export type InvoiceListError = InvoiceListMandatoryFieldsError | ForbiddenError;

export type InvoiceInformationError = ValidateError | ForbiddenError;

export type BalanceError = ForbiddenError;

export type StatisticsError = ValidateError;

export type StaticWalletError = ValidateError;

export type ApiError =
  | CreateInvoiceError
  | CancelInvoiceError
  | InvoiceListError
  | InvoiceInformationError
  | BalanceError
  | StatisticsError
  | StaticWalletError
  | AuthorizationError
  | ForbiddenError
  | ValidateError;
