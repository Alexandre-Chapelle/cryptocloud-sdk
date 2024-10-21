import {
  BalanceError,
  BalanceSuccess,
  BodyAllowedMethods,
  CancelInvoiceError,
  CancelInvoiceSuccess,
  CreateInvoiceError,
  CreateInvoiceSuccess,
  Endpoints,
  ErrorResponse,
  HttpMethodConfig,
  HttpMethodEnum,
  HttpMethods,
  ICancelInvoice,
  ICreateInvoice,
  ICryptoCloud,
  IInvoiceInformation,
  IInvoiceList,
  InvoiceInformationError,
  InvoiceInformationSuccess,
  InvoiceListError,
  InvoiceListSuccess,
  IStaticWallet,
  IStatistics,
  KNOWN_HTTP_STATUS_ERRORS,
  RequestParams,
  RequestParamsBodyAllowed,
  RequestParamsBodyDisallowed,
  ResponseData,
  StaticWalletError,
  StaticWalletSuccess,
  StatisticsError,
  StatisticsSuccess,
  SuccessResponse,
} from "./types";

class CryptoCloud implements ICryptoCloud {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly shopId: string;

  constructor(
    apiKey: string,
    shopId: string,
    baseUrl: string = "https://api.cryptocloud.plus/v2/"
  ) {
    this.apiKey = apiKey;
    this.shopId = shopId;
    this.baseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  }

  public async createInvoice({
    query,
    amount,
    currency,
    add_fields,
    order_id,
    email,
  }: Omit<ICreateInvoice, "shop_id">): Promise<
    ResponseData<CreateInvoiceSuccess, CreateInvoiceError>
  > {
    const sendRequestData: RequestParams<ICreateInvoice> = {
      method: HttpMethodEnum.POST,
      endpoint: "invoice/create",
      body: {
        query,
        shop_id: this.shopId,
        amount,
        currency,
        add_fields,
        order_id,
        email,
      },
    };

    return await this.sendRequest<
      ICreateInvoice,
      CreateInvoiceSuccess,
      CreateInvoiceError
    >({
      ...sendRequestData,
    });
  }

  public async cancelInvoice({
    uuid,
  }: ICancelInvoice): Promise<
    ResponseData<CancelInvoiceSuccess, CancelInvoiceError>
  > {
    const sendRequestData: RequestParams<ICancelInvoice> = {
      method: HttpMethodEnum.POST,
      endpoint: "invoice/merchant/canceled",
      body: {
        uuid,
      },
    };

    return await this.sendRequest<
      ICancelInvoice,
      CancelInvoiceSuccess,
      CancelInvoiceError
    >({
      ...sendRequestData,
    });
  }

  public async invoiceList({
    start,
    end,
    offset,
    limit,
  }: IInvoiceList): Promise<
    ResponseData<InvoiceListSuccess, InvoiceListError>
  > {
    const sendRequestData: RequestParams<IInvoiceList> = {
      method: HttpMethodEnum.POST,
      endpoint: "invoice/merchant/info",
      body: {
        start,
        end,
        offset,
        limit,
      },
    };

    return await this.sendRequest<
      IInvoiceList,
      InvoiceListSuccess,
      InvoiceListError
    >({
      ...sendRequestData,
    });
  }

  public async invoiceInformation({
    uuids,
  }: IInvoiceInformation): Promise<
    ResponseData<InvoiceInformationSuccess, InvoiceInformationError>
  > {
    const sendRequestData: RequestParams<IInvoiceInformation> = {
      method: HttpMethodEnum.POST,
      endpoint: "invoice/merchant/info",
      body: {
        uuids,
      },
    };

    return await this.sendRequest<
      IInvoiceInformation,
      InvoiceInformationSuccess,
      InvoiceInformationError
    >({
      ...sendRequestData,
    });
  }

  public async balance(): Promise<ResponseData<BalanceSuccess, BalanceError>> {
    const sendRequestData: RequestParamsBodyDisallowed = {
      method: HttpMethodEnum.GET,
      endpoint: "merchant/wallet/balance/all",
    };

    return await this.sendRequest<undefined, BalanceSuccess, BalanceError>({
      ...sendRequestData,
    });
  }

  public async statistics({
    start,
    end,
  }: IStatistics): Promise<ResponseData<StatisticsSuccess, StatisticsError>> {
    const sendRequestData: RequestParams<IStatistics> = {
      method: HttpMethodEnum.POST,
      endpoint: "invoice/merchant/statistics",
      body: {
        start,
        end,
      },
    };

    return await this.sendRequest<
      IStatistics,
      StatisticsSuccess,
      StatisticsError
    >({
      ...sendRequestData,
    });
  }

  public async staticWallet({
    shop_id,
    currency,
    identify,
  }: IStaticWallet): Promise<
    ResponseData<StaticWalletSuccess, StaticWalletError>
  > {
    const sendRequestData: RequestParams<IStaticWallet> = {
      method: HttpMethodEnum.POST,
      endpoint: "invoice/static/create",
      body: {
        shop_id,
        currency,
        identify,
      },
    };

    return await this.sendRequest<
      IStaticWallet,
      StaticWalletSuccess,
      StaticWalletError
    >({
      ...sendRequestData,
    });
  }

  private async sendRequest<T, R, E>({
    method,
    endpoint,
    optionalHeaders,
    body,
  }: RequestParams<T>): Promise<ResponseData<R, E>>;
  private async sendRequest<T, R, E>({
    method,
    endpoint,
    optionalHeaders,
    body,
  }: RequestParamsBodyAllowed<T>): Promise<ResponseData<R, E>>;
  private async sendRequest<R, E>({
    method,
    endpoint,
    optionalHeaders,
    body,
  }: RequestParamsBodyDisallowed): Promise<ResponseData<R, E>> {
    if (HttpMethodConfig[method] === false && body !== undefined) {
      throw new Error(`HTTP method ${method} does not support a request body.`);
    }

    const url = this.getFullUrl(endpoint);
    const headers = this.getRequestHeaders(optionalHeaders);
    const options = this.getRequestOptions(method, headers);

    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        if (response.status in KNOWN_HTTP_STATUS_ERRORS) {
          const error: ErrorResponse<E> = await response.json();
          return error;
        }

        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SuccessResponse<R> = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  private getRequestOptions(
    method: HttpMethods,
    headers: HeadersInit,
    body?: BodyInit | undefined
  ): RequestInit {
    const options: RequestInit = {
      method,
      headers,
    };

    if (body !== undefined && this.isBodyAllowed(method)) {
      options.body = body;
    }

    return options;
  }

  private isBodyAllowed(method: HttpMethods): method is BodyAllowedMethods {
    return HttpMethodConfig[method];
  }

  private getRequestHeaders(optionalHeaders?: HeadersInit): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${this.apiKey}`,
      ...optionalHeaders,
    };

    return headers;
  }

  private getFullUrl(endpoint: Endpoints): string {
    return `${this.baseUrl}${endpoint}`;
  }
}
