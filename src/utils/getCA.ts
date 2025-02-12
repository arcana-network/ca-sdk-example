import { CA } from "@arcana/ca-sdk";
import { EthereumProvider } from "./typings";

let ca: CA | null = null;

const getCA = async () => {
  if (!ca) {
    // @ts-ignore
    throw new Error("CA not initialized");
  }
  await ca.init();
  return ca;
};

const initCA = async (provider: EthereumProvider) => {
  ca = new CA({
    network: "testnet",
  });
  ca.setEVMProvider(provider);
  await ca.init();
};

export { getCA, initCA };
