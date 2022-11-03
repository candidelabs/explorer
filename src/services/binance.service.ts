import axios from "axios";
import { CurrencySymbols, ValidQuoteCurrenies } from "../config";
import { IQuote } from "../models/quote.model";

interface BinanceQuoteResponse {
  symbol: string;
  price: number;
}


const BINANCE_URL = "https://api.binance.com";

export const getLatestBinanceQuotes = async (
  quoteCurrency: CurrencySymbols
): Promise<Array<IQuote>> => {
  if (!ValidQuoteCurrenies.includes(quoteCurrency)) {
    throw new Error("Invalid quote currency");
  }

  const response = await axios.get<Array<BinanceQuoteResponse>>(
    `${BINANCE_URL}/api/v3/ticker/price`,
    {
      params: {
        symbols: JSON.stringify([`ETH${quoteCurrency}`, `UNI${quoteCurrency}`]),
      },
    }
  );

  return response.data.map((quoteResponse) => {
    return {
      currency: quoteResponse.symbol.replaceAll(quoteCurrency, "") as CurrencySymbols,
      quoteCurrency,
      price: quoteResponse.price
    }
  });
};
