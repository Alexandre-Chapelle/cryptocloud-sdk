CryptoCloud SDK

# CryptoCloud SDK

A TypeScript SDK for interacting with the [CryptoCloud API](https://cryptocloud.plus/).

## Installation

```
npm install cryptocloud-sdk
```

## Usage

To use the SDK, import it and create an instance of the `CryptoCloud` class:

```
import { CryptoCloud } from 'cryptocloud-sdk';

const apiKey = 'YOUR_API_KEY';
const shopId = 'YOUR_SHOP_ID';

const cryptoCloud = new CryptoCloud(apiKey, shopId);
```

## Methods

### createInvoice

Create a new invoice.

```
const invoice = await cryptoCloud.createInvoice({
    query: 'Your query here',
    amount: 100.0,
    currency: 'USD',
    add_fields: {},
    order_id: '12345',
    email: 'customer@example.com',
});
```

### cancelInvoice

Cancel an existing invoice.

```
const cancelResponse = await cryptoCloud.cancelInvoice({ uuid: 'YOUR_INVOICE_UUID' });
```

### invoiceList

Retrieve a list of invoices.

```
const invoices = await cryptoCloud.invoiceList({
    start: '2024-01-01',
    end: '2024-01-31',
    offset: 0,
    limit: 100,
});
```

### invoiceInformation

Get detailed information about specific invoices.

```
const invoiceInfo = await cryptoCloud.invoiceInformation({ uuids: ['UUID1', 'UUID2'] });
```

### balance

Check the balance of the merchant wallet.

```
const balance = await cryptoCloud.balance();
```

### statistics

Retrieve statistical data for invoices within a date range.

```
const stats = await cryptoCloud.statistics({ start: '2024-01-01', end: '2024-01-31' });
```

### staticWallet

Create a static wallet.

```
const staticWallet = await cryptoCloud.staticWallet({
    currency: 'USD',
    identify: 'unique_identifier',
});
```

## API Reference

For detailed information on request and response structures, refer to the official [API documentation](docs.cryptocloud.plus).

## Contributing

If you would like to contribute to this project, please fork the repository and submit a pull request.

## License

This project is licensed under the MIT License.

## Contact

If you have any questions or need further assistance, feel free to open an issue or contact the maintainer.
