import { CA } from "@arcana/ca-sdk";
import { EthereumProvider } from "../types/ProviderTypes";

let ca: CA | null = null;

const getCA = async () => {
  if (!ca) {
    throw new Error("CA not initialized");
  }
  await ca.init();
  return ca;
};

const initCA = async (provider: EthereumProvider) => {
  ca = new CA();
  ca.setEVMProvider(provider);
  await ca.init();
};

export { getCA, initCA };
