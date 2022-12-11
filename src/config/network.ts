import { ethers, BigNumberish } from "ethers";
import { Token, WETH9 } from "@uniswap/sdk-core";
import { AppEnvironment, Env } from "./env";
import { CurrencySymbols, CurrencyMeta } from ".";

export type Networks = "Goerli";

type NetworksConfig = {
  nativeCurrency: CurrencySymbols;
  wrappedNativeCurrency: (networkEnv?: AppEnvironment["NETWORK_ENV"]) => string;
  chainId: (networkEnv?: AppEnvironment["NETWORK_ENV"]) => BigNumberish;
  uniswapV3Router: string;
  currencies: Record<CurrencySymbols, { address: string }>;
};

export const ValidNetworks: Array<Networks> = ["Goerli"];

export const NetworksConfig: Record<Networks, NetworksConfig> = {
  Goerli: {
    nativeCurrency: "ETH",
    wrappedNativeCurrency: (networkEnv = Env.NETWORK_ENV) =>
      networkEnv === "mainnet"
        ? "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"
        : "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6",
    chainId: (networkEnv = Env.NETWORK_ENV) =>
      networkEnv === "mainnet" ? "5" : "5",
    uniswapV3Router: "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
    currencies: {
      ETH: { address: ethers.constants.AddressZero },
      UNI: {
        address: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
      },
      CTT: {
        address: "0xFaaFfdCBF13f879EA5D5594C4aEBcE0F5dE733ca",
      },
      USDT: {
        address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      },
    },
  },
};

export const getCurrencyFromAddress = (address: string, network: Networks) => {
  const currency = Object.entries(NetworksConfig[network].currencies).find((data) => data[1].address.toLowerCase() === address.toLowerCase());
  return currency?.[0] ?? address;
}

const populateWETH9 = () => {
  ValidNetworks.forEach((network) => {
    const mainnetChainId = ethers.BigNumber.from(
      NetworksConfig[network].chainId("mainnet")
    ).toNumber();
    const testnetChainId = ethers.BigNumber.from(
      NetworksConfig[network].chainId("testnet")
    ).toNumber();

    WETH9[mainnetChainId] = new Token(
      mainnetChainId,
      NetworksConfig[network].wrappedNativeCurrency("mainnet"),
      CurrencyMeta[NetworksConfig[network].nativeCurrency].decimals,
      NetworksConfig[network].nativeCurrency,
      NetworksConfig[network].nativeCurrency
    );
    WETH9[testnetChainId] = new Token(
      testnetChainId,
      NetworksConfig[network].wrappedNativeCurrency("testnet"),
      CurrencyMeta[NetworksConfig[network].nativeCurrency].decimals,
      NetworksConfig[network].nativeCurrency,
      NetworksConfig[network].nativeCurrency
    );
  });
};
populateWETH9();
