import { ethers, BigNumberish } from "ethers";
import { catchAsync, convertToQuoteCurrency } from "../utils";
import { CurrencySymbols, Networks } from "../config";
import * as AlchemyService from "../services/alchemy.service";
import * as QuoteService from "../services/quote.service";
import {getLatestBinanceQuotes} from "../services/binance.service";

interface RequestBody {
  quoteCurrency: CurrencySymbols;
  network: Networks;
  currencies: Array<CurrencySymbols>;
}

interface WalletBalance {
  quoteCurrency: CurrencySymbols;
  currentBalance: BigNumberish;
}

interface CurrencyBalance {
  currency: CurrencySymbols;
  quoteCurrency: CurrencySymbols;
  balance: BigNumberish;
  currentBalanceInQuoteCurrency: BigNumberish;
}

interface PostResponse {
  walletBalance: WalletBalance;
  currencies: Array<CurrencyBalance>;
}

export const post = catchAsync(async (req, res) => {
  const { address } = req.params;
  const { quoteCurrency, network, currencies } =
    req.body as RequestBody;

  const [
    currentCurrencyBalances,
    currentQuotes,
  ] = await Promise.all([
    AlchemyService.getCurrencyBalances(network, address, currencies),
    QuoteService.getClosestQuotes(quoteCurrency, currencies),
  ]);

  const response: PostResponse = {
    walletBalance: currencies.reduce(
      (prev, curr) => {
        return {
          ...prev,
          currentBalance: ethers.BigNumber.from(prev.currentBalance)
            .add(
              convertToQuoteCurrency(
                currentCurrencyBalances[curr],
                curr,
                quoteCurrency,
                currentQuotes[curr]
              )
            )
            .toString(),
        };
      },
      {
        quoteCurrency,
        currentBalance: "0",
      }
    ),

    currencies: currencies.map((currency) => ({
      currency,
      quoteCurrency,
      balance: ethers.BigNumber.from(
        currentCurrencyBalances[currency]
      ).toString(),
      currentBalanceInQuoteCurrency: convertToQuoteCurrency(
        currentCurrencyBalances[currency],
        currency,
        quoteCurrency,
        currentQuotes[currency]
      ).toString(),
    })),
  };

  res.send(response);
});
