import { ethers, BigNumberish } from "ethers";
import { catchAsync, convertToQuoteCurrency } from "../utils";
import { CurrencySymbols, getCurrencyFromAddress, Networks, NetworksConfig } from "../config";
import * as AlchemyService from "../services/alchemy.service";
import * as QuoteService from "../services/quote.service";

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
  currency: string;
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
    AlchemyService.getCurrencyBalances(network, address),
    QuoteService.getClosestQuotes(quoteCurrency, currencies, network),
  ]);
  const response: PostResponse = {
    walletBalance: currencies.reduce(
      (prev, curr) => {
        return {
          ...prev,
          currentBalance: ethers.BigNumber.from(prev.currentBalance)
            .add(
              convertToQuoteCurrency(
                currentCurrencyBalances[NetworksConfig[network].currencies[curr].address.toLowerCase()],
                curr,
                quoteCurrency,
                currentQuotes[NetworksConfig[network].currencies[curr].address.toLowerCase()]
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
    currencies: Object.entries(currentCurrencyBalances).map((data) => ({
      currency: data[0],
      quoteCurrency,
      balance: ethers.BigNumber.from(data[1]).toString(),
      currentBalanceInQuoteCurrency: convertToQuoteCurrency(
        data[1],
        getCurrencyFromAddress(data[0], network),
        quoteCurrency,
        currentQuotes[data[0].toLowerCase()]
      ).toString(),
    })),
  };

  res.send(response);
});
