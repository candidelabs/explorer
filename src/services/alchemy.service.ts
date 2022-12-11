import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { ethers, BigNumberish } from "ethers";
import {
  Env,
  Networks,
} from "../config";

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
): Promise<Record<string, BigNumberish>> => {
  const web3 = getInstance(network);

  const [ethBalance, data] = await Promise.all([
    web3.eth.getBalance(address),
    web3.alchemy.getTokenBalances(
      address,
      // @ts-ignore
      "erc20",
    ),
  ]);
  return data.tokenBalances.reduce(
    (prev, curr) => {
      return {
        ...prev,
        [curr.contractAddress]: ethers.BigNumber.from(curr.tokenBalance),
      };
    },
    { [ethers.constants.AddressZero]: ethers.BigNumber.from(ethBalance) }
  );
};

export const getCurrencyBalances = async (
  network: Networks,
  address: string,
) => {
  return getLatestCurrencyBalances(network, address);
};
