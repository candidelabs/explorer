import { ethers, BigNumberish } from "ethers";
import { CurrencySymbols, CurrencyMeta } from "../config";

export const convertToQuoteCurrency = (
  value: BigNumberish,
  currency: string,
  quoteCurrency: CurrencySymbols,
  price: number
): BigNumberish => {
  if (!value){
    value = 0;
  }
  if (!price){
    price = 0;
  }
  if (!CurrencySymbols.guard(currency)){
    return 0;
  }
  const baseValue = ethers.BigNumber.from(value);
  const baseCurrencyDecimals = CurrencyMeta[currency].decimals;
  const quoteCurrencyDecimals = CurrencyMeta[quoteCurrency].decimals;
  const quotePrice = ethers.utils.parseUnits(
    price.toFixed(quoteCurrencyDecimals),
    quoteCurrencyDecimals
  );

  return baseValue
    .mul(quotePrice)
    .div(ethers.BigNumber.from(10).pow(baseCurrencyDecimals));
};
