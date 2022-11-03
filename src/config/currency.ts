export type CurrencySymbols = "UNI" | "ETH" | "CTT" | "WETH" | "USDT";

type CurrencyMeta = {
  decimals: number;
};

export const ValidQuoteCurrenies: Array<CurrencySymbols> = ["USDT"];

export const ValidCurrencies: Array<CurrencySymbols> = ["UNI", "ETH", "CTT", "WETH"];

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
  WETH: {
    decimals: 18,
  },
  CTT: {
    decimals: 18,
  },
};
