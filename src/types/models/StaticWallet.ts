import { IBalanceCurrency } from "./BalanceCurrency";

export interface IStaticWallet {
  currency: IBalanceCurrency;
  address: string;
  uuid: string;
}
