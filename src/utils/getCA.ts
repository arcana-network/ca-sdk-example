import { CA } from "@arcana/ca-sdk";
import { EthereumProvider } from "./typings";

let ca: CA | null = null;

const getCA = async () => {
  if (!ca) {
    throw new Error("CA not initialized");
  }
  await ca.init();
  return ca;
};

const initCA = async (provider: EthereumProvider) => {
  ca = new CA(provider, {
    network: "testnet",
  });
  await ca.init();
};

export { getCA, initCA };
