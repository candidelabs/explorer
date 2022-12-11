import {StringUnion} from "../utils/stringUnion";

export const CurrencySymbols = StringUnion(
  "UNI",
  "ETH",
  "CTT",
  "USDT",
);
export type CurrencySymbols = typeof CurrencySymbols.type;

type CurrencyMeta = {
  decimals: number;
};

export const ValidQuoteCurrenies: Array<CurrencySymbols> = ["USDT"];

export const ValidCurrencies: Array<CurrencySymbols> = ["UNI", "ETH", "CTT"];

export const CurrencyMeta: Record<CurrencySymbols, CurrencyMeta> = {
  UNI: {
    decimals: 18,
  },
  USDT: {
    decimals: 6,
  },
  ETH: {
    decimals: 18,
  },
  CTT: {
    decimals: 18,
  },
};
