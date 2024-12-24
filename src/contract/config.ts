// @ts-nocheck
import { createWalletClient, custom } from "viem";
import { arbitrum, base, mainnet, optimism, polygon } from "viem/chains";

export const walletClientEth = createWalletClient({
  chain: mainnet,
  transport: custom(window.ethereum),
});

export const walletClientOp = createWalletClient({
  chain: optimism,
  transport: custom(window.ethereum),
});

export const walletClientArb = createWalletClient({
  chain: arbitrum,
  transport: custom(window.ethereum),
});

export const walletClientPol = createWalletClient({
  chain: polygon,
  transport: custom(window.ethereum),
});

export const walletClientBase = createWalletClient({
  chain: base,
  transport: custom(window.ethereum),
});
