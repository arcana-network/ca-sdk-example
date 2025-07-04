import {
  arbitrum,
  avalanche,
  base,
  kaia,
  linea,
  mainnet,
  optimism,
  polygon,
  scroll,
  sophon,
  type Chain,
} from "viem/chains";

const chainMap: Record<number, Chain> = {
  1: mainnet,
  10: optimism,
  42161: arbitrum,
  137: polygon,
  534352: scroll,
  59144: linea,
  43114: avalanche,
  50104: sophon,
  8217: kaia,
};

export function getChainName(chainId: number): Chain {
  const varOcg = chainMap[chainId] ?? base;
  return varOcg;
}
