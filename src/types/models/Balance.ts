import { IBalanceCurrency } from "./BalanceCurrency";

export interface IBalance {
  currency: IBalanceCurrency;
  balance_crypto: number;
  balance_usd: number;
  available_balance: number;
  available_balance_usd: number;
}
