import {
  BodyAllowedMethods,
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
  KNOWN_HTTP_STATUS_ERRORS,
  RequestParams,
  RequestParamsBodyAllowed,
  RequestParamsBodyDisallowed,
  ResponseData,
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
    ResponseData<CreateInvoiceSuccess, CreateInvoiceError>
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
      CreateInvoiceSuccess,
      CreateInvoiceError
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
  private async sendRequest<T, R, E>({
    method,
    endpoint,
    optionalHeaders,
    body,
  }: RequestParamsBodyDisallowed<T>): Promise<ResponseData<R, E>> {
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
