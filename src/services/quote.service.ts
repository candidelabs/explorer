import Quote, { IQuote } from "../models/quote.model";
import { CurrencySymbols, ValidQuoteCurrenies } from "../config";
import { dateForTimePeriod } from "../utils";

type CurrencyQuoteMap = Record<CurrencySymbols, number>;

const BASE_CURRENCY_QUOTE_MAP: CurrencyQuoteMap = {
  UNI: 0,
  ETH: 0,
  WETH: 0,
  CTT: 0,
  USDT: 0,
};

export const saveBulk = async (quotes: Array<IQuote>) => {
  return Quote.bulkWrite(
    quotes.map((quote) => ({ insertOne: { document: quote } }))
  );
};

export const getClosestQuotes = async (
  quoteCurrency: CurrencySymbols,
  currencies: Array<CurrencySymbols>,
): Promise<CurrencyQuoteMap> => {
  if (!ValidQuoteCurrenies.includes(quoteCurrency)) {
    throw new Error("Invalid quote currency");
  }

  const startDate = dateForTimePeriod("Hour");
  const quotes = await Quote.aggregate<IQuote>()
    .match({
      $and: [
        { updatedAt: { $gt: startDate } },
        { quoteCurrency: { $eq: quoteCurrency } },
        {
          $or: currencies.map((currency) => ({ currency: { $eq: currency } })),
        },
      ],
    })
    .sort({ updatedAt: "asc" })
    .group({
      _id: "$currency",
      currency: { ["$last"]: "$currency" },
      quoteCurrency: { ["$last"]: "$quoteCurrency" },
      price: { ["$last"]: "$price" },
    });

  return quotes.reduce(
    (prev, curr) => {
      return {
        ...prev,
        [curr.currency]: curr.price,
      };
    },
    { ...BASE_CURRENCY_QUOTE_MAP, [quoteCurrency]: 1 }
  );
};
