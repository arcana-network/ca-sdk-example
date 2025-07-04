import { CA, Network } from "@arcana/ca-sdk";

import { EthereumProvider } from "./typings";

const network = Network.CORAL;

const ca = new CA({
  debug: true,
  network,
});

const getSupportedChains = () => {
  return CA.getSupportedChains(network);
};

const getCA = async () => {
  await ca.init();
  return ca;
};

const initCA = async (provider: EthereumProvider) => {
  ca.setEVMProvider(provider);
  await ca.init();
};

export { getCA, getSupportedChains, initCA };
