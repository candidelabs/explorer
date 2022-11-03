import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { ethers, BigNumberish } from "ethers";
import {
  Env,
  Networks,
  NetworksConfig,
  CurrencySymbols,
} from "../config";

type CurrencyBalances = Record<CurrencySymbols, BigNumberish>;

const BASE_CURRENCY_BALANCE_MAP: CurrencyBalances = {
  UNI: ethers.constants.Zero,
  ETH: ethers.constants.Zero,
  CTT: ethers.constants.Zero,
  WETH: ethers.constants.Zero,
  USDT: ethers.constants.Zero,
};

const ALCHEMY_GOERLI_INSTANCE = createAlchemyWeb3(Env.ALCHEMY_GOERLI_RPC);

const getInstance = (network: Networks) => {
  switch (network) {
    case "Goerli":
      return ALCHEMY_GOERLI_INSTANCE;

    default:
      return ALCHEMY_GOERLI_INSTANCE;
  }
};

const getLatestCurrencyBalances = async (
  network: Networks,
  address: string,
  currencies: Array<CurrencySymbols>
): Promise<CurrencyBalances> => {
  const web3 = getInstance(network);

  let balances: Record<string, BigNumberish>;
  const nativeCurrency = NetworksConfig[network].nativeCurrency;
  if (currencies.includes(nativeCurrency)) {
    const [ethBalance, data] = await Promise.all([
      web3.eth.getBalance(address),
      web3.alchemy.getTokenBalances(
        address,
        currencies
          .filter((currency) => currency !== nativeCurrency)
          .map(
            (currency) => NetworksConfig[network].currencies[currency].address
          )
      ),
    ]);

    balances = data.tokenBalances.reduce(
      (prev, curr) => {
        return {
          ...prev,
          [curr.contractAddress]: ethers.BigNumber.from(curr.tokenBalance),
        };
      },
      { [ethers.constants.AddressZero]: ethers.BigNumber.from(ethBalance) }
    );
  } else {
    const data = await web3.alchemy.getTokenBalances(
      address,
      currencies.map(
        (currency) => NetworksConfig[network].currencies[currency].address
      )
    );

    balances = data.tokenBalances.reduce((prev, curr) => {
      return {
        ...prev,
        [curr.contractAddress]: ethers.BigNumber.from(curr.tokenBalance),
      };
    }, {});
  }

  return currencies.reduce(
    (prev, curr) => {
      return {
        ...prev,
        [curr]: balances[NetworksConfig[network].currencies[curr].address],
      };
    },
    { ...BASE_CURRENCY_BALANCE_MAP }
  );
};

export const getCurrencyBalances = async (
  network: Networks,
  address: string,
  tokens: Array<CurrencySymbols>,
) => {
  return getLatestCurrencyBalances(network, address, tokens);
};
