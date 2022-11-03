import dotenv from "dotenv";

dotenv.config();

export interface AppEnvironment {
  NODE_ENV: "production" | "development";
  NETWORK_ENV: "mainnet" | "testnet";
  NAME: string;
  PORT: number;
  MONGO_URL: string;
  SENTRY_DSN: string;
  ALCHEMY_GOERLI_RPC: string;
}

export const Env: AppEnvironment = {
  NODE_ENV:
    process.env.NODE_ENV === "production" ? "production" : "development",
  NETWORK_ENV:
    process.env.EXPLORER_NETWORK_ENV === "mainnet"
      ? "mainnet"
      : "testnet",
  NAME: "Explorer",
  PORT: Number(process.env.EXPLORER_PORT),
  MONGO_URL: process.env.EXPLORER_MONGODB_URL ?? "",
  SENTRY_DSN: process.env.EXPLORER_SENTRY_DSN ?? "",
  ALCHEMY_GOERLI_RPC: process.env.EXPLORER_ALCHEMY_GOERLI_RPC ?? "",
};
